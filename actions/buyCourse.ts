"use server"
import { clerkClient } from "@clerk/nextjs/server";

export async function buyCourse(userId: string, courseId: number) {
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

        return "Course purchased successfully";
    } catch (error) {
        console.error("Error purchasing course:", error);
        return "Error purchasing course";
    }
}