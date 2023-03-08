import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as gameActions from '../../store/thunks/game';

function Splash() {
    const dispatch = useDispatch();
    const [gamePin, setGamePin] = useState('');
    const [error, setError] = useState(null);
    const sessionUser = useSelector(state => state.session.user);
    const game = useSelector(state => state.session.game);

    if (!sessionUser) {
        return <Redirect to='/login'/>;
    };

    if (game) {
        return <Redirect to='/game'/>;
    };

    async function createGame() {
        dispatch(gameActions.createNewGame(sessionUser.id))
    };

    async function joinGame() {
        await dispatch(gameActions.joinOneGame({ pin: gamePin, userId: sessionUser.id }))
            .then(res => !(res.game) && setError('Game not found.'));
    };

    return (
        <div className='splash main'>
            <h1>Draw It!</h1>
            { error && <p>{error}</p> }
            <input type='text' onChange={e => setGamePin(e.target.value)}></input>
            <button onClick={joinGame}>JOIN GAME</button>
            <button onClick={createGame}>CREATE GAME</button>
        </div>
    );
};

export default Splash;
