"use client";

import { useSession } from "@clerk/nextjs";
import { MessageType, useMessageActions, useMessages } from "./context";
import Message from "./Message";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import supabaseClient from "@/lib/Supabase";

export default function Messagebubble() {
    const {id} = useParams();
	const { state } = useMessages();
    const {session} = useSession();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    if(!session) return null;
    const {addMessage,updateMessage,deleteMessage} = useMessageActions();

    useEffect(()=>{
        const supabase = supabaseClient(session);
        
        const channels = supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'messages' },
            (payload) => {
                if(payload.eventType==="INSERT"){
                    addMessage(payload.new as MessageType)
                    setTimeout(() => {
                        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                }else if(payload.eventType==="DELETE"){
                    console.log(payload)
                    deleteMessage(payload.old.id);
                }else if(payload.eventType==="UPDATE"){
                    console.log(payload)
                    updateMessage(Number(payload.old.id),{message:payload.new.message});
                }
            }
        )
        .subscribe()
    },[id]);

	return (
		<div className="h-[80%] overflow-y-scroll">
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
		</div>
	);
}
