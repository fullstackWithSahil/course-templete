"use client";

import { useSession } from "@clerk/nextjs";
import { useEffect } from "react";
import  { MessageType, useMessageActions } from "./context";
import Inputfield from "./Inputfield";
import Messagebubble from "./Messagebubble";
import axios from "axios";
import { toast } from "sonner";


export default function page() {
	const { session } = useSession();
    if (!session) return null;
	const { addMessage,clearMessages } = useMessageActions();
	
	useEffect(() => {
		clearMessages();
		axios.get(`http://localhost:8080/api/messages/getMessages?chat=${process.env.NEXT_PUBLIC_TEACHER}`)
			.then(({data})=>{
				data.forEach((message:MessageType) => {
					addMessage(message);
				});
			}).catch((error)=>{
				console.log(error)
				toast.error("Error fetching messages");
			})
	},[]);

	return (
		<div className="w-full">
			<Messagebubble/>
			<Inputfield/>
		</div>
	);
}