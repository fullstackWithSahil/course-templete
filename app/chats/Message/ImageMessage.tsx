"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { MessageType } from "../[id]/Messageprovider";
import { useUser } from "@clerk/nextjs";
import { calculateDate, getInitials, handleDownload } from "./Message";

export default function ImageMessage({
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
	const fileName = content.split("/").pop()?.split("?")[0] || "file";

	const handleDelete = () => {
		// TODO: Hook this up to your delete logic
		console.log("Delete message:", _id);
	};

	return (
		<div
			className={`flex flex-col mx-3 my-2 p-4 rounded-2xl shadow-sm transition-all 
        ${!isOwnMessage ? "dark:bg-gray-700 bg-gray-100" : ""}
        `}
		>
			{/* Header: Avatar and Meta */}
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-3">
					<Avatar className="h-9 w-9">
						<AvatarImage
							src={profile || undefined}
							alt={firstname || "User"}
						/>
						<AvatarFallback>
							{firstname ? getInitials(firstname) : "U"}
						</AvatarFallback>
					</Avatar>
					<div className="text-sm text-gray-700 dark:text-gray-300 leading-tight">
						<p className="font-medium">{firstname || "Unknown"}</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							{calculateDate(updatedAt, createdAt)}
						</p>
					</div>
				</div>

				{/* Delete Button for Own Message */}
				{isOwnMessage && (
					<Button
						variant="ghost"
						size="icon"
						onClick={handleDelete}
						className="text-red-500 hover:text-red-600 w-6 h-6"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				)}
			</div>

			{/* Image Preview */}
			<div className="rounded-xl overflow-hidden relative w-fit">
				<img
					src={content}
					alt={fileName}
					className="w-3/4 h-auto object-cover transition-all"
				/>
				<div className="absolute inset-0 z-10 flex items-center justify-center bg-white dark:bg-black opacity-0 hover:opacity-50 w-3/4">
					<Download
						onClick={()=>handleDownload(content)}
						className="text-blue-700 dark:text-blue-400 w-6 h-6"
					/>
				</div>
			</div>
		</div>
	);
}
