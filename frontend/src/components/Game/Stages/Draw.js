import { useState } from "react";
import { useDispatch } from "react-redux";
import * as taskActions from "../../../store/thunks/task";

export default function Draw({ sessionUser, game, task }) {
    const dispatch = useDispatch();
    const [newTask, setNewTask] = useState('');

    if (!task) return null;

    function submitTask() {
        dispatch(taskActions.submitNewTask({
            promptId: task.promptId,
            gameId: game.id,
            userId: sessionUser.id,
            task: newTask,
            type: 'Draw',
            round: game.round
        }))
        .then(newGame => ((newGame.stage !== 'Final') && (newGame.stage !== game.stage)) && dispatch(taskActions.getOneTask({ gameId: game.id, userId: sessionUser.id, round: newGame.round })));
    };

    return (
        <div className="main draw">
            <h1>Round {game.round}:</h1>
            <h1>It's your turn to draw: {task.task}</h1>
            <input type='text' onChange={e => setNewTask(e.target.value)}></input>
            <button onClick={submitTask}>Submit</button>
        </div>
    );
};
