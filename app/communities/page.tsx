import { auth } from "@clerk/nextjs/server";
import CommunityCard from "./CommunitiesCard";
import logo from "@/assets/logo.png"
import axios from "axios";

export default async function Page() {
	const teacher = process.env.NEXT_PUBLIC_TEACHER;
	const { getToken } = await auth();
	const token = await getToken();

	const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_CHAT_URL}/server/${teacher}`,
        {
            headers: { 
                Authorization: `Bearer ${token}`,
                tenent: process.env.NEXT_PUBLIC_TEACHER
            },
        }
    );

    const communities = data.data||[];
	
	return (
		<main className="my-24 px-4">
			{communities.map((community:any)=><CommunityCard 
				key={community.id}
				id={community.id}
				title={community.name}
				description="this is community for the course"
				logo={logo}
				members={community.members}
				isFree={community.isFree}
			/>)}
		</main>
	);
}