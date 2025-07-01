import { ReactNode } from "react";
import SocketProvider from "./SocketContext";
import MessagesProvider from "./Messageprovider";

export default function layout({children}:{children:ReactNode}) {
  return (
    <SocketProvider>
        <MessagesProvider>
            {children}
        </MessagesProvider>
    </SocketProvider>
  )
}