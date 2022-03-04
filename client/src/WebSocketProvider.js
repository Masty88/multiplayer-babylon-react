import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { toggleLoading } from './redux/app/appSlice';

const WebSocketContext = createContext();

export const WebSocketProvider = props => {
    const dispatch = useDispatch();
    const[isConnected, setIsConnected]= useState(false)
    const [ ws, setWs ] = useState(null);
    const [ err, setErr ] = useState(null);

    useEffect(() => {
        const socket = io.connect(props.url, {
            auth: {
                token: props.token,
            }
        });

        socket.on('connect', () => {
            setIsConnected(true);
        });

        const errorListener = err => setErr(err);
        socket.on('connect_error', errorListener);

        setWs(socket)
        return () => {
            socket.removeAllListeners();
        }
    }, [ ]);

    return (
        <WebSocketContext.Provider value={{isConnected, ws, err }}>
            {props.children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext)

export default WebSocketContext;
