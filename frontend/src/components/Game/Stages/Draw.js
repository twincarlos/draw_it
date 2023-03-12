import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import * as taskActions from "../../../store/thunks/task";
import CanvasDraw from "react-canvas-draw";
import LZString from "../../../lz-string";

export default function Draw({ sessionUser, game, task }) {
    const dispatch = useDispatch();
    const canvasRef = useRef(null);
    const [brushRadius, setBrushRadius] = useState(5);
    const [brushColor, setBrushColor] = useState("#444");

    if (!task) return null;

    function submitTask() {
        dispatch(taskActions.submitNewTask({
            promptId: task.promptId,
            gameId: game.id,
            userId: sessionUser.id,
            task: LZString.compressToBase64(canvasRef.current.getDataURL()),
            type: 'Draw',
            round: game.round
        }))
        .then(newGame => ((newGame.stage !== 'Final') && (newGame.stage !== game.stage)) && dispatch(taskActions.getOneTask({ gameId: game.id, userId: sessionUser.id, round: newGame.round })));
    };

    const hasSubmitted = (function () {
        for (let prompt of game.Prompts) {
            for (let promptTask of prompt.Tasks) {
                if (promptTask.round === game.round && promptTask.User.id === sessionUser.id) {
                    return LZString.decompressFromBase64(promptTask.task);
                };
            };
        };
        return false;
    })();

    return (
        <div className="main draw" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <h1>Round {game.round}:</h1>
            <h2>It's your turn to draw:</h2>
            <h1>{task.task}</h1>
            {
                hasSubmitted ?
                <img alt="" src={hasSubmitted}/> :
                <CanvasDraw
                lazyRadius={0}
                hideGrid={true}
                canvasWidth={window.innerWidth / 100 * 90}
                canvasHeight={window.innerHeight / 100 * 60}
                ref={canvasRef}
                brushRadius={brushRadius}
                brushColor={brushColor}
                />

            }
            <div style={{ display: 'flex' }}>
                <p>Line weight:</p>
                <input type='range' min={1} max={30} onChange={e => setBrushRadius(e.target.value)}></input>
            </div>
            <div style={{ display: 'flex' }}>
                <p>Line color:</p>
                <input type='color' onChange={e => setBrushColor(e.target.value)}></input>
            </div>
            <button onClick={submitTask} disabled={hasSubmitted ? true : false}>Submit</button>
        </div>
    );
};
