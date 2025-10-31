"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner"
import axios from "axios";
import { useAuth, useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import FileUploder from "@/components/FileUploder";
import { v4 as uuidv4 } from 'uuid';
import { SocketContext } from "../Socketprovider";
import { useAdminContext } from "../AdminContext";

export default function SendMessage() {
	const {bannedMembers} = useAdminContext();
	const [message,setMessage] = useState("");
	const [loading,setLoading] = useState(false);
	const {user} = useUser();
	const {chat} = useParams();
	const socket = useContext(SocketContext);
	const {getToken} = useAuth();
	async function handleClick(){
		try {
			if(!message) return;
			setLoading(true);
			if(bannedMembers.includes(user?.id||"")) {
				toast("You are banned from sending messages in this chat");
				return;
			}
			const id = uuidv4();
			const newMessage={
				message,
				sender:user?.id,
				chatId:chat,
				profile:user?.imageUrl,
				name:user?.firstName,
                type:"text",
				id,
			}
			const token = await getToken();
			await axios.post(`${process.env.NEXT_PUBLIC_WORKER_URL}/message`,newMessage,{
				headers: { Authorization: `Bearer ${token}` },
			});
			socket?.emit("sendMessage", {
				...newMessage,
				content:message,
				createdAt:Date.now(),
				updatedAt:Date.now()
			});
		} catch (error) {
			toast("There was an error sending the message");
		}finally{
			setLoading(false);
			setMessage("");
		}
	}
	return (
		<div className="grid grid-cols-11 md:grid-cols-12 px-3 gap-1 mb-2">
            <FileUploder/>
			<Input 
				className="col-span-7 md:col-span-9" 
				value={message} 
				onChange={(e)=>setMessage(e.target.value)}
				onKeyDown={(e)=>{
					if(e.key=="Enter"){
						handleClick();
					}
				}}
			/>
			<Button disabled={loading} className="col-span-3 md:col-span-2" onClick={handleClick}>
				Send
				<Send />
			</Button>
		</div>
	);
}
