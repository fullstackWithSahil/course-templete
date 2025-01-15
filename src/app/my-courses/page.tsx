"use client"
import Content from "./Content";
import Description from "./Description";
import Comments from "./Comments";
import Video from "@/components/VideoPlayer";
import { useState } from "react";

export default function page() {
  const [isFullScreen,setIsFullScreen] = useState(false)
  return (
    <main className="mt-16 md:relative">
      <section className="mx-2 w-full md:w-2/3 md:absolute top-0 left-0">
        <div>
          <Video 
            isFullScreen={isFullScreen} 
            setIsFullScreen={setIsFullScreen} 
            src="https://buisnesstools-course.b-cdn.net/user_2r7lLMtMOfJgVXLJtKHS95nCzlM/sahil2/start/lesson-1.mp4" 
          />
        </div>
        <div className="flex items-center justify-between my-2">
          <h1 className="text-xl mx-2">Basics of HTML</h1>
          <h1 className="text-xl mx-2">11/12/2024</h1>
        </div>
        <Description/>
        <Comments/>
      </section>
      <Content/>
    </main>
  );
}
