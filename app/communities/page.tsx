import { auth } from "@clerk/nextjs/server";
import CommunityCard from "./CommunitiesCard";
import logo from "@/assets/logo.png"

export default async function Page() {
	const teacher = process.env.NEXT_PUBLIC_TEACHER;
	const { getToken } = await auth();
	const token = await getToken();

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_WORKER_URL}/server/${teacher}`,
		{
		headers: { Authorization: `Bearer ${token}` },
		}
	);
	const data = await res.json();
	
	return (
		<main className="my-24 px-4">
			{data.data.map((community:any)=><CommunityCard 
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