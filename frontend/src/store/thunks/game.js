import { csrfFetch } from '../csrf';

export const GET_GAME = 'games/GET_GAME';
export const CREATE_GAME = 'games/CREATE_GAME';
export const JOIN_GAME = 'games/JOIN_GAME';
export const LEAVE_GAME = 'games/LEAVE_GAME';
export const KICK_OUT = 'games/KICK_OUT';
export const END_GAME = 'games/END_GAME';

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
const kickOut = payload => {
    return {
        type: KICK_OUT,
        payload
    };
};
const endGame = () => {
    return {
        type: END_GAME
    };
};

export const getOneGame = gameId => async dispatch => {
    const res = await csrfFetch(`/api/games/${gameId}`);
    const data = await res.json();
    dispatch(getGame(data));
    return data;
};
export const createNewGame = () => async dispatch => {
    const res = await csrfFetch('/api/games/new-game', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await res.json();
    dispatch(createGame(data));
    return data;
};
export const joinOneGameAsGuest = data => async dispatch => {
    const res = await csrfFetch('/api/games/join-game-as-guest', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const payload = await res.json();
    if (payload.game) {
        dispatch(joinGame(payload));
    };
    return payload;
};
export const joinOneGameAsHost = data => async dispatch => {
    const res = await csrfFetch('/api/games/join-game-as-host', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const payload = await res.json();
    dispatch(joinGame(payload));
    return payload;
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
    const payload = await res.json();
    dispatch(kickOut(payload));
    return payload;
};
export const endOneGame = gameId => async dispatch => {
    await csrfFetch('/api/games/end-game', {
        method: 'DELETE',
        body: JSON.stringify({ gameId })
    })
        .then(dispatch(endGame()));
};
