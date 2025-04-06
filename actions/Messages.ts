"use server";

import { createClient } from "@/lib/server/Supabase";

export async function getOldMessages(){
    try {
        const supabase = await createClient();
        const {data} = await supabase
            .from("messages")
            .select("*")
            .eq("group",false)
            .or(`sender.eq.${process.env.NEXT_PUBLIC_TEACHER},to.eq.${process.env.NEXT_PUBLIC_TEACHER}`);
        
        return data;
    } catch (error) {
        console.log("there was an error getting old messages", error);
        return "error"
    }
}

export async function getOldGroupMessages(courseId:number){
    try {
        const supabase = await createClient();
        const {data} = await supabase
            .from("messages")
            .select("*")
            .eq("course", courseId)
            .eq("group",true)
            .or(`sender.eq.${process.env.NEXT_PUBLIC_TEACHER},to.eq.${process.env.NEXT_PUBLIC_TEACHER}`);
        
        return data;
    } catch (error) {
        console.log("there was an error getting old messages", error);
        return "error"
    }
}