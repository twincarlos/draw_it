import { useEffect, useRef, createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as gameActions from '../store/thunks/game';
import * as taskActions from '../store/thunks/task';

import { io } from 'socket.io-client';

export const SocketContext = createContext();

export function SocketProvider({ children }) {
    const dispatch = useDispatch();
    const socket = useRef();

    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        if (sessionUser) {
            socket.current = io();

            socket.current.on('game-update', gameId => {
                dispatch(gameActions.getOneGame({ gameId, userId: sessionUser.id }))
                    .then(game => (game && (game.stage !== 'Final' && game.stage !== 'Lobby')) && dispatch(taskActions.getOneTask({ gameId: game.id, userId: sessionUser.id, round: game.round })));
            });
        };

        return () => {
            if (sessionUser) {
                socket.current.disconnect();
            };
        };
    }, [dispatch, sessionUser]);

    return (
        <>
            <SocketContext.Provider value={{ socket }}>
                {children}
            </SocketContext.Provider>
        </>
    );
};