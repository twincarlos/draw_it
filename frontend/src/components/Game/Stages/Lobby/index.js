import { useDispatch } from "react-redux";
import * as gameActions from "../../../../store/thunks/game";
import './Lobby.css';

export default function Lobby({ game, sessionUser }) {
    const dispatch = useDispatch();

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
            { !sessionUser.isHost && <button onClick={leaveGame}>Leave Game</button> }
            <div className="game-pin">
                <h1>{game.pin}</h1>
                <p>Send this PIN to your friends so they can join!</p>
            </div>
            <div style={{ display: 'flex', gap: 50 }} className='users'>
                {
                    game.Users.map(user => (
                        <div key={user.id} className='user'>
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
