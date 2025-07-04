"use client";
import Inputfield from "./Inputfield";
import MessageBubble from "./Messagebubble";

export default function page() {
	return (
		<div className="grid grid-cols-1 grid-rows-10 h-full">
			<MessageBubble />
			<Inputfield />
		</div>
	);
}
