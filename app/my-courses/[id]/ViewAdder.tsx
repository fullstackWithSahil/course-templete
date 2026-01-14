"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "@clerk/nextjs";
import { State } from "@/app/my-courses/[id]/Context";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import supabaseClient from "@/lib/Supabase";

export default function ViewAdder({ data,videoId }: { data: State,videoId:number }) {
    const { session } = useSession();
    const params = useParams();
    const courseId = params.id as string;
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check if current video is watched on mount and when video changes
    useEffect(() => {
        checkIfWatched();
    }, [data.currentVideo.id, session]);

    async function checkIfWatched() {
        if (!session) return;

        const supabase = supabaseClient(session);
        const { data: student } = await supabase
            .from("students")
            .select("watchedVideos")
            .eq("student", session?.user.id)
            .eq("course", Number(courseId))
            .single();

        if (student?.watchedVideos) {
            setIsChecked(student.watchedVideos.includes(videoId));
        }
    }

    async function toggleWatched(checked: boolean) {
        if (!session) return;

        setIsLoading(true);
        const supabase = supabaseClient(session);

        try {
            // Get student's record
            const { data: student } = await supabase
                .from("students")
                .select("*")
                .eq("student", session?.user.id)
                .eq("course", Number(courseId))
                .single();
            
            console.log({student})
            if (!student) {
                console.error("Student not found");
                setIsLoading(false);
                return;
            }

            const videoId = Number(data.currentVideo.id);
            let watchedVideos = student.watchedVideos || [];

            if (checked) {
                // Add video to watched list
                if (!watchedVideos.includes(videoId)) {
                    watchedVideos.push(videoId);
                }
            } else {
                // Remove video from watched list
                watchedVideos = watchedVideos.filter((id: number) => id !== videoId);
            }

            // Update database
            const { error } = await supabase
                .from("students")
                .update({ watchedVideos })
                .eq("id", student.id);

            if (error) {
                console.error("Error updating watched videos:", error);
                // Revert checkbox state on error
                setIsChecked(!checked);
            } else {
                setIsChecked(checked);
            }
        } catch (error) {
            console.error("Error toggling watched status:", error);
            setIsChecked(!checked);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="text-xs flex flex-col gap-1 items-center">
            <p>watched</p>
            <Checkbox
                checked={isChecked}
                onCheckedChange={toggleWatched}
                disabled={isLoading}
            />
        </div>
    );
}