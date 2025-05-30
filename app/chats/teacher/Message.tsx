//Message.tsx
"use client";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useSocket } from "./SocketContext";

export default function Message({
	isUserMessage,
	profile,
	firstname,
	message,
	id,
	created_at,
}: {
	isUserMessage: boolean;
	profile: string | null;
	firstname: string;
	message: string;
	id: string;
	created_at: string;
}) {
	const socket = useSocket();
	const [editingId, setEditingId] = useState<string| null>(null);
	const [editText, setEditText] = useState("");
	const room = process.env.NEXT_PUBLIC_TEACHER || "teacher";

	async function deleteMessage(id: string) {
		try {
			socket.emit("deleteMessage", {id,room});
			const { data } = await axios.delete(
				"http://localhost:8080/api/messages/deletemessage",
				{ data: { id: id } }
			);
			if (data.error) {
				toast.error("There was an error deleting the message");
				console.log({ error: data.error });
			}
		} catch (error) {
			console.log({ error });
			toast.error("There was an error deleting the message");
		}
	}

	const handleEdit = async (id: string) => {
		try {
			if (editText.trim()) {
				socket.emit("editMessage", { id, message: editText,room });
				setEditingId(null);
				const { data } = await axios.patch(
					"http://localhost:8080/api/messages/editmessage",
					{ id: id, message: editText }
				);
				setEditText("");
				if (data.error) {
					toast.error("There was an error updating the message");
					console.log({ error:data.error });
				}
			}
		} catch (error) {
			console.log({ error });
			toast.error("There was an error updating the message");
		}
	};

	const startEditing = (message: string, id: string) => {
		setEditingId(id);
		setEditText(message || "");
	};

	return (
		<div
			className={`my-2 flex items-start gap-2 md:gap-3 ${
				isUserMessage ? "flex-row-reverse" : "flex-row"
			}`}
		>
			<div className="relative w-full sm:max-w-[85%] md:max-w-[75%]">
				{/* Message bubble */}
				<div
					className={`p-2 md:p-3 rounded-lg shadow-sm flex items-start gap-2 ${
						isUserMessage
							? "bg-blue-500 text-white dark:bg-blue-600"
							: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
					}`}
				>
					{/* Avatar */}
					<Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
						<AvatarImage
							src={profile || undefined}
							alt={firstname || "User"}
						/>
						<AvatarFallback className="text-xs md:text-sm">
							{firstname ? getInitials(firstname) : "U"}
						</AvatarFallback>
					</Avatar>

					{editingId === id ? (
						<div className="flex flex-col gap-2 w-full">
							<Input
								value={editText}
								onChange={(e) => setEditText(e.target.value)}
								onKeyPress={(e) =>
									e.key === "Enter" && handleEdit(id)
								}
								autoFocus
								className="bg-white dark:bg-gray-800 text-sm md:text-base text-black dark:text-white"
							/>
							<div className="flex justify-end gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setEditingId(null)}
									className="text-xs md:text-sm h-7 md:h-8 bg-gray-600"
								>
									Cancel
								</Button>
								<Button
									size="sm"
									onClick={() => handleEdit(id)}
									className="text-xs md:text-sm h-7 md:h-8"
								>
									Save
								</Button>
							</div>
						</div>
					) : (
						<div className="flex-1 break-words">
							<div className="text-sm md:text-base">
								{message}
							</div>
							<div className="text-xs mt-1 opacity-70">
								{new Date(created_at).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</div>
						</div>
					)}

					{/* Action buttons (only for current user's messages) */}
					{isUserMessage && editingId !== id && (
						<div className="self-start ml-auto">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-6 w-6 md:h-8 md:w-8 p-0"
									>
										<MoreVertical className="h-4 w-4 md:h-5 md:w-5" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="dark:bg-gray-800 dark:text-gray-200"
								>
									<DropdownMenuItem
										onClick={() =>
											startEditing(message || "", id)
										}
										className="text-xs md:text-sm dark:hover:bg-gray-700"
									>
										<Edit className="mr-2 h-3 w-3 md:h-4 md:w-4" />
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem
										className="text-red-500 dark:text-red-400 text-xs md:text-sm dark:hover:bg-gray-700"
										onClick={() => deleteMessage(id)}
									>
										<Trash2 className="mr-2 h-3 w-3 md:h-4 md:w-4" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase();
}
