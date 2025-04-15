"use client";

import supabaseClient from "@/lib/Supabase";
import { useSession } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useMessageActions, useMessages } from "./context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Message from "./Message";
import { Input } from "@/components/ui/input";
import Inputfield from "./Inputfield";
import Messagebubble from "./Messagebubble";

export default function page() {
	const { session } = useSession();
    if (!session) return null;
	const { id } = useParams();
	const { addMessage } = useMessageActions();
	useEffect(() => {
		const supabase = supabaseClient(session);
		const fetchMessages = async () => {
			const { data, error } = await supabase
				.from("messages")
				.select("*")
				.eq("course", Number(id))
				.order("created_at", { ascending: true });
			if (error) {
				return { data: null, error };
			} else {
				return { data, error: null };
			}
		};
		fetchMessages().then((data) => {
			if (data.error) {
				toast.error("Error fetching messages");
				return;
			} else {
				data.data.forEach((message) => {
					addMessage(message);
				});
			}
		});
	}, [id]);

	return (
		<div className="w-full h-full">
			<Messagebubble/>
			<Inputfield/>
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
