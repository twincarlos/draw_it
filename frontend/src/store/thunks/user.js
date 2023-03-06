import { csrfFetch } from '../csrf';

export const SET_USER = 'session/setUser';
export const REMOVE_USER = 'session/removeUser';

const setUser = user => {
  return {
    type: SET_USER,
    user
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER
  };
};

export const login = user => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify(user),
  });
  const data = await response.json();
  dispatch(setUser(data));
  return data;
};

export const restoreUser = () => async dispatch => {
  const response = await csrfFetch('/api/session');
  const data = await response.json();
  dispatch(setUser(data));
  return data;
};

export const signup = user => async (dispatch) => {
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(user)
  });
  const data = await response.json();
  dispatch(setUser(data));
  return data;
};

export const logout = () => async (dispatch) => {
  await csrfFetch('/api/session', { method: 'DELETE' })
    .then(() => dispatch(removeUser()));
};
