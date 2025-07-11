import NoCourses from "@/components/NoCourses";
import { supabaseClient } from "@/lib/server/Supabase";
import { clerkClient, currentUser } from '@clerk/nextjs/server'
import Card from "./Coursecart";

export default async function Page() {
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
  
  const supabase = supabaseClient();
  const {data:courses} = await supabase
    .from("courses")
    .select("*")
    .in("id",courseIds);

  return (
    <main className="my-24 px-4">
      {(courses?.map(course=><Card
        key={course.id}
        title={course.name||""}
        description={course.description||""} 
        logo={course.thumbnail||""} 
        id={course.id}
      />))}
    </main>
  );
}