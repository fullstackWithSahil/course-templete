"use client";

import { useParams } from "next/navigation";
import { createContext, ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<Socket|null>(null);

export default function SocketProvider({children}:{children:ReactNode}){
    const [socket,setSocket] = useState<Socket|null>(null);
    const {chat} = useParams();
    
    useEffect(() => {
        console.log(chat)
        const _socket = io("http://localhost:8080/");
        setSocket(_socket);
        
        // Cleanup function to disconnect socket
        return () => {
            _socket.disconnect();
        };
    }, [chat]);
    
    return(
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}