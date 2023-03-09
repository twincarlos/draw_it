import { useDispatch } from "react-redux";
import * as gameActions from "../../../store/thunks/game";

export default function Lobby({ game, sessionUser }) {
    const dispatch = useDispatch();

    function endGame() {
        dispatch(gameActions.endOneGame({ gameId: game.id, userId: sessionUser.id }));
    };

    function leaveGame() {
        dispatch(gameActions.leaveOneGame(sessionUser.id));
    };

    function kickOut(userId) {
        dispatch(gameActions.kickPlayerOut({ userId, gameId: game.id }));
    };

    async function startGame() {
        dispatch(gameActions.startOneGame({ gameId: game.id, userId: sessionUser.id }));
    };

    return (
        <div className='main lobby'>
            {
                sessionUser.isHost ?
                <button onClick={endGame}>End Game</button> :
                <button onClick={leaveGame}>Leave Game</button>
            }
            <h1>Game {game.pin}</h1>
            <div style={{ display: 'flex', gap: 50 }}>
                {
                    game.Users.map(user => (
                        <div key={user.id} style={{ border: user.isHost && '1px solid red' }}>
                            <img src={user.profilePicture} alt='' style={{ width: 50 }}/>
                            <p>{user.username}</p>
                            { sessionUser.isHost && sessionUser.id !== user.id && <button onClick={() => kickOut(user.id)}>Kick Out</button> }
                        </div>
                    ))
                }
            </div>
            { sessionUser.isHost && <button onClick={startGame}>Start Game</button> }
        </div>
    );
};
