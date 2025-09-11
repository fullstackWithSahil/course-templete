//page.tsx
import { supabaseClient } from "@/lib/server/Supabase";
import ContextProvider, { Module, Video as VideoType } from "./Context";
import Content from "./Content";
import VideoPlayer from "./VideoPlayer";
import Comments from "./Comments";
import { currentUser } from "@clerk/nextjs/server";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const supabase = supabaseClient();
  const param = await params;
  const user = await currentUser();
  if (!user) {
    <RedirectToSignIn/>
  }
  const {data:student} = await supabase
    .from("students")
    .select("id")
    .eq("student",user?.id||"")
    .eq("teacher",process.env.NEXT_PUBLIC_TEACHER!)
    .single();

  if(!student){
    redirect("/courses");
  }
  const id = Number(param.id);
  const { data } = await supabase.from("videos").select("*").eq("course", id);

  //formatting the videos
  const blocks: Module[] = data
    ? data.reduce((acc: Module[], item) => {
        const blockId = item.module ?? "unknown";
        let block = acc.find((mod) => mod.id === blockId);

        if (!block) {
          block = {
            id: blockId,
            name: blockId, // Assuming block name is the same as block id
            videos: [],
          };
          acc.push(block);
        }

        const video: VideoType = {
          id: item.id.toString(),
          title: item.title ?? "Untitled",
          description: item.description ?? "",
          url: item.url ?? "",
          thumbnail: item.thumbnail ?? "",
          createdAt: item.created_at,
        };

        block.videos.push(video);
        return acc;
      }, [])
    : [];

    const currentVideo = blocks[0].videos[0];
    
    return (
        <ContextProvider currentVideo={currentVideo}>
            <main className="mt-16">
                <section className="flex flex-wrap">
                    <VideoPlayer/>
                    <Content blocks={blocks}/>
                </section>
                <div className="lg:hidden">
                    <Comments/>              
                </div>
            </main>
        </ContextProvider>
    );
}
