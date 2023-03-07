import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as gameActions from '../../store/thunks/game';

function Game() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const game = useSelector(state => state.session.game);

    if (!sessionUser) {
        return <Redirect to='/login' />;
    };

    if (!game) {
        return <Redirect to='/' />;
    };

    function endGame() {
        dispatch(gameActions.endOneGame(game.id));
    };

    function leaveGame() {
        dispatch(gameActions.leaveOneGame(sessionUser.id));
    };

    function kickOut(userId) {
        dispatch(gameActions.kickPlayerOut({ userId, gameId: game.id }));
    };

    return (
        <div className='main game'>
            {
                sessionUser.isHost ?
                <button onClick={endGame}>End Game</button> :
                <button onClick={leaveGame}>Leave Game</button>
            }
            <h1>Game {game.id}</h1>
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
            { sessionUser.isHost && <button>Start Game</button> }
        </div>
    );
};

export default Game;
