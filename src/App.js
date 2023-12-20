import React, { useState, useCallback, useEffect } from 'react';

import './App.css';
import axios from 'axios';
import Auth from './Components/Auth/Auth';
import MainNavigation from './Containers/Menubar/MainNavigation/MainNavigation';
import { AuthContext } from './context/auth-context';

import Spinner from './Containers/Spinner/Spinner';
import Footer from './Containers/footer/footer';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Components/Home';
import Excercise from './Components/Exercise/Excercise';
import ExerciseDetail from './Components/Exercise/ExerciseDetail';
import Podcast from "./Components/Podcast/Podcast";

import TodaysHabitsPage from "./Components/HabitTracker/habits/TodaysHabitsPage"
import HabitsPage from "./Components/HabitTracker/habits/HabitsPage";
import NewHabitPage from "./Components/HabitTracker/habits/NewHabitPage";
import TotalProgressPage from "./Components/HabitTracker/progress/TotalProgressPage";
import GoalsPage from "./Components/HabitTracker/goals/GoalsPage";
import NewGoalPage from "./Components/HabitTracker/goals/NewGoalPage";

import { ToastContainer } from 'react-toastify'

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';


import Chat from './Components/Chatbot/Chat';
import Main from './Components/Meditation/Main';
import Journal from './Components/Journal/Journal';
import Profile from './Components/Profile/Profile';
// import Dashboard from './Components/MoodTracker/Dashboard';

let logoutTimer;

const App = (props) => {

  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [isLoading, setIsloading] = useState(true)

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    setIsloading(false)
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('profileData');
    let token = null
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    setIsloading(false)
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  let route
  let loading

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <div className="App">
        <ToastContainer />
        <main>
          <Router>
            <MainNavigation />
            <Routes>
              {/* <Route path="/" element={<Home />} /> */}

              <Route
                path="/"
                element={
                  !!token ? (
                    <Home />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />

              <Route path="/auth" element={<Auth />} />

              <Route
                path="/chat"
                element={
                  !!token ? (
                    <Chat />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />


              <Route
                path="/exercise"
                element={
                  !!token ? (
                    <Excercise />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />

              <Route
                path="/exercise/:id"
                element={
                  !!token ? (
                    <ExerciseDetail />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />

              <Route
                path="/meditation"
                element={
                  !!token ? (
                    <Main />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />

              <Route
                path="/journal"
                element={
                  !!token ? (
                    <Journal />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />

              <Route
                path="/podcast"
                element={
                  !!token ? (
                    <Podcast />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />

              {/* <Route
                path="/mood"
                element={
                    <Dashboard />
                }
              /> */}

              <Route
                path="/profile"
                element={
                  !!token ? (
                    <Profile />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />

              <Route path="/today" element={<TodaysHabitsPage />} />
              <Route path="/habits/*">
                <Route index element={<HabitsPage />} />
                <Route path="new-habit" element={<NewHabitPage />} />
                <Route path="edit-habit/:id" element={<NewHabitPage />} />
              </Route>
              <Route path="/progress" element={<TotalProgressPage />} />
              <Route path="/goals/*">
                <Route index element={<GoalsPage />} />
                <Route path="new-goal" element={<NewGoalPage />} />
                <Route path="edit-goal/:id" element={<NewGoalPage />} />
              </Route>


              {isLoading && (
                <Route
                  path="*"
                  element={
                    <div className="container loading">
                      <div className="mar-20">
                        <Spinner />
                      </div>
                    </div>
                  }
                />
              )}
            </Routes>
          </Router>
          {/* <Footer /> */}
        </main>
      </div>
    </AuthContext.Provider>
  );

}

export default (App);
