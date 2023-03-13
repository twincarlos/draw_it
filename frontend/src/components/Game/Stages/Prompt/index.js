import { useState } from "react";
import { useDispatch } from "react-redux";
import * as taskActions from '../../../../store/thunks/task';
import './Prompt.css';

export default function Prompt({ sessionUser, game }) {
    const dispatch = useDispatch();
    const [newTask, setNewTask] = useState('');

    function submitTask(e) {
        e.preventDefault();
        dispatch(taskActions.submitNewTask({
            gameId: game.id,
            userId: sessionUser.id,
            task: newTask,
            type: 'Guess',
            round: 1
        }))
        .then(newGame => (newGame.stage !== game.stage) && dispatch(taskActions.getOneTask({ gameId: game.id, userId: sessionUser.id, round: newGame.round })));
    };

    const hasSubmitted = (function() {
        for (let prompt of game.Prompts) {
            for (let task of prompt.Tasks) {
                if (task.round === game.round && task.userId === sessionUser.id) {
                    return task.task;
                };
            };
        };
        return false;
    })();

    return (
        <div className="main prompt">
            <p>Write a random prompt to draw</p>
            <form onSubmit={e => submitTask(e)}>
                <input type='text' onChange={e => setNewTask(e.target.value)} value={hasSubmitted ? hasSubmitted : newTask}></input>
                <button onClick={submitTask} className={hasSubmitted && 'disabled'} disabled={hasSubmitted ? true : false}>Submit</button>
            </form>
        </div>
    );
};
