import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as gameActions from '../../store/thunks/game';
import './Splash.css';

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

    async function joinGame(e) {
        e.preventDefault();
        await dispatch(gameActions.joinOneGame({ pin: gamePin, userId: sessionUser.id }))
            .then(res => !(res.game) && setError('Game not found.'));
    };

    return (
        <div className='splash main'>
            <img src='https://garticphone.com/images/gartic.svg' alt='' />
            <div>
                { error && <p>{error}</p> }
                <form onSubmit={e => joinGame(e)}>
                    <input placeholder='Enter game PIN' type='text' onChange={e => setGamePin(e.target.value)}></input>
                    <button></button>
                </form>
            </div>
            <div>
                <button onClick={createGame}>Create game</button>
            </div>
        </div>
    );
};

export default Splash;
