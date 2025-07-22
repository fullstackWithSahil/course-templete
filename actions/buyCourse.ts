"use server"
import API from "@/lib/api";
import { supabaseClient } from "@/lib/server/Supabase";
import { clerkClient } from "@clerk/nextjs/server";

export async function buyCourse(userId: string, courseId: number){
    try {
        console.log({userId, courseId});
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        
        if(!user.privateMetadata.purchasedCourses){
            await client.users.updateUserMetadata(userId, {
                privateMetadata: {
                    purchasedCourses: String(courseId),
                },
            })
        }else{
            const existingCourse = user.privateMetadata.purchasedCourses;
            await client.users.updateUserMetadata(userId, {
                privateMetadata: {
                    purchasedCourses: existingCourse +","+ String(courseId),
                },
            })
        }

        //add the student to the course group chat
        const supabase = supabaseClient();
        const {data:courseName} = await supabase
            .from("courses")
            .select("*")
            .eq("id", courseId)
            .single();

            
        //create a personal chat and check if the user has already purchased the course
        const {data:personalChat} = await API.post("/chats/create",{ 
            teacher:process.env.NEXT_PUBLIC_TEACHER,
            name,
            student:user.id
        })
        if (personalChat.message=="Chat with this name already exists for this teacher"){
            return "Chat with this name already exists for this teacher"
        }

        const createGroupChat = await API.post("/chats/add-member",{ 
            chatId:courseName?.chat, 
            member:user.id 
        })
        
        //add the student in the database
        const {data,error} = await supabase.from("students").insert({
            course: courseId,
            student: userId,
            email: user.emailAddresses[0].emailAddress,
            name: user.fullName || user.firstName || user.lastName || "Unknown",
            teacher: process.env.NEXT_PUBLIC_TEACHER || "user_2vS2izG9XRFznfJ9lpQPBldzuRx",
        }).select();
        if (error) {
            console.error("Error inserting student:", error);
            return "Error purchasing course";
        }

        return "Course purchased successfully";
    } catch (error) {
        console.error("Error purchasing course:", error);
        return "Error purchasing course";
    }
}