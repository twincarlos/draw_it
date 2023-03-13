import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Lobby from './Stages/Lobby';
import Prompt from './Stages/Prompt';
import Draw from './Stages/Draw';
import Guess from './Stages/Guess';
import Final from './Stages/Final';
import * as gameActions from "../../store/thunks/game";
import './Game.css';

function Game() {
    const sessionUser = useSelector(state => state.session.user);
    const game = useSelector(state => state.session.game);
    const task = useSelector(state => state.session.task);
    const dispatch = useDispatch();

    function endGame() {
        dispatch(gameActions.endOneGame({ gameId: game.id, userId: sessionUser.id }));
    };

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

    const gameCounter = (function() {
        let counter = 0;
        for (let prompt of game.Prompts) {
            for (let task of prompt.Tasks) {
                if (task.round === game.round) {
                    counter++;
                };
            };
        };
        return counter;
    })();

    return (
        <div className='main game'>
            <div className='game-header'>
                { sessionUser.isHost && <button onClick={endGame}>End Game</button> }
                {
                    game.stage !== 'Lobby' && game.stage !== 'Final' &&
                    <div className='game-update'>
                        <p>Round: { game.round } / {game.Prompts.length}</p>
                        <p>{gameCounter} / {game.Prompts.length}</p>
                    </div>
                }
            </div>
            { stages[game.stage] }
        </div>
    );
};

export default Game;
