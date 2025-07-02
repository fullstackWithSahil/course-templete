"use client";
import { ReactNode } from "react";
import MessagesProvider from "./Messageprovider";
import SocketProvider from "./SocketContext";

export default function Layout({children}:{children:ReactNode}) {
	return (
        <SocketProvider>
			<MessagesProvider>
                {children}
			</MessagesProvider>
        </SocketProvider>

	);
}
