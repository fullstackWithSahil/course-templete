import NoCourses from "@/components/NoCourses";
import { createClient } from "@/lib/server/Supabase";
import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { ReactNode } from "react";
import MessagesProvider from "./context";

export default async function Layout({children}: {children: ReactNode}) {

  const user = await currentUser();
  if (!user) {
    return <NoCourses text="You haven't purchased any courses" />;
  }
  const client = await clerkClient();
  const data = await client.users.getUser(user.id);


  if(!data.privateMetadata.purchasedCourses){
    return <NoCourses text="You havent purchased any courses"/>
  }

  const Ids:string = data.privateMetadata.purchasedCourses as string;
  const courseIds = Ids.split(",").map(id =>Number(id));
  const supabase = await createClient();
  const {data:courses} = await supabase
    .from("courses")
    .select("*")
    .in("id",courseIds);

  return (
    <MessagesProvider>
        <main className="px-4 mt-14 relative top-0 left-0">
        <section className="absolute top-0 left-0 w-[25%] h-96 bg-gradient-to-b from-primary to-primary-light rounded-b-3xl z-0">
            {courses?.map(course=><div key={course.id} className="text-white text-2xl font-bold p-4">
            {course.name}
            </div>)}
        </section>
        <section className="absolute top-0 left-[25%] h-96 w-[75%]">
            {children}
        </section>
        </main>
    </MessagesProvider>
  );
}