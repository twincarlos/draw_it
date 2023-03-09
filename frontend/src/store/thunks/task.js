import { csrfFetch } from "../csrf";

export const GET_TASK = 'tasks/GET_TASK';
export const SUBMIT_TASK = 'tasks/SUBMIT_TASK';

const getTask = task => {
    return {
        type: GET_TASK,
        task
    };
};
const submitTask = game => {
    return {
        type: SUBMIT_TASK,
        game
    };
};

export const getOneTask = data => async dispatch => {
    if (data.round > 1) {
        const res = await csrfFetch(`/api/tasks/${data.gameId}/${data.userId}/${data.round}`);
        const task = await res.json();
        dispatch(getTask(task));
        return task;
    };
};
export const submitNewTask = data => async dispatch => {
    const res = await csrfFetch('/api/tasks/submit-task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const game = await res.json();
    dispatch(submitTask(game));
    return game;
};
