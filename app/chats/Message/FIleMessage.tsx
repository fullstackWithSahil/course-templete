"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/nextjs";
import { Download, FileText, MoreVertical, Trash2 } from "lucide-react";
import { MessageType } from "../[id]/Messageprovider";
import { calculateDate, getInitials, handleDownload } from "./Message";

function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function FileMessage({
	_id,
	profile,
	content,
	firstname,
	sender,
	createdAt,
	updatedAt,
}: MessageType) {
	const { user } = useUser();
	const isOwnMessage = sender === user?.id;

	const fileUrl = content;
	const fileName = decodeURIComponent(fileUrl.split("/").pop() || "File");
	const fileSize = 2.4 * 1024 * 1024; // Replace with actual size if available

	const handleDelete = () => {
		console.log("Delete message:", _id);
		// Add delete logic here
	};

	return (
		<div
			className={`flex items-center gap-3 mx-3 my-1 p-2 rounded-2xl ${
				!isOwnMessage ? "dark:bg-gray-700 bg-gray-100" : ""
			}`}
		>
			{/* Avatar */}
			<Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
				<AvatarImage src={profile || undefined} alt={firstname || "User"} />
				<AvatarFallback className="text-xs md:text-sm">
					{firstname ? getInitials(firstname) : "U"}
				</AvatarFallback>
			</Avatar>

			{/* File Content */}
			<div className="flex-1 min-w-0">
				<div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
					{firstname}
					{calculateDate(updatedAt, createdAt)}
				</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        {fileName}
						<div
							onClick={()=>handleDownload(content)}
							className="text-sm cursor-pointer text-blue-700 dark:text-blue-400 underline truncate max-w-[200px]"
						>
                            <Download/>
						</div>
						<span className="text-xs text-gray-500 dark:text-gray-400">
							{formatFileSize(fileSize)}
						</span>
					</div>

					{/* Dropdown for own message */}
					{isOwnMessage && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									size="sm"
									variant="ghost"
									className="h-8 w-8 p-0 ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
								>
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-40">
								<DropdownMenuItem
									onClick={handleDelete}
									className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
								>
									<Trash2 className="h-4 w-4 mr-2" />
									Delete file
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</div>
	);
}
