import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../../context/auth-context'
import './NavLinks.css';
import { useNavigate } from 'react-router-dom';
const NavLinks = props => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  function onLgout() {
    
    auth.logout()
    navigate('/auth')

  }
  return <ul className="nav-links">
    <li>
      <NavLink to="/" exact>Home</NavLink>
    </li>
    {auth.isLoggedIn && (<> 
      <li>
        <NavLink to="/journal">Journal</NavLink>
      </li>
      <li>
        <NavLink to="/meditation">Meditate</NavLink>
      </li>
      {/* <li>
        <NavLink to="/podcast">Podcast</NavLink>
      </li> */}
      <li>
        <NavLink to="/exercise">Exercises</NavLink>
      </li>
      <li>
        <NavLink to="/chat">Connect</NavLink>
      </li>
      <li>
        <NavLink to="/habits">Habits</NavLink>
      </li>
      <li>
        <NavLink to="/profile">Profile</NavLink>
      </li>
      </>
    )}

    {!auth.isLoggedIn && (
      <li>
        <NavLink to="/auth">Login/Register</NavLink>
      </li>
    )}

    {auth.isLoggedIn && (
      <li>
        <button onClick={onLgout}>Logout</button>
      </li>
    )}
  </ul>
};

export default NavLinks;