"use client"
import Video from "@/components/VideoPlayer";
import { useVideoContext } from "./Context";
import Description from "./Description";
import Comments from "./Comments";

export default function VideoPlayer() {
    const {data} = useVideoContext();
    console.log({data:data.currentVideo})
    return (
        <div className="w-full lg:w-2/3">
            <Video src={data.currentVideo.url} disabled={data.disabled} />
            <Description/>
            <div className="hidden lg:block">
                <Comments/>
            </div>
        </div>
    );
}
