import * as userThunks from './thunks/user';
import * as gameThunks from './thunks/game';

const initialState = { user: null, game: null };

const sessionReducer = (state = initialState, action) => {
  let newState;

  switch (action.type) {
    case userThunks.SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.user;
      return newState;
    case userThunks.REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      newState.game = null;
      return newState;

    case gameThunks.GET_GAME:
      newState = Object.assign({}, state);
      newState.game = action.game;
      return { ...newState };
    case gameThunks.CREATE_GAME:
      newState = Object.assign({}, state);
      newState.game = action.game;
      return { ...newState };
    case gameThunks.JOIN_GAME:
      newState = Object.assign({}, state);
      newState.game = action.payload.game;
      newState.user = action.payload.player;
      return { ...newState };
    case gameThunks.END_GAME:
      newState = Object.assign({}, state);
      newState.user.gameId = null;
      newState.user.isHost = false;
      newState.game = null;
      return { ...newState };

    default:
      return state;
  }
};

export default sessionReducer;
