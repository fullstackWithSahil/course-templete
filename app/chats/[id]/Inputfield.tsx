"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import API from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { SocketContext } from "./SocketContext";

import FIleuploder from "./FIleuploder";
import { Send } from "lucide-react";

export default function Inputfield() {
	const [newMessage, setNewMessage] = useState("");
	const { id } = useParams();
	const { user } = useUser();
	const socket = useContext(SocketContext);

	async function handleClick() {
		try {
			const MessageToSend = {
				chat: id,
				sender: user?.id || "sahil",
				content: newMessage,
				profile: user?.imageUrl,
				firstname: user?.firstName,
				type: "text",
			};
			socket?.emit("sendMessage", MessageToSend);
			const { data } = await API.post("/messages/create", MessageToSend);
			setNewMessage("");
		} catch (error) {
			console.log({ error });
			toast("There was an error sending the message");
		}
	}

	return (
		<div className="grid grid-cols-20 gap-2 grid-rows-1 border-t-2 py-3 px-4">
			<FIleuploder />

			<Input
				value={newMessage}
				onChange={(e) => setNewMessage(e.target.value)}
				className="col-span-16"
				onKeyDown={(e) => {
					if (e.nativeEvent.key == "Enter") {
						handleClick();
					}
				}}
				placeholder="Type a message..."
			/>

			<Button className="col-span-3" onClick={handleClick}>
				Send <Send className="ml-2 w-4 h-4" />
			</Button>
		</div>
	);
}
