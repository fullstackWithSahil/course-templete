"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageType } from "./Messageprovider";

export default function Message({
	profile,
	content,
	type,
	firstname,
}: MessageType) {
	if (type == "text") {
		return (
			<div className="flex items-center border-1 dark:border-white border-black mx-3 my-2 p-2 rounded-2xl">
				<Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
					<AvatarImage
						src={profile || undefined}
						alt={firstname || "User"}
					/>
					<AvatarFallback className="text-xs md:text-sm">
						{firstname ? getInitials(firstname) : "U"}
					</AvatarFallback>
				</Avatar>
				{content}
			</div>
		);
	} else {
		<div>
			<Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
				<AvatarImage
					src={profile || undefined}
					alt={firstname || "User"}
				/>
				<AvatarFallback className="text-xs md:text-sm">
					{firstname ? getInitials(firstname) : "U"}
				</AvatarFallback>
			</Avatar>
		</div>;
	}
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase();
}
