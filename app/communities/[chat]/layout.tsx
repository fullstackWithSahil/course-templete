import { ReactNode } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { RedirectToSignIn } from "@clerk/nextjs";
import AdminContextProvider from "../components/AdminContext";
import MessageContextProvider from "../components/MessageProvider";
import SocketProvider from "../components/Socketprovider";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";

export default async function layout({
    children,
}: {
    children: ReactNode;
}) {
    const teacher = process.env.NEXT_PUBLIC_TEACHER!;
    const { getToken } = await auth();
    const token = await getToken();
    const user = await currentUser();

    if (!user) {
        return <RedirectToSignIn />;
    }

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_CHAT_URL}/public/server/${teacher}`,
        {
            headers: { 
                Authorization: `Bearer ${token}`,
                tenent:process.env.NEXT_PUBLIC_TEACHER! 
            },
        }
    );
  
    const data = await res.json();

    return (
        <AdminContextProvider>
            <MessageContextProvider>
                <SocketProvider>
                    <main className="grid grid-cols-1 md:grid-cols-[240px_1fr] h-[calc(100vh-3.5rem)] mt-14">
                    <Sidebar  data={data.data?data.data:[]} />
                    <MobileSidebar data={data.data?data.data:[]} />
                    {children}
                    </main>
                </SocketProvider>
            </MessageContextProvider>
        </AdminContextProvider>
    );
}
