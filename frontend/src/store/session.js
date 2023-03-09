import * as userThunks from './thunks/user';
import * as gameThunks from './thunks/game';

const initialState = { user: null, game: null };

const sessionReducer = (state = initialState, action) => {
  let newState = Object.assign({}, state);

  switch (action.type) {
    case userThunks.SET_USER:
      newState.user = action.user;
      return newState;
    case userThunks.REMOVE_USER:
      newState.user = null;
      newState.game = null;
      return newState;

    case gameThunks.GET_GAME:
    case gameThunks.START_GAME:
      newState.game = action.game;
      return { ...newState };
    case gameThunks.CREATE_GAME:
      newState.game = action.game;
      newState.user = action.game.Users[0];
      return { ...newState };
    case gameThunks.JOIN_GAME:
      newState.game = action.payload.game;
      newState.game.Users = [ ...newState.game.Users, action.payload.player ];
      newState.user = action.payload.player;
      return { ...newState };
    case gameThunks.KICK_OUT:
      newState.game = action.game;
      return { ...newState };
    case gameThunks.LEAVE_GAME:
    case gameThunks.END_GAME:
      newState.game = null;
      newState.user.gameId = null;
      newState.user.isHost = false;
      return { ...newState };

    default:
      return state;
  }
};

export default sessionReducer;
