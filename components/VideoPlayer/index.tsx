"use client";
import { Settings, Volume2, VolumeX, Rewind, FastForward } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import addView from "./addView";
import { useSession } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useVideoContext } from "@/app/my-courses/[id]/Context";

const Video = ({
  src,
  disabled,
}:{
  src: string,
  disabled:boolean,
}) => {
  const resolutions = ["1080", "720", "360", "144"];
  const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const [paused, setPaused] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [currentResolution, setCurrentResolution] = useState("1080");
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any | null>(null);// eslint-disable-line @typescript-eslint/no-explicit-any
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [isFullScreen,setIsFullScreen] = useState(false)

  // Handle volume changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  // Handle playback speed changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playbackRate(playbackSpeed);
    }
  }, [playbackSpeed]);

  // Handle mobile touch events
  const handleTouchStart = useCallback(() => {
    setLastTouchTime(Date.now());
    setShowControls(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    const touchDuration = Date.now() - lastTouchTime;
    if (touchDuration < 200) { // Short tap
      playPause();
    }
  }, [lastTouchTime]);

  // Auto-hide controls
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showControls) {
      timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showControls]);

  // Full-screen handling
  const toggleFullScreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullScreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullScreen(false);
      }
    } catch (err) {
      console.error("Error attempting to toggle full-screen:", err);
    }
  };

  // Handle fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const inputEvents = useCallback(
    (e: KeyboardEvent) => {
      if(disabled){
        return;
      }else{
        if (e.key === " ") {
          e.preventDefault();
          playPause();
        } else if (e.key === "ArrowLeft") {
          skip(-10);
        } else if (e.key === "ArrowRight") {
          skip(10);
        } else if (e.key === "f") {
          toggleFullScreen();
        }
      };
    },
    [paused]
  );

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
      sources: [
        {
          src: `${src}/${currentResolution}/index.m3u8`,
          type: "application/x-mpegURL",
        },
      ],
    });

    playerRef.current.on("timeupdate", () => {
      setCurrentTime(playerRef.current.currentTime());
    });

    playerRef.current.on("loadedmetadata", () => {
      setDuration(playerRef.current.duration());
      // Set initial volume and playback speed when metadata is loaded
      playerRef.current.volume(volume);
      playerRef.current.playbackRate(playbackSpeed);
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, []);

  const [viewAdded, setViewAdded] = useState(false);
  const {session} = useSession();
  const {id} = useParams();
  const {data} = useVideoContext();

  useEffect(() => {
    if(viewAdded || !session) return;
    if (currentTime / duration > 0.75) {
      setViewAdded(true);
      addView(session,id as string,data).then(() => {
        console.log("Video is almost finished, adding view...");
      }).catch((error) => {
        console.error("Error adding view:", error);
      });
    }
  }, [currentTime]);

  useEffect(() => {
    if (!playerRef.current) return;
    
    const currentTime = playerRef.current.currentTime();
    const wasPlaying = !playerRef.current.paused();
    const currentVolume = playerRef.current.volume();
    const currentSpeed = playerRef.current.playbackRate();
    
    playerRef.current.src({
      src: `${src}/${currentResolution}/index.m3u8`,
      type: "application/x-mpegURL",
    });
  
    playerRef.current.one('loadedmetadata', () => {
      playerRef.current.currentTime(currentTime);
      playerRef.current.volume(currentVolume);
      playerRef.current.playbackRate(currentSpeed);
      if (wasPlaying) {
        playerRef.current.play();
      }
    });
  }, [currentResolution, src]);

  useEffect(() => {
    const handleOrientation = () => {
      if (isFullScreen) {
        try {
          if (window.screen.orientation) {
            (window.screen.orientation as any).lock("landscape");// eslint-disable-line @typescript-eslint/no-explicit-any
          }
        } catch (err) {
          console.error("Failed to lock orientation:", err);
        }
      }
    };

    handleOrientation();
    window.addEventListener("orientationchange", handleOrientation);
    return () => {
      window.removeEventListener("orientationchange", handleOrientation);
      if (window.screen.orientation) {
        window.screen.orientation.unlock();
      }
    };
  }, [isFullScreen]);

  
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
    
    // Store current time and playing state
    const currentTime = playerRef.current.currentTime();
    const wasPlaying = !playerRef.current.paused();
    
    // Update source with new resolution
    playerRef.current.src({
      src: `${src}/${res}/index.m3u8`, // Fixed: use 'res' instead of 'currentResolution'
      type: "application/x-mpegURL",
    });
    
    // When video is ready, restore time and playing state
    playerRef.current.one('loadedmetadata', () => {
      playerRef.current.currentTime(currentTime);
      playerRef.current.volume(isMuted ? 0 : volume);
      playerRef.current.playbackRate(playbackSpeed);
      if (wasPlaying) {
        playerRef.current.play();
      }
    });
  
    setCurrentResolution(res);
    setShowSettings(false);
  }

  function toggleMute() {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (playerRef.current) {
      playerRef.current.volume(newMutedState ? 0 : volume);
    }
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (playerRef.current) {
      playerRef.current.volume(newVolume);
    }
  }

  function skip(seconds: number) {
    if (!playerRef.current) return;
    const newTime = playerRef.current.currentTime() + seconds;
    playerRef.current.currentTime(Math.max(0, Math.min(newTime, duration)));
  }

  function handleTimelineChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!playerRef.current) return;
    const newTime = parseFloat(e.target.value);
    playerRef.current.currentTime(newTime);
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  function handlePlaybackSpeedChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newSpeed = Number(e.target.value);
    setPlaybackSpeed(newSpeed);
    if (playerRef.current) {
      playerRef.current.playbackRate(newSpeed);
    }
  }

  return (
    <div
      ref={containerRef}
      data-vjs-player
      className={`relative mx-auto ${
        isFullScreen
          ? "lg:w-screen lg:h-screen"
          : "lg:w-full lg:max-w-[1000px] lg:aspect-video"
      }
      `}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseMove={() => setShowControls(true)}
    >
      <div className="group h-full">
        <video
          ref={videoRef}
          className={`video-js vjs-big-play-centered w-full h-full absolute`}
          controls={false}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          } ${isFullScreen ? "pb-safe" : ""}`}
        >
          {/* Timeline */}
          <div className="px-4 w-full">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleTimelineChange}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between px-4 py-2 gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-[200px]">
              <button onClick={playPause} className="mr-2">
                {paused ? (
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      fill="white"
                      d="M8,5.14V19.14L19,12.14L8,5.14Z"
                    />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      fill="white"
                      d="M14,19H18V5H14M6,19H10V5H6V19Z"
                    />
                  </svg>
                )}
              </button>

              <div className="hidden sm:flex items-center space-x-2">
                <button onClick={() => skip(-10)}>
                  <Rewind className="h-6 w-6 fill-accent dark:fill-white" />
                </button>
                <button onClick={() => skip(10)}>
                  <FastForward className="h-6 w-6 fill-accent dark:fill-white" />
                </button>
              </div>

              <span className="text-sm whitespace-nowrap text-white">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <div className="hidden sm:flex items-center space-x-2">
                <button onClick={toggleMute}>
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-6 w-6 fill-white text-white" />
                  ) : (
                    <Volume2 className="h-6 w-6 fill-white text-white" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <select
                value={playbackSpeed}
                onChange={handlePlaybackSpeedChange}
                className="cursor-pointer text-sm text-white bg-black px-5"
              >
                {playbackSpeeds.map((speed) => (
                  <option key={speed} value={speed} className="">
                    {speed}x
                  </option>
                ))}
              </select>

              <div className="relative">
                <button onClick={() => setShowSettings((prev) => !prev)}>
                  <Settings className="h-6 w-6 dark:fill-accent fill-white" />
                </button>
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black border border-gray-700 rounded-md p-2">
                    {resolutions.map((res) => (
                      <div
                        key={res}
                        className={`cursor-pointer px-2 py-1 ${
                          currentResolution === res ? "text-blue-500" : "text-white"
                        }`}
                        onClick={() => changeResolution(res)}
                      >
                        {res}p
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={toggleFullScreen}>
                {isFullScreen ? (
                  <svg viewBox="0 0 24 24" className="h-6 w-6">
                    <path
                      fill="white"
                      d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-6 w-6">
                    <path
                      fill="white"
                      d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;