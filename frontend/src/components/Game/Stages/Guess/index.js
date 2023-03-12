import { useState } from "react";
import { useDispatch } from "react-redux";
import * as taskActions from "../../../../store/thunks/task";
import LZString from "../../../../lz-string";

export default function Guess({ sessionUser, game, task }) {
    const dispatch = useDispatch();
    const [newTask, setNewTask] = useState('');
    
    if (!task) return null;

    function submitTask() {
        dispatch(taskActions.submitNewTask({
            promptId: task.promptId,
            gameId: game.id,
            userId: sessionUser.id,
            task: newTask,
            type: 'Guess',
            round: game.round
        }))
        .then(newGame => ((newGame.stage !== 'Final') && (newGame.stage !== game.stage)) && dispatch(taskActions.getOneTask({ gameId: game.id, userId: sessionUser.id, round: newGame.round })));
    };

    const hasSubmitted = (function () {
        for (let prompt of game.Prompts) {
            for (let promptTask of prompt.Tasks) {
                if (promptTask.round === game.round && promptTask.userId === sessionUser.id) {
                    return promptTask.task;
                };
            };
        };
        return false;
    })();

    return (
        <div className="main guess">
            <h1>Round {game.round}:</h1>
            <h1>It's your turn to guess:</h1>
            <img alt="" src={LZString.decompressFromBase64(task.task)} />
            <input type='text' onChange={e => setNewTask(e.target.value)} value={hasSubmitted ? hasSubmitted : newTask}></input>
            <button onClick={submitTask} disabled={hasSubmitted ? true : false}>Submit</button>
        </div>
    );
};
