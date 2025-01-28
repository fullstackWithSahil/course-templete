"use server";

import { createClient } from "@/lib/server/Supabase";
import { clerkClient } from "@clerk/nextjs/server";

export async function syncUpUser(userId: string, courseId: number, email: string) {
    console.log("Syncing up user...");

    if (!process.env.NEXT_PUBLIC_TEACHER) {
        throw new Error("Environment variable NEXT_PUBLIC_TEACHER is not defined");
    }

    try {
        // Supabase insertion
        const supabase = await createClient();
        const { error: supabaseError, data: supabaseData } = await supabase
            .from("students")
            .insert({
                teacher: process.env.NEXT_PUBLIC_TEACHER,
                course: courseId,
                student: userId,
                email,
            });

        if (supabaseError) {
            console.error("Supabase error:", supabaseError.message);
            throw new Error(`Failed to insert student data: ${supabaseError.message}`);
        }

        console.log("Supabase response:", supabaseData);

        // Clerk user metadata update
        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                isSyncedUp: true,
            },
        });

        console.log("User metadata updated successfully");

        return "OK";
    } catch (error) {
        console.error("Error in syncUpUser:", error);
        throw error;
    }
}
