"use client";

import Message, { MessageType } from "@/components/message/Message";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Socket } from "socket.io-client";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMessages } from "../components/MessageProvider";

export default function Messagebubble({socket}:{socket:Socket}){
	const {state,dispatch} = useMessages();
    const {chat,teacher} = useParams();
	const [page, setPage] = useState(1);
	const {user} = useUser();
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const viewref = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const isInitialLoadRef = useRef(true);
	const scrollLockRef = useRef(false); // Prevent scroll during updates

	const { getToken } = useAuth();

	// Helper function to scroll to bottom (iOS-friendly)
	const scrollToBottom = (behavior: 'auto' | 'smooth' = 'auto') => {
		if (!containerRef.current) return;
		
		// Use requestAnimationFrame for better iOS compatibility
		requestAnimationFrame(() => {
			if (!containerRef.current) return;
			const scrollHeight = containerRef.current.scrollHeight;
			const height = containerRef.current.clientHeight;
			const maxScroll = scrollHeight - height;
			
			containerRef.current.scrollTo({
				top: maxScroll > 0 ? maxScroll : scrollHeight,
				behavior: behavior
			});
		});
	};

	// 1. Initial Load (Page 1) and Cleanup
	useEffect(() => {
		let isMounted = true;
		dispatch({type:"CLEAR_MESSAGE"})
		setPage(1);
		setHasMore(true);
		setIsLoading(true);
		isInitialLoadRef.current = true;
		socket?.emit("joinRoom", {chat,teacher});

		getToken().then((token)=>{
			axios
				.get(
					`${process.env.NEXT_PUBLIC_CHAT_URL}/message/${chat}?page=0&limit=10`,
					{headers:{ Authorization: `Bearer ${token}` }}
				)
				.then(({ data }) => {
					if (!isMounted) return;
					const initialMessages = (data.data?data.data:[]).reverse();
					dispatch({type:"ADD_INITIAL_MESSAGE",payload:initialMessages});
					setIsLoading(false);
	
					if (initialMessages.length < 10) {
						setHasMore(false);
					}

					// Scroll to bottom after initial load with delay for iOS
					setTimeout(() => {
						scrollToBottom('auto');
						isInitialLoadRef.current = false;
					}, 100);
				})
				.catch((error) => {
					if (!isMounted) return;
					console.error("Initial message load failed:", error);
					setIsLoading(false);
				});
		})

		function handleReceiveMessage(message: MessageType) {
			if(user?.id && message.sender != user.id){
				dispatch({type:"ADD_MESSAGE",payload:message})
				
				// Check if user is near bottom before auto-scrolling
				setTimeout(() => {
					if (!containerRef.current) return;
					const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
					const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
					
					if (isNearBottom) {
						scrollToBottom('smooth');
					}
				}, 50);
			}
		}

		function handleEditMessage(message: MessageType) {
            if (!isMounted) return;
            if(state.messages.length==0) return;
			console.log("edit",{message})
			dispatch({type:"EDIT_MESSAGE",payload:message})
        }
		
        function handleDeleteMessage(id: string) {
			if (!isMounted) return;
			console.log("delete",{id})
			if(state.messages.length==0) return;
            dispatch({type:"DELETE_MESSAGE",payload:id})
        }
		
		function handleReaction(reaction:{emoji:string;user:string;messageId:string}){
			if (!isMounted) return;
			dispatch({type:"HANDLE_REACTION",payload:{
				emoji:reaction.emoji,
				messageId:reaction.messageId,
				user:reaction.user
			}})
		}

		socket?.on("receiveMessage", handleReceiveMessage);
		socket?.on("receiveEditMessage", handleEditMessage);
		socket?.on("sendReaction", handleReaction);
		socket?.on("receiveDeleteMessage", handleDeleteMessage);
		
		return () => {
			isMounted = false;
			socket?.off("receiveMessage", handleReceiveMessage);
			socket?.off("receiveEditMessage", handleEditMessage);
			socket?.off("receiveDeleteMessage", handleDeleteMessage);
            socket?.emit("leaveRoom", chat);
			socket?.off("sendReaction", handleReaction);
		};
	}, [chat]);

	// 2. Load More Messages (Page 2, 3, ...)
	useEffect(() => {
		if (page === 1) return;
		if (!hasMore) return;

		let isMounted = true;
		scrollLockRef.current = true;

		setIsLoading(true);
		const container = containerRef.current;
		const prevScrollHeight = container?.scrollHeight || 0;
		const prevScrollTop = container?.scrollTop || 0;

		getToken().then((token)=>{
			console.log(`${process.env.NEXT_PUBLIC_CHAT_URL}/message/${chat}?page=${page}&limit=10`)
			axios
				.get(
					`${process.env.NEXT_PUBLIC_CHAT_URL}/message/${chat}?page=${page}&limit=10`,
					{headers:{ Authorization: `Bearer ${token}` }}
				)
				.then(({ data }) => {
					if (!isMounted) return;
	
					const newMessages = (data.data?data.data:[]).reverse();
					if (newMessages.length === 0) {
						setHasMore(false);
					} else {
						dispatch({type:"PREPEND_MESSAGES",payload:newMessages})
						
						// Maintain scroll position after prepending (iOS-friendly)
						requestAnimationFrame(() => {
							if (!container) return;
							const newScrollHeight = container.scrollHeight;
							const scrollDiff = newScrollHeight - prevScrollHeight;
							container.scrollTop = prevScrollTop + scrollDiff;
							
							setTimeout(() => {
								scrollLockRef.current = false;
							}, 100);
						});
					}
					setIsLoading(false);
				})
				.catch((error) => {
					if (!isMounted) return;
					console.error(`Load more messages (page ${page}) failed:`, error);
					setIsLoading(false);
					scrollLockRef.current = false;
				});
		})

		return () => {
			isMounted = false;
		};
	}, [page, chat, hasMore]);

	// 3. Scroll listener for infinite scrolling (iOS-optimized)
	useEffect(() => {
		let timeoutId: NodeJS.Timeout;
		const container = containerRef.current;

		function scroller() {
			if (!container || isLoading || !hasMore || scrollLockRef.current) return;

			const scrollTop = container.scrollTop;
			const threshold = 100; // Increased threshold for iOS

			if (scrollTop < threshold) {
				clearTimeout(timeoutId);
				timeoutId = setTimeout(() => {
					if (!isLoading && !scrollLockRef.current) {
						setPage((prev) => prev + 1);
					}
				}, 200); // Longer debounce for iOS
			}
		}

		// Use passive listener for better iOS performance
		container?.addEventListener("scroll", scroller, { passive: true });

		return () => {
			container?.removeEventListener("scroll", scroller);
			clearTimeout(timeoutId);
		};
	}, [isLoading, hasMore]);

	return (
		<div
			ref={containerRef}
			className={`${state.selectedMessage?"md:row-span-8 row-span-7":"md:row-span-9 row-span-8"} overflow-y-auto`}
			style={{
				WebkitOverflowScrolling: 'touch', // Critical for iOS momentum scrolling
				overflowY: 'auto',
				position: 'relative',
				// Removed overscrollBehavior as it's not well supported on iOS
			}}
		>
			{isLoading && page > 1 && (
				<div className="flex justify-center py-2">
					<div className="text-sm text-gray-500">
						Loading older messages...
					</div>
				</div>
			)}

			{!hasMore && state.messages && state.messages.length > 0 && (
				<div className="flex justify-center py-2">
					<div className="text-sm text-gray-400">
						No more messages
					</div>
				</div>
			)}

			{state.messages?.map((message) => {
				return (
					<Message
						key={message.id}
						sender={message.sender}
						profile={message.profile}
						content={message.content}
						createdAt={message.createdAt}
						id={message.id}
						name={message.name}
						type={message.type}
						replyTo={message.replyTo}
						reactions={message.reactions}
						tier={message.tier}
					/>
				);
			})}
			<div ref={viewref}></div>
		</div>
	);
}