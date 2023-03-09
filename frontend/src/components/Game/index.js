import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Lobby from './Stages/Lobby';
import Guess from './Stages/Guess';

function Game() {
    const sessionUser = useSelector(state => state.session.user);
    const game = useSelector(state => state.session.game);

    const stages = {
        Lobby: <Lobby sessionUser={sessionUser} game={game} />,
        Guess: <Guess sessionUser={sessionUser} game={game} />
    };

    if (!sessionUser) {
        return <Redirect to='/login' />;
    };

    if (!game) {
        return <Redirect to='/' />;
    };

    return (
        <div className='main game'>
            { stages[game.stage] }
        </div>
    );
};

export default Game;
