"use client";

import API from "@/lib/api";
import { useParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useMessages } from "./Messageprovider";
import { SocketContext } from "./SocketContext";
import Message from "../Message/TextMessage";

export default function MessageBubble() {
	const { id } = useParams();
	const { dispatch, state } = useMessages();

	const containerRef = useRef<HTMLDivElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const [offset, setOffset] = useState(0);
	const [isFetching, setIsFetching] = useState(false);
	const [hasMore, setHasMore] = useState(true); // Optional

	// Fetch messages
	const fetchMessages = async () => {
		if (isFetching || !hasMore) return;
		setIsFetching(true);
		try {
			const prevScrollHeight = containerRef.current?.scrollHeight || 0;
			const { data } = await API.get(`/messages/chat/${id}/?limit=30&offset=${offset}`);
			if (data.length >30) setHasMore(false); // No more messages to load
			dispatch({ type: "ADD_MANY_MESSAGES", payload: data });

			// Maintain scroll position after prepending messages
			setTimeout(() => {
				const newScrollHeight = containerRef.current?.scrollHeight || 0;
				const scrollDiff = newScrollHeight - prevScrollHeight;
				if (containerRef.current) {
					containerRef.current.scrollTop = scrollDiff;
				}
			}, 1);
		} catch (error) {
			toast("There was an error getting messages");
		} finally {
			setIsFetching(false);
		}
	};

	// Scroll handler
	const handleScroll = () => {
		if (containerRef.current?.scrollTop === 0) {
			setOffset((prev) => prev + 1);
		}
	};

	// On mount or id change
	useEffect(() => {
		setOffset(0);
		setHasMore(true);
		dispatch({ type: "CLEAR_MESSAGES" }); // Optional: clear old
		fetchMessages();
		setTimeout(() => {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [id]);

	// Fetch on offset change (not on first load, since it's done above)
	useEffect(() => {
		if (offset !== 0) {
			fetchMessages();
		}
	}, [offset]);

	// Attach scroll listener
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		container.addEventListener("scroll", handleScroll);
		return () => {
			container.removeEventListener("scroll", handleScroll);
		}
	}, []);

	const socket = useContext(SocketContext);
	useEffect(()=>{
        socket?.emit("joinRoom", id);

		function handleReceiveMessage(message: any){
            dispatch({type:"ADD_MESSAGE",payload:{
				...message,
				_id:String(Math.random()),
				createdAt:new Date(Date.now()),
				updatedAt:new Date(Date.now()),
			}})
			messagesEndRef.current?.scrollIntoView();
			setTimeout(() => {
				containerRef.current?.scrollBy({
					top: 300,
					behavior: "smooth",
				});
			}, 10);
        };

		function handleEditMessage(message:any){
			dispatch({type:"UPDATE_MESSAGE",payload:message})
		}
		
		function handleDeleteMessage(id:string){
			dispatch({type:"DELETE_MESSAGE",payload:{id}})
		}

		socket?.on("receiveMessage", handleReceiveMessage);
        socket?.on("receiveEditMessage", handleEditMessage);
        socket?.on("receiveDeleteMessage",handleDeleteMessage);

        // Cleanup listeners
        return () => {
            socket?.off("receiveMessage", handleReceiveMessage);
            socket?.off("receiveEditMessage", handleEditMessage);
            socket?.off("receiveDeleteMessage",handleDeleteMessage);
        };
	},[id,socket])

	return (
		<div ref={containerRef} className="row-span-9 overflow-y-scroll flex flex-col">
			{state.map((message) => (
				<Message key={message._id} {...message} />
			))}
			<div className="border-2 border-white" ref={messagesEndRef}></div>
		</div>
	);
}