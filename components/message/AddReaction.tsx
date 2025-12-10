"use client";

import { Reply, Smile } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { MessageType } from "./Message";
import EmojiPicker from "emoji-picker-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useContext, useState } from "react";
import { useParams } from "next/navigation";
import { useMessages } from "@/app/communities/components/MessageProvider";
import { SocketContext } from "@/app/communities/components/Socketprovider";

const emojis = [
	{ emoj: "❤️", text: ":Heart:" },
	{ emoj: "👍", text: ":Thumbs up:" },
	{ emoj: "👎", text: "Thumbs down:" },
];

export default function AddReaction({
	messageId,
	message,
}: {
	messageId: string;
	message: MessageType;
}) {
	const { getToken, userId } = useAuth();
	const [open, setOpen] = useState(false);
	const { dispatch } = useMessages();
	const { chat } = useParams();
	const socket = useContext(SocketContext);

	async function handelReaction(emoji: string) {
		try {
			const token = await getToken();
			const data = await axios.post(
				`${process.env.NEXT_PUBLIC_CHAT_URL}/messages/reaction`,
				{
					messageId,
					reaction: {
						emoji,
					},
					user: userId,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						tenent: process.env.NEXT_PUBLIC_TEACHER!,
					},
				}
			);
			socket?.emit("addReaction", {
				chatId: chat,
				emoji,
				user: userId,
				messageId,
			});
		} catch (error) {
			toast("There was an error reacting to this message");
		}
	}

	return (
		<div className="hidden group-hover:flex items-center absolute right-3 top-[-12%] bg-gray-200 dark:bg-gray-600 pl-5 text-2xl rounded-l-md">
			{emojis.map((e) => (
				<Tooltip key={e.text}>
					<TooltipTrigger onClick={() => handelReaction(e.emoj)}>
						<div>{e.emoj}</div>
					</TooltipTrigger>
					<TooltipContent>
						<div className="text-md">{e.text}</div>
						<p>Click to react</p>
					</TooltipContent>
				</Tooltip>
			))}

			<Tooltip>
				<TooltipTrigger asChild>
					<DropdownMenu open={open} onOpenChange={setOpen}>
						<DropdownMenuTrigger asChild>
							<button className="outline-none">
								<Smile />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" side="top">
							<EmojiPicker
								onEmojiClick={(emoji) => {
									handelReaction(emoji.emoji);
									setOpen(false);
								}}
							/>
						</DropdownMenuContent>
					</DropdownMenu>
				</TooltipTrigger>
				<TooltipContent>
					<div className="text-md">:React:</div>
					<p>Select emoji to react</p>
				</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger
					onClick={() => {
						dispatch({ type: "SELECT_MESSAGE", payload: message });
					}}
				>
					<span>
						<Reply />
					</span>
				</TooltipTrigger>
				<TooltipContent>
					<div className="text-md">:Reply:</div>
					<p>Reply to this message</p>
				</TooltipContent>
			</Tooltip>
		</div>
	);
}
