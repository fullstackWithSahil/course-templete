"use client";

import supabaseClient from "@/lib/Supabase";
import { useSession } from "@clerk/nextjs";
import { useEffect } from "react";
import { toast } from "sonner";
import { useMessageActions } from "./context";
import Inputfield from "./Inputfield";
import Messagebubble from "./Messagebubble";

export default function page() {
	const { session } = useSession();
    if (!session) return null;
	const { addMessage,clearMessages } = useMessageActions();
	useEffect(() => {
		clearMessages();
		const supabase = supabaseClient(session);
		const fetchMessages = async () => {
			const { data, error } = await supabase
				.from("messages")
				.select("*")
				.eq("course",104)
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
	}, []);

	return (
		<div className="w-full h-full">
			<Messagebubble/>
			<Inputfield/>
		</div>
	);
}
