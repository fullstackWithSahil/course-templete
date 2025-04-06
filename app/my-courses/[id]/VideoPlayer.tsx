"use client"
import Video from "@/components/VideoPlayer";
import { useVideoContext } from "./Context";
import Description from "./Description";

export default function VideoPlayer() {
    const {data} = useVideoContext();
    return (
        <div className="w-full md:w-2/3">
            <Video src={data.currentVideo.url} disabled={data.disabled} />
            <Description/>
        </div>
    );
}
