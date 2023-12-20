import React, { useEffect, useState } from "react"
import "./Home.css"
import TodaysHabitsPage from "./HabitTracker/habits/TodaysHabitsPage";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { Link } from "react-router-dom";
import fetchUserData from "../utils/fetchUserData"
import PersonalityQuestions from "./Questions/PersonalityQuestions";
import TodayTasks from "./TodayTasks";
const Home = () => {

    const [user, setUser] = useState({});
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const res = await fetchUserData()
            console.log(res.data);
            setUser(res.data);
        }
        fetchData();
    }, [])
    console.log(isShow)
    if (isShow || user.personality) {
        return (
            <div className="home-section">
                {user && <h1 className="welcome">Welcome, {user.username}</h1>}
                <div className="today-habits-container">
                    <TodaysHabitsPage />
                </div>

                <div className="home-cards-container">
                    <Link to="/journal" className="home-card">
                        <MdOutlineStickyNote2 className="w-9 h-9" />
                        <span>Journal</span>
                    </Link>

                    <Link to="/meditation" className="home-card">
                        <MdOutlineStickyNote2 className="w-9 h-9" />
                        <span>Meditate</span>
                    </Link>
                </div>

                <div className="today-tasks-container">
                    <TodayTasks />
                </div>

                <Link to="/progress" className="progress-card">
                    <div className="ag-courses_box">
                        <div className="ag-courses_item">
                            <a href="#" className="ag-courses-item_link">
                                <div className="ag-courses-item_bg"></div>

                                <div className="ag-courses-item_title">
                                    Progress
                                </div>

                                <div className="ag-courses-item_date-box">
                                    Track your progress here
                                </div>
                            </a>
                        </div>
                    </div>
                </Link>
            </div>
        )
    }

    return (
        <div >
            Questions
            <PersonalityQuestions user={user} setUser={setUser} setIsShow={setIsShow} />
        </div>
    )
}

export default Home