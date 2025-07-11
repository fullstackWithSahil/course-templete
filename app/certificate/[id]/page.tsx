import NoCourses from "@/components/NoCourses";
import API from "@/lib/api";
import { supabaseClient } from "@/lib/server/Supabase"
import { currentUser } from "@clerk/nextjs/server";
import { Award, Download, Share2, Trophy, Star } from "lucide-react";
import Content from "./Content";

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

    const {data} = await API.post("/certificate",{ 
        name:user.firstName,
        course:id, 
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