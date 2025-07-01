"use client";
import Inputfield from "./Inputfield";
import MessageBubble from "./MessageBubble";
import MessagesProvider from "./Messageprovider";
import SocketProvider from "./SocketContext";

export default function page() {
	return (
			<MessagesProvider>
        <SocketProvider>
          <div className="grid grid-cols-1 grid-rows-10 h-full">
            <MessageBubble />
            <Inputfield />
          </div>
        </SocketProvider>
			</MessagesProvider>

	);
}
