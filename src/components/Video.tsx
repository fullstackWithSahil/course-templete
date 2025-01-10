"use client"
import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const Video = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any | null>(null);
  const [paused,setPaused] = useState(true);
  
  function inputEvents(e: KeyboardEvent){
    e.preventDefault();
    console.log(e.key.toLowerCase())
    switch(e.key.toLowerCase()) {
      case ' ':
        console.log({paused})
        if(paused) {
          setPaused(false);
          videoRef.current?.play();
        }else {
          setPaused(true);
          videoRef.current?.pause();
        }
        break;
      default:
        break;
    }
  }

  useEffect(() =>{
    document.addEventListener("keydown",inputEvents);
    console.log("event listeners added");
    return () => {
      document.removeEventListener("keydown",inputEvents);
      console.log("event listeners removed");
    }
  },[])

  useEffect(() => {
    if (videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: false,
        autoplay: false,
        responsive: true,
        fluid: true,
        sources: [
          {
            src,
            type: 'application/x-mpegURL',
          },
        ],
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [src]);

  return (
    <div data-vjs-player className='w-[90%] mx-[auto] aspect-video max-w-[1000px]'>
      <video 
      ref={videoRef} 
      className="video-js vjs-big-play-centered w-full"
      controls={false}
      
    />
    </div>
  );
};

export default Video;