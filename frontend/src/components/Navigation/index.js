import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Navigation.css';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/thunks/user';

function Navigation({ isLoaded }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);

  if (!isLoaded) return null;

  function logOut(e) {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  return (
    <ul>
      <li>
        <NavLink exact to="/">Home</NavLink>
        {sessionUser ?
          (
            <>
              <button onClick={logOut}>Log Out</button>
            </>
          ) :
          (
            <>
              <NavLink to="/login">Log In</NavLink>
              <NavLink to="/signup">Sign Up</NavLink>
            </>
          )
        }
      </li>
    </ul>
  );
}

export default Navigation;
