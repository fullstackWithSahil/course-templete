"use client";

import { useParams } from "next/navigation";
import { createContext, ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const SocketContext = createContext<Socket|null>(null);

export default function SocketProvider({children}:{children:ReactNode}){
    const [socket,setSocket] = useState<Socket|null>(null);
    const {id} = useParams();
    useEffect(()=>{
        const _socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!)
        setSocket(_socket)
    },[id])
    return(
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}