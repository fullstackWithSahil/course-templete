import { buttonVariants } from "@/components/ui/button";
import { supabaseClient } from "@/lib/server/Supabase";
import Link from "next/link";

type cardTypes = {
    watchedVideos: number[] | null | undefined;
    description: string | null;
    id: number;
    name: string | null;
    thumbnail: string | null;
};

export default async function Card({
	thumbnail,
	name,
	description,
	id,
	watchedVideos
}:cardTypes) {
	const supabase = supabaseClient();
	const {data:videos} = await supabase.from("videos").select("id").eq("course",id);
	if(!watchedVideos||!videos){
		return <div></div>
	}
	if(videos?.length>watchedVideos?.length){
		return <div></div>
	}
	return (
		<div className="max-w-5xl mx-auto border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg my-3">
			<div className="grid grid-cols-1 md:grid-cols-3">
				{/* Logo Section */}
				<div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 p-4">
					<img
						src={thumbnail||""}
						alt="logo"
						className="w-full object-contain"
					/>
				</div>

				{/* Content Section */}
				<div className="col-span-2 flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 space-y-4">
					<h1 className="text-2xl md:text-3xl font-bold font-serif text-center">
						{name}
					</h1>
					<p className="text-sm md:text-base text-center leading-relaxed">
						{description}
					</p>
					<div className="flex items-center justify-center gap-6">
						<Link className={buttonVariants()} href={`/certificate/${id}`}>
                            Get certificate
                        </Link>
					</div>
				</div>
			</div>
		</div>
	);
}
