"use client";

import Message, { MessageProps } from "@/components/message/Message";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Socket } from "socket.io-client";
import { useAuth } from "@clerk/nextjs";

export default function Messagebubble({socket}:{socket:Socket}){
	const [messages, setMessages] = useState<MessageProps[] | undefined>(
		undefined
	);
  	const teacher = process.env.NEXT_PUBLIC_TEACHER!;
    const {chat} = useParams();
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const viewref = useRef<HTMLDivElement>(null); // Ref for the bottom-most element
	const containerRef = useRef<HTMLDivElement>(null); // Ref for the scroll container
	const prevScrollHeightRef = useRef(0); // To maintain scroll position when loading older messages

	const { getToken } = useAuth();
	// 1. Initial Load (Page 1) and Cleanup
	useEffect(() => {
		let isMounted = true;
		setMessages(undefined);
		setPage(1);
		setHasMore(true);
		setIsLoading(true);
		socket?.emit("joinRoom", {chat,teacher});

		getToken().then((token)=>{
			axios
				.get(
					`${process.env.NEXT_PUBLIC_WORKER_URL}/message/${chat}?page=0&limit=10`,
					{headers:{ Authorization: `Bearer ${token}` }}
				)
				.then(({ data }) => {
					if (!isMounted) return;
					const initialMessages = data.data.reverse();
					setMessages(initialMessages);
					setIsLoading(false);
	
					if (initialMessages.length < 10) {
						setHasMore(false);
					}
				})
				.catch((error) => {
					if (!isMounted) return;
					console.error("Initial message load failed:", error);
					setIsLoading(false);
				});
		})

		function handleReceiveMessage(message: MessageProps) {
			setMessages((prev) => [...(prev ?? []), message]);
			setTimeout(() => {
				containerRef.current?.scrollBy({
					top: 300,
					behavior: "smooth",
				});
			}, 10);
		}

		function handleEditMessage(message: MessageProps) {
            console.log("✅ Frontend received edit:", message);
            if (!isMounted) return;
            setMessages((prev) => {
                if (!prev) return prev;
                return prev.map((msg) => 
                    msg.id === message.id 
                        ? { ...msg, content: message.content, edited: true } 
                        : msg
                );
            });
        }

        function handleDeleteMessage(id: string) {
            if (!isMounted) return;
            setMessages((prev) => {
                if (!prev) return prev;
                return prev.filter((msg) => msg.id !== id);
            });
        }

		socket?.on("receiveMessage", handleReceiveMessage);
		socket?.on("receiveEditMessage", handleEditMessage);
		socket?.on("receiveDeleteMessage", handleDeleteMessage);

		return () => {
			isMounted = false;
			socket?.off("receiveMessage", handleReceiveMessage);
			socket?.off("receiveEditMessage", handleEditMessage);
			socket?.off("receiveDeleteMessage", handleDeleteMessage);
            socket?.emit("leaveRoom", chat);
		};
	}, [chat]);

	// 2. Load More Messages (Page 2, 3, ...) and Cleanup
	useEffect(() => {
		// We only load more if page > 1 (subsequent pages)
		if (page === 1) return;
		if (!hasMore) return; // Stop if there are no more messages

		let isMounted = true;

		setIsLoading(true);
		const container = containerRef.current;
		const prevScrollHeight = container?.scrollHeight || 0;

		// Fetch the next page number
		getToken().then((token)=>{
			axios
				.get(
					`${process.env.NEXT_PUBLIC_WORKER_URL}/message/${chat}?page=${page}&limit=10`,
					{headers:{ Authorization: `Bearer ${token}` }}
				)
				.then(({ data }) => {
					if (!isMounted) return;
	
					const newMessages = data.data.reverse();
					if (newMessages.length === 0) {
						setHasMore(false);
					} else {
						// Prepend older messages to the top of the list
						setMessages((prev) => [...newMessages, ...(prev ?? [])]);
					}
					if (container) {
						const newScrollHeight = container?.scrollHeight;
						const scrollDiff = newScrollHeight - prevScrollHeight;
						if (containerRef.current) {
							containerRef.current.scrollTop = scrollDiff;
						}
					}
					setIsLoading(false);
				})
				.catch((error) => {
					if (!isMounted) return;
					console.error(
						`Load more messages (page ${page}) failed:`,
						error
					);
					setIsLoading(false);
				});
		})

		return () => {
			isMounted = false;
		};
	}, [page, chat, hasMore]);

	// 3. Maintain scroll position after loading older messages
	useEffect(() => {
		// Only run this logic when older messages have been loaded (page > 1)
		if (
			page > 1 &&
			containerRef.current &&
			prevScrollHeightRef.current > 0
		) {
			const container = containerRef.current;
			const newScrollHeight = container.scrollHeight;

			// Calculate the difference in height (the size of the newly loaded messages)
			const scrollDiff = newScrollHeight - prevScrollHeightRef.current;

			// Adjust scrollTop to keep the visible messages in the same place
			container.scrollTop = scrollDiff;

			// Reset the ref after successful application
			prevScrollHeightRef.current = 0;
		}
	}, [messages, page]); // Dependency on messages ensures it runs after DOM updates

	// 4. Scroll to bottom instantly on *initial* load (only when messages are available)
	useEffect(() => {
		if (page === 1 && messages && messages.length > 0) {
			// A slight delay to ensure the browser has rendered the content
			const timeoutId = setTimeout(() => {
				if (containerRef.current) {
					containerRef.current.scrollTop =
						containerRef.current.scrollHeight;
				}
			}, 10);

			return () => clearTimeout(timeoutId);
		}
	}, [messages, page]);

	// 5. Scroll listener for infinite scrolling (debounced)
	useEffect(() => {
		let timeoutId: NodeJS.Timeout;
		const container = containerRef.current;

		function scroller() {
			if (!container || isLoading || !hasMore) return;

			const scrollTop = container.scrollTop;
			const threshold = 50; // Load when scroll is within 50px of the top

			if (scrollTop < threshold) {
				clearTimeout(timeoutId);
				timeoutId = setTimeout(() => {
					// Only increment page if not currently loading
					if (!isLoading) {
						setPage((prev) => prev + 1);
					}
				}, 150); // Debounce time
			}
		}

		container?.addEventListener("scroll", scroller);

		return () => {
			container?.removeEventListener("scroll", scroller);
			clearTimeout(timeoutId);
		};
	}, [isLoading, hasMore]); // Dependencies ensure the listener uses the latest state

	return (
		<div
			ref={containerRef}
			className="row-span-10 md:row-span-9 overflow-y-auto"
			// Use 'auto' scrollBehavior for quick jump on load,
			// and let the CSS class handle scrolling (if needed)
			style={{
				scrollBehavior: "auto",
				overscrollBehavior: "contain",
			}}
		>
			{/* Show loading indicator only for subsequent page loads */}
			{isLoading && page > 1 && (
				<div className="flex justify-center py-2">
					<div className="text-sm text-gray-500">
						Loading older messages...
					</div>
				</div>
			)}

			{/* Show 'no more messages' only when appropriate */}
			{!hasMore && messages && messages.length > 0 && (
				<div className="flex justify-center py-2">
					<div className="text-sm text-gray-400">
						No more messages
					</div>
				</div>
			)}

			{messages?.map((message) => {
				return (
					<Message
						// Use a stable unique ID for the key
						key={message.id}
						sender={message.sender}
						profile={message.profile}
						content={message.content}
						createdAt={message.createdAt}
						id={message.id}
						name={message.name}
						type={message.type}
					/>
				);
			})}
			{/* Ref for the bottom is no longer strictly needed for scroll-to-bottom
                since we use containerRef.current.scrollTop = containerRef.current.scrollHeight,
                but keeping it won't hurt. */}
			<div ref={viewref}></div>
		</div>
	);
}
