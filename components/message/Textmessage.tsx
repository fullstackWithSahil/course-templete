import React, { Dispatch, useContext, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { SocketContext } from "@/app/communities/Socketprovider";

export default function Textmessage({
	content,
	id,
    setIsEditing,
    isEditing
}: {
	content: string;
	id: string;
    isEditing:boolean;
    setIsEditing:Dispatch<React.SetStateAction<boolean>>;
}) {
	const [loading, setLoading] = useState(false);
	const [editValue, setEditValue] = useState(content);
	const socket = useContext(SocketContext);
	const {chat} = useParams();
	const {getToken} = useAuth();
	async function handelEdit() {
		try {
			setLoading(true);
			socket?.emit("editMessage", {id,content:editValue,chatId:chat});
			const token = await getToken();
			await axios.patch(
				`${process.env.NEXT_PUBLIC_WORKER_URL}/message`,
				{ messageId: id, content: editValue },
				{ headers: { Authorization: `Bearer ${token}` }}
			);
		} catch (error) {
			toast("There was an error editing the message");
		} finally {
			setIsEditing(false);
			setLoading(false);
		}
	}
	return (
		<div>
			{isEditing ? (
				<div className="flex gap-2">
					<textarea
						className="flex-1 rounded bg-[#1e1f22] dark:text-gray-100 p-2 text-sm resize-none focus:outline-none"
						value={editValue}
						onChange={(e) => setEditValue(e.target.value)}
					/>
					<Button size="sm" onClick={handelEdit} disabled={loading}>
						Save
					</Button>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => {
							setIsEditing(false);
							setEditValue(content);
						}}
						disabled={loading}
					>
						Cancel
					</Button>
				</div>
			) : (
				<p className="text-black dark:text-white">{content}</p>
			)}
		</div>
	);
}
