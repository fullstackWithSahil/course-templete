"use client";

import { useSession } from "@clerk/nextjs";
import { useMessageActions, useMessages } from "./context";
import Message from "./Message";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useSocket } from "./SocketContext";

export default function Messagebubble() {
    const {id} = useParams();
	const {state} = useMessages();
    const {session} = useSession();
    
    if(!session) return null;
    const {addMessage,updateMessage,deleteMessage} = useMessageActions();
	const socket = useSocket();
	useEffect(()=>{
		socket.on("receiveMessage",(message)=>{
			addMessage({
				...message,
				created_at:"11/22/2023",
			})
		});

		socket.on("receiveEditMessage",(message)=>{
			updateMessage(message.id,message);
		});
		
		socket.on("receiveDeleteMessage",(id)=>{
			console.log(id);
			deleteMessage(id);
		});
	},[id]);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        console.log(state.length)
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    },[state.length]);

	return (
		<div className="h-[75vh] overflow-y-scroll mx-2">
			{state.map((message) => (
				<Message
					key={message.id}
					firstname={message.firstname || ""}
					created_at={message.created_at}
					id={message.id}
					isUserMessage={message.sender === session.user.id}
					profile={message.profile}
					message={message.message || ""}
				/>
			))}
            <div ref={messagesEndRef}></div>
		</div>
	);
}
