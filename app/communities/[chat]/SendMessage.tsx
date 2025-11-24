"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import { useContext, useRef, useState } from "react";
import { toast } from "sonner"
import axios from "axios";
import { useAuth, useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import FileUploder from "@/components/FileUploder";
import { v4 as uuidv4 } from 'uuid';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAdminContext } from "../components/AdminContext";
import { SocketContext } from "../components/Socketprovider";
import { useMessages } from "../components/MessageProvider";

export default function SendMessage() {
	const {bannedMembers} = useAdminContext();
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const {user} = useUser();
	const {chat} = useParams();
	const socket = useContext(SocketContext);
	const {getToken} = useAuth();
	const inputref = useRef<HTMLInputElement>(null);
	const {state, dispatch} = useMessages();
	
	async function handleClick() {
		try {
			if (!message.trim()) return;
			if (!user?.id) return;
			setLoading(true);
			
			if (bannedMembers.includes(user.id)) {
				toast.error("You are banned from sending messages in this chat");
				return;
			}
			
			const id = uuidv4();
			const newMessage = {
				message,
				sender: user?.id,
				chatId: chat,
				profile: user?.imageUrl,
				name: user?.firstName || "Unknown",
				type: "text",
				id,
				replyTo:state.selectedMessage?state.selectedMessage.id:null,
			}
			const messageToSend = {
				...newMessage,
				replyTo:state.selectedMessage?state.selectedMessage:null,
				content: message,
				type:"text"as const,
				createdAt: String(new Date(Date.now())),
				reactions:[],
				tier:"basic" as const
			};
			dispatch({type:"ADD_MESSAGE",payload:messageToSend});
			socket?.emit("sendMessage", messageToSend);
			
			const token = await getToken();
			await axios.post(`${process.env.NEXT_PUBLIC_CHAT_URL}/message`, newMessage, {
				headers: { Authorization: `Bearer ${token}` },
			});
			
			
			setMessage("");
			dispatch({type:"UN_SELECT_MESSAGE"});
			if(inputref.current){
				inputref.current.focus();
			}
		} catch (error) {
			toast.error("There was an error sending the message");
		} finally {
			setLoading(false);
		}
	}
	
	function clearReply() {
		dispatch({ type:"UN_SELECT_MESSAGE" });
	}
	
	return (
		<div className={`${state.selectedMessage?"row-span-2":""} bg-background`}>
			{state.selectedMessage && (
				<div className="px-4 py-3 bg-muted/50 border-b">
					<div className="flex items-start justify-between gap-3">
						<div className="flex-1 min-w-0">
							<p className="text-xs font-medium text-muted-foreground mb-2">
								Replying to
							</p>
							<div className="flex items-start gap-3">
								<Avatar className="h-8 w-8 flex-shrink-0">
									<AvatarImage src={state.selectedMessage.profile} />
									<AvatarFallback className="text-xs">
										{state.selectedMessage.name?.[0]?.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<div className="flex items-baseline gap-2 mb-1">
										<span className="font-semibold text-sm truncate">
											{state.selectedMessage.name}
										</span>
										<span className="text-xs text-muted-foreground flex-shrink-0">
											{new Date(state.selectedMessage.createdAt).toLocaleString([], {
												dateStyle: "short",
												timeStyle: "short",
											})}
										</span>
									</div>
									<p className="text-sm text-muted-foreground line-clamp-2">
										{state.selectedMessage.content}
									</p>
								</div>
							</div>
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 flex-shrink-0"
							onClick={clearReply}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
			
			<div className="p-4">
				<div className="flex items-end gap-2 mx-auto">
					<FileUploder />					
					<div className="flex-1 relative">
						<Input
							placeholder="Type a message..."
							className="pr-4 min-h-[44px] resize-none"
							value={message}
							ref={inputref}
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									handleClick();
								}
							}}
							disabled={loading}
						/>
					</div>
					
					<Button
						disabled={loading || !message.trim()}
						onClick={handleClick}
						size="icon"
						className="h-[44px] w-[44px] flex-shrink-0"
					>
						<Send className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}