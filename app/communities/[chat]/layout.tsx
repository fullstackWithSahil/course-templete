import { ReactNode } from "react";
import SocketProvider from "./Socketprovider";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import { auth, currentUser } from "@clerk/nextjs/server";
import { RedirectToSignIn } from "@clerk/nextjs";
import AdminContextProvider from "./AdminContext";

export default async function layout({children}: {children: ReactNode}) {
  const teacher = process.env.NEXT_PUBLIC_TEACHER;
  const { getToken } = await auth();
  const token = await getToken();
  const user = await currentUser();

  if (!user) {
    return <RedirectToSignIn />;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORKER_URL}/server/${teacher}?user=${user.id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await res.json();

  return (
      <SocketProvider>
        <AdminContextProvider>
          <main className="grid grid-cols-1 md:grid-cols-[240px_1fr] mt-17">
            <Sidebar data={data.data} />
            <MobileSidebar data={data.data} />
            {children}
          </main>
        </AdminContextProvider>
      </SocketProvider>
  );
}
