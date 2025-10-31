"use client";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown, Hash } from "lucide-react";
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

export default function MobileSidebar({ data }: { data: ServerType[] }) {
	return (
		<Sheet>
			<div className="sm:hidden flex items-center justify-between p-4 shadow-md bg-primary dark:bg-[#2b2d31] border-b border-[#1e1f22]">
				<SheetTrigger className="text-white font-semibold text-base">
					Servers
				</SheetTrigger>
			</div>
			<SheetContent side="left" className="pt-10">
                <SheetTitle className="text-white font-semibold text-base">
					Servers
                </SheetTitle>
				<Accordion
					type="multiple"
					className="w-full"
					defaultValue={data.map((s) => s.name)}
				>
					{data.map((server: ServerType) => {
						return (
							<AccordionItem
								key={server.id}
								value={server.name}
								className="border-none"
							>
								<AccordionTrigger className="hover:bg-[#35373c] px-2 py-1.5 rounded-none hover:no-underline text-xs font-semibold uppercase tracking-wide text-[#949ba4] hover:text-[#dbdee1] [&[data-state=open]>svg]:rotate-0">
									<span className="flex-1 text-left">
										{server.name}
									</span>
									<ChevronDown className="h-3 w-3 shrink-0 transition-transform duration-200 -rotate-90" />
								</AccordionTrigger>
								<AccordionContent className="pb-0 pt-1">
									{server.chats.map((chat) => {
										return (
											<Link
												key={chat.id}
												href={`/communities/${chat.id}`}
												className="flex items-center gap-1.5 px-2 py-1.5 mx-2 rounded hover:bg-[#35373c] hover:text-[#dbdee1] cursor-pointer text-[#949ba4] group"
											>
												<Hash className="h-4 w-4 shrink-0 text-[#80848e] group-hover:text-[#dbdee1]" />
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
			</SheetContent>
		</Sheet>
	);
}
