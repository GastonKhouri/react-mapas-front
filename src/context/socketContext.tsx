import { createContext } from 'react';
import { Socket } from 'socket.io-client';

import useSocket from '../hooks/useSocket';

interface ContextProps {
    socket: Socket;
    online: boolean;
}

export const SocketContext = createContext( {} as ContextProps );

export const SocketProvider = ( { children }: any ) => {

    const { socket, online } = useSocket( 'http://localhost:8080' );

    return (
        <SocketContext.Provider value={ { socket, online } }>
            { children }
        </SocketContext.Provider>
    );
};
