import { buttonVariants } from "@/components/ui/button";
import API from "@/lib/api";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { ReactNode } from "react";
import MobileSidebar from "./MobileSidebar";

export default async function layout({ children }: { children: ReactNode }){
    const user = await currentUser();
    const {data:chats} = await API.get(`/chats/member/${user?.id}`);
	console.log(chats.data);
	return (
		<main className="px-2 sm:px-4 relative top-0 left-0 mt-5">
			<section className="absolute top-0 left-0 hidden sm:flex sm:w-[50%] md:w-[33%] lg:w-[25%] z-0 transition-colors duration-200 flex-col items-center gap-3 mt-12 border-r-2 border-gray-600 dark:border-white h-[calc(100vh-67px)]">
				{chats.data?.map((chat:{_id:string,name:string}) => (
					<Link
						href={`/chats/${chat._id}`}
						key={chat._id}
						className={buttonVariants() + " w-3/4"}
					>
						{chat.name}
					</Link>
				))}
			</section>
			<section className="absolute top-0 left-0 sm:left-[50%] md:left-[33%] lg:left-[25%] w-full sm:w-[50%] md:w-[67%] lg:w-[75%] transition-all duration-200 h-[calc(100vh-50px)]">
				<MobileSidebar courses={chats.data} />
				{children}
			</section>
		</main>
	);
}
