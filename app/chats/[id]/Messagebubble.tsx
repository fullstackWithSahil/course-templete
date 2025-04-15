"use client";

import { useSession } from "@clerk/nextjs";
import { MessageType, useMessageActions, useMessages } from "./context";
import Message from "./Message";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import supabaseClient from "@/lib/Supabase";

export default function Messagebubble() {
    const {id} = useParams();
	const { state } = useMessages();
    const {session} = useSession();
    if(!session) return null;
    const {addMessage} = useMessageActions();

    useEffect(()=>{
        const supabase = supabaseClient(session);
        
        const channels = supabase.channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'messages' },
            (payload) => {
                if(payload.eventType==="INSERT"){
                    addMessage(payload.new as MessageType)
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
