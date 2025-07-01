import { ReactNode } from "react";
import MessagesProvider from "./context";
import SocketProvider from "./SocketContext";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <SocketProvider>
      <MessagesProvider>
          {children}
      </MessagesProvider>
    </SocketProvider>
  );
}