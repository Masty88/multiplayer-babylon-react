import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {useDispatch, useSelector} from 'react-redux';
import { toggleLoading } from './redux/app/appSlice';

const WebSocketContext = createContext();

export const WebSocketProvider = props => {
    const dispatch = useDispatch();
    const[isConnected, setIsConnected]= useState(false)
    const {user}=useSelector(state=>state.auth)
    const{gaming}=useSelector(state=> state.app)
    const [ ws, setWs ] = useState(null);
    const [ err, setErr ] = useState(null);

    useEffect(() => {
        console.log(gaming)
        if(user){
            const socket = io.connect(props.url, {
                auth: {
                    token: user.token,
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
        }
    }, [user]);

    return (
        <WebSocketContext.Provider value={{isConnected, ws, err }}>
            {props.children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext)

export default WebSocketContext;
