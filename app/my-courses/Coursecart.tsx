"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import supabaseClient from "@/lib/Supabase";
import { useAuth, useSession, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Card({
	logo,
	id,
	title,
	description,
	watchedVideos
}: {
	logo: any;
	id: number;
	title: string;
	description: string;
	watchedVideos:number[] | null | undefined;
}) {
	const router = useRouter();
	const { userId } = useAuth();
	const { session } = useSession();
	const user = useUser();
    const [progress,setProgress] = useState(0);
    useEffect(()=>{
        const supabase = supabaseClient(session);
        supabase.from("videos").select("id").eq("course",id).then(({data:videos,error})=>{
			const num = watchedVideos?.length||0
			const den = videos?.length||1
			const prog = (num*100)/den;
			setProgress(prog);
        })
    },[])

	if (!userId) {
		return (
			<div>
				<p>you are not allowed to see this page</p>
			</div>
		);
	}
	async function handelClick() {
		if (!userId) return;
		const supabase = supabaseClient(session);

		//checking if student exists
		const { data, error } = await supabase
			.from("students")
			.select("*")
			.eq("student", userId)
			.eq("course", id);

		if (error) {
			console.log(error);
		}

		if (!data || data.length == 0) {
			//creating a student
			await supabase.from("students").insert({
				student: userId,
				teacher: process.env.NEXT_PUBLIC_TEACHER,
				course: id,
				email: user.user?.primaryEmailAddress?.emailAddress,
			});
		}

		router.push(`/my-courses/${id}`);
	}

	return (
		<div className="max-w-5xl mx-auto border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg my-3">
			<div className="grid grid-cols-1 md:grid-cols-3">
				{/* Logo Section */}
				<div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 p-4">
					<img
						src={logo}
						alt="logo"
						className="w-full object-contain"
					/>
				</div>

				{/* Content Section */}
				<div className="col-span-2 flex flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 space-y-4">
					<h1 className="text-2xl md:text-3xl font-bold font-serif text-center">
						{title}
					</h1>
					<p className="text-sm md:text-base text-center leading-relaxed">
						{description}
					</p>
					<Progress value={progress} />
					<div className="flex items-center justify-center gap-6">
						<Button onClick={handelClick}>watch</Button>
						{progress==100?<Button>Get certificate</Button>:<div>{progress}% completed</div>}
					</div>
				</div>
			</div>
		</div>
	);
}
