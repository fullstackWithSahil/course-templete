import { State} from "@/app/my-courses/[id]/Context";
import supabaseClient from "@/lib/Supabase";

export default async function addView(session:any,courseId:string,data:State) {
    //supabase client
    const supabase = supabaseClient(session);
    
    //get student's id
    const {data:student} = await supabase
        .from("students")
        .select("*")
        .eq("student",session?.user.id)
        .eq("course",Number(courseId))
        .single();
    if (!student)return;

    //get video id
    const videoId = data.currentVideo.id;
    console.log({ student, videoId });

    //get all the videos watched by the user
    const watchedVideos = student.watchedVideos || [];

    //if the video is not in the list, add it
    if (!watchedVideos.includes(Number(videoId))) {
        watchedVideos.push(Number(videoId));
        
        const {error} = await supabase.from("students").update({
            watchedVideos
        }).eq("id", student.id)
        .select("*");

        if( error ) {
            console.error("Error updating watched videos:", error);
        }
    }
}