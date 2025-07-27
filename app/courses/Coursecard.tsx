"use client";
import buyCourse from "@/actions/buyCourse";
import { Button } from "@/components/ui/button";
import { RedirectToSignUp, useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

export default function Card({
	logo,
	id,
	title,
	description,
}: {
	logo: any;
	id: number;
	title: string;
	description: string;
}) {
	const { userId } = useAuth();
	const router = useRouter();
	async function handelClick(){
		if(!userId){
			return <RedirectToSignUp/>
		}
		const data = await buyCourse(userId,id);
		if(data.success){
			router.push(data.paymentUrl||"")
		}else{
			toast(data.message);
		}
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
					<div className="flex items-center justify-center gap-6">
						<Button onClick={handelClick}>buy now</Button>
						<Button>Read More</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
