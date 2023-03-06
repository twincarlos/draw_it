import { csrfFetch } from '../csrf';

export const GET_GAME = 'games/GET_GAME';
export const CREATE_GAME = 'games/CREATE_GAME';
export const JOIN_GAME = 'games/JOIN_GAME';
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

const endGame = () => {
    return {
        type: END_GAME
    };
};

const joinGame = payload => {
    return {
        type: JOIN_GAME,
        payload
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

export const joinOneGameByPin = data => async dispatch => {
    const res = await csrfFetch('/api/games/join-game-by-pin', {
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

export const joinOneGameById = data => async dispatch => {
    const res = await csrfFetch('/api/games/join-game-by-id', {
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

export const endOneGame = gameId => async dispatch => {
    await csrfFetch('/api/games/end-game', {
        method: 'DELETE',
        body: JSON.stringify({ gameId })
    })
        .then(dispatch(endGame()));
};
