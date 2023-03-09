import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Lobby from './Stages/Lobby';
import Prompt from './Stages/Prompt';
import Draw from './Stages/Draw';
import Guess from './Stages/Guess';
import Final from './Stages/Final';

function Game() {
    const sessionUser = useSelector(state => state.session.user);
    const game = useSelector(state => state.session.game);
    const task = useSelector(state => state.session.task);

    const stages = {
        Lobby: <Lobby sessionUser={sessionUser} game={game} />,
        Prompt: <Prompt sessionUser={sessionUser} game={game} />,
        Draw: <Draw sessionUser={sessionUser} game={game} task={task} />,
        Guess: <Guess sessionUser={sessionUser} game={game} task={task} />,
        Final: <Final game={game} />
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
