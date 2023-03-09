import { csrfFetch } from '../csrf';

export const GET_GAME = 'games/GET_GAME';
export const CREATE_GAME = 'games/CREATE_GAME';
export const JOIN_GAME = 'games/JOIN_GAME';
export const LEAVE_GAME = 'games/LEAVE_GAME';
export const KICK_OUT = 'games/KICK_OUT';
export const END_GAME = 'games/END_GAME';
export const START_GAME = 'games/START_GAME';

const getGame = game => {
    return {
        type: GET_GAME,
        game
    };
};
const createGame = game => {
    return {
        type: CREATE_GAME,
        game
    };
};
const joinGame = payload => {
    return {
        type: JOIN_GAME,
        payload
    };
};
const leaveGame = () => {
    return {
        type: LEAVE_GAME
    };
};
const kickOut = game => {
    return {
        type: KICK_OUT,
        game
    };
};
const endGame = () => {
    return {
        type: END_GAME
    };
};
const startGame = game => {
    return {
        type: START_GAME,
        game
    }
};

export const getOneGame = data => async dispatch => {
    const res = await csrfFetch(`/api/games/${data.gameId}/${data.userId}`);
    const game = await res.json();
    dispatch(getGame(game));
    return game;
};
export const createNewGame = userId => async dispatch => {
    const res = await csrfFetch('/api/games/new-game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    });
    const game = await res.json();
    dispatch(createGame(game));
    return game;
};
export const joinOneGame = data => async dispatch => {
    const res = await csrfFetch('/api/games/join-game', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const game = await res.json();
    if (game) {
        dispatch(joinGame(game));
    };
    return game;
};
export const leaveOneGame = userId => async dispatch => {
    await csrfFetch('/api/games/leave-game', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })
        .then(dispatch(leaveGame()));
};
export const kickPlayerOut = data => async dispatch => {
    const res = await csrfFetch('/api/games/kick-out', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const game = await res.json();
    dispatch(kickOut(game));
    return game;
};
export const endOneGame = data => async dispatch => {
    await csrfFetch('/api/games/end-game', {
        method: 'DELETE',
        body: JSON.stringify(data)
    })
        .then(dispatch(endGame()));
};
export const startOneGame = data => async dispatch => {
    const res = await csrfFetch('/api/games/start-game', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    const game = await res.json();
    dispatch(startGame(game));
    return game;
};
