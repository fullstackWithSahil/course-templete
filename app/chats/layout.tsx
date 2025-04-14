import NoCourses from "@/components/NoCourses";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { ReactNode } from "react";
import MessagesProvider from "./[id]/context";
import { supabaseClient } from "@/lib/server/Supabase";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  if (!user) {
    return <NoCourses text="You haven't purchased any courses" />;
  }
  const client = await clerkClient();
  const data = await client.users.getUser(user.id);

  if (!data.privateMetadata.purchasedCourses) {
    return <NoCourses text="You haven't purchased any courses" />;
  }

  const Ids: string = data.privateMetadata.purchasedCourses as string;
  const courseIds = Ids.split(",").map((id) => Number(id));
  const supabase = supabaseClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .in("id", courseIds);

  return (
    <MessagesProvider>
      <main className="px-2 sm:px-4 mt-14 relative top-0 left-0">
        <section className="absolute top-0 left-0 w-full sm:w-[50%] md:w-[33%] lg:w-[25%] h-32 sm:h-64 md:h-96 rounded-b-3xl z-0 transition-colors duration-200 flex flex-col items-center gap-3 mt-12">
          {courses?.map((course) => (
            <Link href={`/chats/${course.id}`} key={course.id} className={buttonVariants() + " w-3/4"}>
              {course.name}
            </Link>
          ))}
          <div className={buttonVariants() + " w-3/4"}>Teacher</div>
        </section>
        <section className="absolute top-0 left-0 sm:left-[50%] md:left-[33%] lg:left-[25%] h-screen w-full sm:w-[50%] md:w-[67%] lg:w-[75%] transition-all duration-200">
            {children}
        </section>
      </main>
    </MessagesProvider>
  );
}