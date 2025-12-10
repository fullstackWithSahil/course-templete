import Modetoggle from "@/components/Modetoggle";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Hash } from "lucide-react";
import Link from "next/link";

type ChatType = {
	id: number;
	name: string;
	server: number;
};

type ServerType = {
	id: number;
	name: string;
	teacher: string;
	members: string[];
	chats: ChatType[];
};

export default async function Sidebar({ data }: { data: ServerType[] }) {
	return (
		<section className="hidden md:flex md:col-span-1 w-full bg-primary dark:bg-[#2b2d31] flex-col dark:text-[#949ba4]  h-[calc(100vh-3.5rem)]">
			<div className="p-4 shadow-md bg-primary dark:bg-[#2b2d31] border-b border-[#1e1f22] flex items-center justify-around">
				<h1 className="text-white font-semibold text-base">Servers</h1>
				<Modetoggle/>
				<SignedIn>
					<UserButton/>
				</SignedIn>
			</div>

			<div className="flex-1 overflow-y-auto">
				<Accordion
					type="multiple"
					className="w-full overflow-y-scroll"
					defaultValue={data.map((s) => s.name)}
				>
					{data.map((server: ServerType) => {
						return (
							<AccordionItem
								key={server.id}
								value={server.name}
								className="border-none"
							>
								<AccordionTrigger className="dark:hover:bg-[#35373c] px-2 py-1.5 rounded-none hover:no-underline text-xs font-semibold uppercase tracking-wide text-white dark:text-[#949ba4] hover:text-[#dbdee1] [&[data-state=open]>svg]:rotate-0">
									<span className="flex-1 text-left">
										{server.name}
									</span>
								</AccordionTrigger>
								<AccordionContent className="pb-0 pt-1">
									{server.chats.map((chat) => {
										return (
											<Link
												href={`/communities/${chat.id}`}
												key={chat.id}
												className="flex items-center gap-1.5 px-2 py-1.5 mx-2 rounded hover:bg-[#35373c] hover:text-[#dbdee1] cursor-pointer text-white dark:text-[#949ba4] group"
											>
												<Hash className="h-4 w-4 shrink-0 text-white dark:text-[#949ba4] group-hover:text-[#dbdee1]" />
												<span className="text-base font-medium truncate">
													{chat.name}
												</span>
											</Link>
										);
									})}
								</AccordionContent>
							</AccordionItem>
						);
					})}
				</Accordion>
			</div>
		</section>
	);
}
