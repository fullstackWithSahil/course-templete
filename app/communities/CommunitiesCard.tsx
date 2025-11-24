"use client";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn, useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CommunityCard({
	logo,
	id,
	title,
	description,
    members,
    isFree
}: {
    members:string[];
	logo: any;
	id: number;
	title: string;
	description: string;
    isFree:boolean;
}) {
    const user = useUser();
    const [loading,setLoading] = useState(false);
    const router = useRouter();
    if(!user){
        return <RedirectToSignIn/>
    }
    const {getToken} = useAuth();

    async function handelClick(){
        try {
            setLoading(true);
            if(members.includes(user.user?.id||"")){
                router.push(`/communities/${id}`);
                return;
            }
            if(isFree){
                const token = await getToken();
                const {data} = await axios.post(
                    `${process.env.NEXT_PUBLIC_CHAT_URL}/server/addMember`,
                    {
                        serverId:id,
                        member:user.user?.id,
                        teacher:process.env.NEXT_PUBLIC_WORKER_URL,
                        email:user.user?.primaryEmailAddress,
                        name:user.user?.fullName
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )
            }
        } catch (error) {
            toast("Something went wrong");
        }finally{
            setLoading(false);
        }
    }

	return (
        <>
        {loading&&<div></div>}
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
						<Button onClick={handelClick}>Join</Button>
					</div>
				</div>
			</div>
		</div>
        </>
	);
}
