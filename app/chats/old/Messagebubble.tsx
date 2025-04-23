"use client";

import { useSession } from "@clerk/nextjs";
import { Messages, MessageType, useMessageActions, useMessages } from "./context";
import Message from "./Message";
import { useContext, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import supabaseClient from "@/lib/Supabase";

export default function Messagebubble() {
    const {id} = useParams();
	const {state} = useMessages();
    const data = useContext(Messages);
    console.log({data})
    const {session} = useSession();
    
    if(!session) return null;
    const {addMessage,updateMessage,deleteMessage} = useMessageActions();
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        console.log(state.length)
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    },[state.length]);

    useEffect(()=>{
        const supabase = supabaseClient(session);
        
        const channels = supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'messages',filter:`course=eq.${id}` },
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
		<div className="h-[75%] overflow-y-scroll mx-2">
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
