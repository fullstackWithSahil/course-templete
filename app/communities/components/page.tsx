"use client";

import LoadingPage from "@/components/LoadingPage";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect} from "react";

export default function Page() {
	const { teacher } = useParams();
	const { getToken } = useAuth();
	const { user } = useUser();
	const router = useRouter();

	useEffect(() => {
		async function fetchAndRedirect() {
			try {
				const token = await getToken();
				const { data } = await axios.get(
					`${process.env.NEXT_PUBLIC_WORKER_URL}/server/${teacher}?user=${user?.id}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				const firstChatId = data.data?.[0]?.chats?.[0]?.id;
				if (firstChatId) {
					router.push(`/${teacher}/${firstChatId}`);
				} else {
					router.push(`/${teacher}/new-chat`);
				}
			} catch (error) {
				router.push(`/${teacher}/new-chat`);
			}
		}

		if (user?.id) {
			fetchAndRedirect();
		}
	}, [teacher, user?.id, getToken, router]);

	return <LoadingPage/>
}
// http://localhost:3000/user_30tsPYCM9kydqSJIwl0WSLR59Zq/2
// http://localhost:3000/user_30tsPYCM9kydqSJIwl0WSLR59Zq/addmember/2