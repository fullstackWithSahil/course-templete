import logo from "@/assets/logo.png";
import Card from "@/components/CourseCard";
import NoCourses from "@/components/NoCourses";
import { createClient } from "@/lib/server/Supabase";
import { clerkClient, currentUser } from '@clerk/nextjs/server'

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
  const supabase = await createClient();
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
        logo={logo} 
        id={course.id}
        watch={false}
        buttonText="see Chats"
      />))}
    </main>
  );
}