import { useState } from "react";
import { useDispatch } from "react-redux";
import * as taskActions from '../../../store/thunks/task';

export default function Prompt({ sessionUser, game }) {
    const dispatch = useDispatch();
    const [task, setTask] = useState('');

    function submitTask() {
        dispatch(taskActions.submitNewTask({
            gameId: game.id,
            userId: sessionUser.id,
            task,
            type: 'Guess',
            round: 1
        }));
    };

    return (
        <div className="main prompt">
            <input type='text' onChange={e => setTask(e.target.value)}></input>
            <button onClick={submitTask}>Submit</button>
        </div>
    );
};
