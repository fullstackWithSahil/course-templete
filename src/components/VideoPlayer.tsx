"use client";
import { Settings } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const Video = ({ src }: { src: string }) => {
  const resolutions = ["1080", "720", "360", "144"];
  const [paused, setPaused] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [source, setSource] = useState("1080");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any | null>(null);

  // Initialize video.js player
  // useEffect(() => {
  //   if (!playerRef.current && videoRef.current) {
  //     playerRef.current = videojs(videoRef.current, {
  //       controls: false,
  //       autoplay: false,
  //       responsive: true,
  //       fluid: true,
  //     });
  //   }
  
  //   return () => {
  //     if (playerRef.current) {
  //       playerRef.current.dispose();
  //       playerRef.current = null;
  //     }
  //   };
  // }, []);

  // Keyboard event handler
  const inputEvents = useCallback((e: KeyboardEvent) => {
    if (e.key === " ") {
      e.preventDefault();
      if (paused) {
        setPaused(false);
        videoRef.current?.play();
      } else {
        setPaused(true);
        videoRef.current?.pause();
      }
    }
  }, [paused]);

  useEffect(() => {
    document.addEventListener("keydown", inputEvents);
    return () => {
      document.removeEventListener("keydown", inputEvents);
    };
  }, [inputEvents]);

  useEffect(() => {
    // Dispose of the previous player if it exists
    if (playerRef.current) {
      playerRef.current.dispose();
    }
    if (videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: false,
        autoplay: false,
        responsive: true,
        fluid: true,
        sources: [
          {
            src: `${src}/${source}/index.m3u8`,
            type: "application/x-mpegURL",
          },
        ],
      });
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, []);

  // Play/pause handler
  function playPause() {
    setPaused((prev) => !prev);
    if (paused) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }

  // Change resolution handler
  function changeResolution(res: string) {
    if (!playerRef.current) return;

    const newUrlArr = src.split("/");
    newUrlArr[newUrlArr.length - 2] = res; // Update resolution in the URL
    const updatedSrc = newUrlArr.join("/");
    setSource(updatedSrc);
  }

  return (
    <div
      data-vjs-player
      className="w-[90%] relative mx-[auto] aspect-video max-w-[1000px]"
    >
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered w-full absolute"
        controls={false}
      />
      <div className="h-[10%] bg-black absolute bottom-0 left-0 right-0 flex items-center justify-around text-white z-10">
        <div className="h-full z-10 text-white" onClick={playPause}>
          {paused ? (
            <svg className="h-full" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>
          ) : (
            <svg className="h-full" viewBox="0 0 24 24">
              <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
            </svg>
          )}
        </div>
        <div
          className="cursor-pointer relative"
          onClick={() => setShowSettings((prev) => !prev)}
        >
          {showSettings && (
            <div className="absolute settings-dropdown border-2 border-black dark:border-white rounded-md p-3 bottom-10 bg-black">
              {resolutions.map((res) => (
                <span
                  key={res}
                  className="cursor-pointer"
                  onClick={() => changeResolution(res)}
                >
                  <p className="my-[1px]">{res}p</p>
                  <hr className="border-white" />
                </span>
              ))}
            </div>
          )}
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default Video;