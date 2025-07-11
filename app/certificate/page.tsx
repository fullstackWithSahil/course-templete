import NoCourses from "@/components/NoCourses";
import { supabaseClient } from "@/lib/server/Supabase";
import { currentUser } from "@clerk/nextjs/server"
import Card from "./Card";

export default async function Page(){
  const user = await currentUser();
  if(!user){
    return <NoCourses text="You have not purchased any courses"/>
  }
  const supabase = supabaseClient();
  const {data} = await supabase.from("students").select("*").eq("student",user.id)
  if(!data){
    return <NoCourses text="You have not purchased any courses"/>
  }

  const promises = data.map((student)=>{
    return new Promise(async(resolve,reject)=>{
      try {
        if(!student.course) return;
        const {data:videos} = await supabase.from("videos").select("*").eq("course",student.course||0);
        console.log({videos,student:student.watchedVideos})
        if(student.watchedVideos?.length==videos?.length){
          resolve(student.course);
        }else{
          resolve(-1);
        }
      } catch (error) {
        reject(error);
      }
    })
  })
  const completedCourses = await Promise.all(promises)
  if(completedCourses.length==0){
    return <NoCourses text="You havent completed any course yet"/>
  }
  console.log({completedCourses})
  return(
    <main className="my-24">
      {completedCourses.map((course,i)=><Card id={course as number} key={i}/>)}
    </main>
  )
}