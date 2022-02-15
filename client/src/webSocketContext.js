import {createContext, useContext, useEffect, useState} from "react";
import {io} from "socket.io-client";

const WebSocketContext= createContext();

export const WebSocketProvider = props =>{
    const [ws, setWs]= useState(null);
    const[isConnected, setIsConnected]= useState(false)
    const [err, setErr]= useState(null);

    useEffect(()=>{
        const socket= io.connect(props.url);

        socket.on('connect',()=>{
            setIsConnected(true)
        })


        const errorListener = err=> setErr(err)

        socket.on('connect_error', errorListener)

        setWs(socket)
        return()=>{
            socket.off('connect_error', errorListener)
        }

    },[])

    return(
        <WebSocketContext.Provider value={ {isConnected,ws, err} }>
            {props.children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocket = ()=> useContext(WebSocketContext)

export default WebSocketContext;
