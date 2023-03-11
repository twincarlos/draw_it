import { useRef } from "react";
import { useDispatch } from "react-redux";
import * as taskActions from "../../../store/thunks/task";
import CanvasDraw from "react-canvas-draw";

export default function Draw({ sessionUser, game, task }) {
    const dispatch = useDispatch();
    const canvasRef = useRef(null);

    if (!task) return null;

    function submitTask() {
        dispatch(taskActions.submitNewTask({
            promptId: task.promptId,
            gameId: game.id,
            userId: sessionUser.id,
            task: canvasRef.current.getDataURL(),
            type: 'Draw',
            round: game.round
        }))
        .then(newGame => ((newGame.stage !== 'Final') && (newGame.stage !== game.stage)) && dispatch(taskActions.getOneTask({ gameId: game.id, userId: sessionUser.id, round: newGame.round })));
    };

    return (
        <div className="main draw">
            <h1>Round {game.round}:</h1>
            <h1>It's your turn to draw: {task.task}</h1>
            <CanvasDraw
            lazyRadius={0}
            hideGrid={true}
            ref={canvasRef}
            />
            <button onClick={submitTask}>Submit</button>
        </div>
    );
};
