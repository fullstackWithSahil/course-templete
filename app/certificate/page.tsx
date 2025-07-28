import NoCourses from "@/components/NoCourses";
import { supabaseClient } from "@/lib/server/Supabase";
import { currentUser } from '@clerk/nextjs/server'
import Card from "./Card";

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

  if(!students){
    return <NoCourses text="You have not purchased any courses"/>
  }

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
        id={course.id}
        name={course.name}
        thumbnail={course.thumbnail}
        watchedVideos={course.watchedVideos}
        description={course.description}
      />))}
    </main>
  );
}