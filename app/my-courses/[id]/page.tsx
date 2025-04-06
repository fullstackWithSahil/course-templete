import Content from "./Content";
import Description from "./Description";
import ContextProvider from "./Context";
import VideoPlayer from "./VideoPlayer";
import { Module, Video } from "./Context";
import CommentWrapper from "./CommentWrapper";
import { supabaseClient } from "@/lib/server/Supabase";


interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({params}:PageProps) {
  const param = await params;
  const id = Number(param.id);
  const supabase = supabaseClient();
  const {data} = await supabase.from("videos").select("*").eq("course",id);
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

        const video: Video = {
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
      <main className="mt-16 md:relative">
        <section className="mx-2 w-full md:w-2/3 md:absolute top-0 left-0">
          <VideoPlayer/>
          <Description/>
          <CommentWrapper/>
        </section>
        <Content modules={blocks}/>
      </main>
    </ContextProvider>
  );
}
