"use client"

import Video from "./Video"

export default function VideoPlayer({src}:{src: string}) {
  return (
    <div className="w-[90%] mx-[auto] aspect-video max-w-[1000px]">
        <Video src={src}/>
    </div>
  )
}
