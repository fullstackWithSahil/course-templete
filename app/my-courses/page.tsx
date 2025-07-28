import NoCourses from "@/components/NoCourses";
import { supabaseClient } from "@/lib/server/Supabase";
import { clerkClient, currentUser } from '@clerk/nextjs/server'
import Card from "./Coursecart";

export default async function Page() {
  const user = await currentUser();
  if (!user) {
    return <NoCourses text="You haven't purchased any courses" />;
  }
  
  const supabase = supabaseClient();
  const {data:students} = await supabase
    .from("students")
    .select("*")
    .eq("student",user.id)
    .eq("teacher",process.env.NEXT_PUBLIC_TEACHER!);

  const courseIds = students?.map(student=>student.course);
  const {data:courses} = await supabase
    .from("courses")
    .select("*")
    .in("id",courseIds as any);

    const formatedData = courses?.map((course)=>{
      const watchedVideos = students?.find((s)=>s.course==course.id);
      return {
        ...course,
        watchedVideos:watchedVideos?.watchedVideos
      }
    })
    return (
    <main className="my-24 px-4">
      {(formatedData?.map(course=><Card
        key={course.id}
        title={course.name||""}
        description={course.description||""} 
        logo={course.thumbnail||""} 
        id={course.id}
        watchedVideos={course.watchedVideos}
      />))}
    </main>
  );
}