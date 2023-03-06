import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

function Game() {
    const sessionUser = useSelector(state => state.session.user);
    const game = useSelector(state => state.session.game);

    if (!sessionUser) {
        return <Redirect to='/login' />;
    };

    if (!game) {
        return <Redirect to='/' />;
    };

    return (
        <div className='main game'>
            <h1>Game {game.id}</h1>
        </div>
    );
};

export default Game;
