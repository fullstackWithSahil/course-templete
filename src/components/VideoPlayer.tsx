"use client";
import { Settings } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const Video = ({ src }: { src: string }) => {
  const resolutions = ["1080", "720", "360", "144"];
  const [paused, setPaused] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [currentResolution, setCurrentResolution] = useState("1080");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any | null>(null);

  const inputEvents = useCallback((e: KeyboardEvent) => {
    if (e.key === " ") {
      e.preventDefault();
      if (paused) {
        setPaused(false);
        playerRef.current?.play();
      } else {
        setPaused(true);
        playerRef.current?.pause();
      }
    }
  }, [paused]);

  useEffect(() => {
    document.addEventListener("keydown", inputEvents);
    return () => {
      document.removeEventListener("keydown", inputEvents);
    };
  }, [inputEvents]);

  // Initial player setup
  useEffect(() => {
    if (!videoRef.current) return;

    playerRef.current = videojs(videoRef.current, {
      controls: false,
      autoplay: false,
      responsive: true,
      fluid: true,
      sources: [{
        src: `${src}/${currentResolution}/index.m3u8`,
        type: "application/x-mpegURL",
      }],
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, []);

  // Handle resolution changes
  useEffect(() => {
    if (!playerRef.current) return;

    const currentTime = playerRef.current.currentTime();
    const wasPlaying = !playerRef.current.paused();

    // Update the source
    playerRef.current.src({
      src: `${src}/${currentResolution}/index.m3u8`,
      type: "application/x-mpegURL",
    });

    // Wait for the video to load metadata
    playerRef.current.one("loadedmetadata", () => {
      // Restore the playback time
      playerRef.current.currentTime(currentTime);
      
      // Resume playback if it was playing
      if (wasPlaying) {
        playerRef.current.play();
      }
    });
  }, [currentResolution, src]);

  function playPause() {
    setPaused((prev) => !prev);
    if (paused) {
      playerRef.current?.play();
    } else {
      playerRef.current?.pause();
    }
  }

  function changeResolution(res: string) {
    if (!playerRef.current) return;
    setCurrentResolution(res);
    setShowSettings(false);
  }

  return (
    <div
      data-vjs-player
      className="w-[90%] relative mx-[auto] aspect-video max-w-[1000px]"
    >
      <div className="group">
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered w-full absolute"
          controls={false}
        />
        <div className="h-[10%] bg-black absolute bottom-0 left-0 right-0 flex items-center justify-around text-white z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
                    className={`cursor-pointer ${
                      currentResolution === res ? "text-blue-500" : ""
                    }`}
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
    </div>
  );
};

export default Video;