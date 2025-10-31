"use client";
import { MoreVertical, Edit, Trash, Download, Ban } from "lucide-react";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "../ui/dropdown-menu";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import axios from "axios";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { SocketContext } from "@/app/communities/Socketprovider";

export default function Options({
	sender,
	id,
	type,
	content,
	setIsEditing,
}: {
	sender: string;
	id: number;
	type: string;
	content: string;
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { user } = useUser();
  	const teacher = process.env.NEXT_PUBLIC_TEACHER!;
	const isOwner = (user?.id === sender)
	const { chat } = useParams();
	const socket = useContext(SocketContext);
	const { getToken } = useAuth();
	async function handelDelete() {
		try {
			socket?.emit("deleteMessage", {
				id: id,
				chatId: chat,
			});
			const token = await getToken();
			const { data } = await axios.delete(
				`${process.env.NEXT_PUBLIC_WORKER_URL}/message/${id}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			if (!data.success) {
				toast("There was an error deleting the message");
			}
		} catch (error) {
			toast("There was an error deleting the message");
		}
	}
	
	return (
		<>
			{(isOwner) && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							size="sm"
							variant="ghost"
							className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
						>
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{type == "text" && isOwner && (
							<DropdownMenuItem
								onClick={() => setIsEditing(true)}
							>
								<Edit className="mr-2 h-4 w-4" /> Edit
							</DropdownMenuItem>
						)}
						{type != "text" && (
							<DropdownMenuItem
								onClick={() => handleDownload(content)}
							>
								<Download className="mr-2 h-4 w-4" /> Download
							</DropdownMenuItem>
						)}
						<DropdownMenuItem
							className="text-red-600"
							onClick={handelDelete} // hook into backend
						>
							<Trash className="mr-2 h-4 w-4" /> Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</>
	);
}

export async function handleDownload(content: string) {
	try {
		const res = await fetch(content, {
			mode: "cors", // Make CORS explicit
		});

		if (!res.ok) {
			throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
		}

		const blob = await res.blob();
		const url = window.URL.createObjectURL(blob);

		try {
			const a = document.createElement("a");
			a.href = url;

			// Better filename extraction
			const filename =
				content.split("/").pop()?.split("?")[0] || "download";
			a.download = filename;

			document.body.appendChild(a);
			a.click();
			a.remove();
		} finally {
			// Ensure cleanup happens even if there's an error
			window.URL.revokeObjectURL(url);
		}
	} catch (error) {
		console.error("Download failed:", error);
		// Optionally notify the user
		alert("Failed to download file. Please try again.");
	}
}
