"use client";
import {io, Socket} from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";

const SocketContext = createContext<Socket|null>(null);

export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket|null>(null);
    const {id} = useParams();
    useEffect(()=>{
        const _socket = io("http://localhost:8080");
        setSocket(_socket);
        _socket.emit('joinRoom',id);
        return()=>{
            _socket.disconnect();
        }
    },[id])
    return(
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export function useSocket() {
    const context = useContext(SocketContext);
    // if (!context) {
    //     throw new Error("useSocket must be used within a SocketProvider");
    // }
    return context;
}