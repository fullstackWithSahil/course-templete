import NoCourses from "@/components/NoCourses";
import { supabaseClient } from "@/lib/server/Supabase"
import { currentUser } from "@clerk/nextjs/server";
import Content from "./Content";
import axios from "axios";

export default async function Page({ params }: { params: Promise<{ id: string }>}){
    const {id} = await params;
    const supabase = supabaseClient();
    const user = await currentUser();
    
    if(!user){
        return <NoCourses text="You have not purchased this course"/>
    }
    
    const {data:certificate} = await supabase
        .from("certificates")
        .select("*")
        .eq("course",Number(id))
        .eq("student",user.id)
        .single();
    
    if(certificate){
        return (
            <Content firstName={user.firstName||""} pdfUrl={certificate.certificate||""}/>
        )
    }
    
    const {data:videos} = await supabase
        .from("videos")
        .select("*")
        .eq("course",Number(id));
    
    const {data:student} = await supabase
        .from("students")
        .select("*")
        .eq("course",Number(id))
        .eq("student",user.id)
        .single();
    
    const completed = videos?.length == student?.watchedVideos?.length;    
    if(!completed){
        return <NoCourses text="You have not completed this course"/>
    }

    const {data} = await axios.post("https://67tio1utj4.execute-api.us-east-1.amazonaws.com/default/generate-certificate",{ 
        name:user.firstName,
        teacher:process.env.NEXT_PUBLIC_TEACHER 
    })
    
    const {error} = await supabase.from("certificates").insert({
        certificate: data.pdfUrl,
        student: user.id,
        course: Number(id),
    })

    return (
        <Content pdfUrl={data.pdfUrl} firstName={user.firstName||""}/>
    )
}