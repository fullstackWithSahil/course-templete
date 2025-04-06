import logo from "@/assets/logo.png";
import Card from "@/components/CourseCard";
import NoCourses from "@/components/NoCourses";
import { supabaseClient } from "@/lib/server/Supabase";

export default async function Page() {
  const supabase = supabaseClient();
  const teacher = process.env.NEXT_PUBLIC_TEACHER!;
  const {data} = await supabase
    .from("courses")
    .select("*")
    .eq("teacher",teacher);
  
  if (!data||!data[0]){
    return <NoCourses text="The teacker has not created any courses yet"/>
  }
  
  return (
    <main className="my-24 px-4">
      {data?.map(course=>(<Card
          key={course.id}
          title={course.name||""} 
          description={course.description||""} 
          logo={logo} 
          id={course.id}
          watch={false}
        />))}
    </main>
  );
}