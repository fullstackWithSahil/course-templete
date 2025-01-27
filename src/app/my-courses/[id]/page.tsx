import Content from "./Content";
import Description from "./Description";
import Comments from "./Comments";
import ContextProvider from "./Context";
import VideoPlayer from "./VideoPlayer";
import { createClient } from "@/lib/server/Supabase";
import { Module, Video } from "./Context";


export default async function Page({params}:{params:{id:string}}) {
  const id = Number(params.id);
  const supabase = await createClient();
  const {data} = await supabase.from("videos").select("*").eq("course",id);
  const modules: Module[] = data
    ? data.reduce((acc: Module[], item) => {
        const moduleId = item.module ?? "unknown";
        let module = acc.find((mod) => mod.id === moduleId);

        if (!module) {
          module = {
            id: moduleId,
            name: moduleId, // Assuming module name is the same as module id
            videos: [],
          };
          acc.push(module);
        }

        const video: Video = {
          id: item.id.toString(),
          title: item.title ?? "Untitled",
          description: item.description ?? "",
          url: item.url ?? "",
          thumbnail: item.thumbnail ?? "",
          createdAt: item.created_at,
        };

        module.videos.push(video);
        return acc;
      }, [])
    : [];

    const currentVideo = modules[0].videos[0];
    return (
    <ContextProvider currentVideo={currentVideo}>
      <main className="mt-16 md:relative">
        <section className="mx-2 w-full md:w-2/3 md:absolute top-0 left-0">
          <VideoPlayer/>
          <Description/>
          <Comments/>
        </section>
        <Content modules={modules}/>
      </main>
    </ContextProvider>
  );
}
