"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { Edit, MoreVertical, Trash2, Check, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { MessageType } from "../[id]/Messageprovider";

export default function Message({
	_id,
	profile,
	content,
	firstname,
	sender,
	createdAt,
	updatedAt,
}: MessageType) {
	const { user } = useUser();
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState(content);
	const editInputRef = useRef<HTMLInputElement>(null);

	const isOwnMessage = sender === user?.id;

	useEffect(() => {
		if (isEditing && editInputRef.current) {
			editInputRef.current.focus();
			editInputRef.current.select();
		}
	}, [isEditing]);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSaveEdit = () => {
		if (editContent.trim() && editContent !== content && _id) {
			// onEdit(id, editContent.trim());
		}
		setIsEditing(false);
		setEditContent(content);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditContent(content);
	};

	const handleDelete = () => {};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSaveEdit();
		} else if (e.key === "Escape") {
			handleCancelEdit();
		}
	};

	return (
		<div
			className={`flex items-center gap-3 mx-3 my-1 p-2 rounded-2xl ${
				!isOwnMessage ? "dark:bg-gray-700 bg-gray-100" : ""
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

			{/* Message Content */}
			<div className="flex-1 min-w-0">
				{isEditing ? (
					<div className="flex items-center gap-2">
						<Input
							ref={editInputRef}
							value={editContent}
							onChange={(e) => setEditContent(e.target.value)}
							onKeyDown={handleKeyPress}
							className="flex-1"
							placeholder="Edit your message..."
						/>
						<Button
							size="sm"
							variant="ghost"
							onClick={handleSaveEdit}
							disabled={!editContent.trim()}
							className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
						>
							<Check className="h-4 w-4" />
						</Button>
						<Button
							size="sm"
							variant="ghost"
							onClick={handleCancelEdit}
							className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				) : (
					<>
						<div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
							{firstname}
							{calculateDate(updatedAt,createdAt)}
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-800 dark:text-gray-200">
								{content}
							</span>
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
									<DropdownMenuContent
										align="end"
										className="w-40"
									>
										<DropdownMenuItem
											onClick={handleEdit}
											className="cursor-pointer"
										>
											<Edit className="h-4 w-4 mr-2" />
											Edit message
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={handleDelete}
											className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
										>
											<Trash2 className="h-4 w-4 mr-2" />
											Delete message
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>
					</>
				)}
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

function calculateDate(updatedAt:string,createdAt:string){
    let date = "";
    if(updatedAt==createdAt){
        date = new Date(createdAt||updatedAt).toLocaleString()
    }else{
        date = new Date(updatedAt || createdAt).toLocaleString()
    }
    const today = date.split(",")[0];
    const now = new Date(Date.now())
    const formated = `${now.getMonth()+1}/${now.getDay()-1}/${now.getFullYear()}`
    if(today==formated){
        return date.split(",")[1];
    }else{
        return date.split(",")[0];
    }
}