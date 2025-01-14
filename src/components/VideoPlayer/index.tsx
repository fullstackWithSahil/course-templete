"use client";
import { Settings, Volume2, VolumeX, Rewind, FastForward } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const Video = ({ src }: { src: string }) => {
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
  const playerRef = useRef<any | null>(null);
  const [isfullScreen, setisfullScreen] = useState(true);

  const inputEvents = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        playPause();
      } else if (e.key === "ArrowLeft") {
        skip(-10);
      } else if (e.key === "ArrowRight") {
        skip(10);
      }
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

    // Set up time update listener
    playerRef.current.on("timeupdate", () => {
      setCurrentTime(playerRef.current.currentTime());
    });

    playerRef.current.on("loadedmetadata", () => {
      setDuration(playerRef.current.duration());
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

    playerRef.current.src({
      src: `${src}/${currentResolution}/index.m3u8`,
      type: "application/x-mpegURL",
    });

    playerRef.current.one("loadedmetadata", () => {
      playerRef.current.currentTime(currentTime);
      if (wasPlaying) {
        playerRef.current.play();
      }
    });
  }, [currentResolution, src]);

  // Handle volume changes
  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.volume(volume);
    playerRef.current.muted(isMuted);
  }, [volume, isMuted]);

  // Handle playback speed changes
  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.playbackRate(playbackSpeed);
  }, [playbackSpeed]);

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

  function toggleMute() {
    setIsMuted(!isMuted);
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
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

  return (
    <div
      data-vjs-player
      className={isfullScreen?"w-[90%] relative mx-[auto] aspect-video max-w-[1000px]":"z-50 mx-[auto] w-[97vw] h-[97vh] fixed inset-0 bg-black"}
    >
      <div className="group">
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered w-full absolute aspect-video mx-[auto]"
          controls={false}
        />
        <div className="h-[10%] bg-black absolute bottom-0 left-0 right-0 flex flex-col justify-end text-white z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-4">
              {/* Play/Pause */}
              <button onClick={playPause}>
                {paused ? (
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M8,5.14V19.14L19,12.14L8,5.14Z"
                    />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M14,19H18V5H14M6,19H10V5H6V19Z"
                    />
                  </svg>
                )}
              </button>

              {/* Skip buttons */}
              <button onClick={() => skip(-10)}>
                <Rewind className="h-6 w-6" />
              </button>
              <button onClick={() => skip(10)}>
                <FastForward className="h-6 w-6" />
              </button>

              {/* Time display */}
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              {/* Volume control */}
              <div className="flex items-center space-x-2">
                <button onClick={toggleMute}>
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-6 w-6" />
                  ) : (
                    <Volume2 className="h-6 w-6" />
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

            <div className="flex items-center space-x-4">
              <div>
                <button
                  className="text-white"
                  onClick={() =>setisfullScreen((prev) => !prev)}
                >
                  {isfullScreen ? (
                    <svg viewBox="0 0 24 24" className="h-6 w-6">
                      <path
                        fill="currentColor"
                        d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-6 w-6">
                      <path
                        fill="currentColor"
                        d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {/* Playback speed */}
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-transparent border-none outline-none cursor-pointer"
              >
                {playbackSpeeds.map((speed) => (
                  <option key={speed} value={speed} className="text-black">
                    {speed}x
                  </option>
                ))}
              </select>

              {/* Quality settings */}
              <div className="relative">
                <button onClick={() => setShowSettings((prev) => !prev)}>
                  <Settings className="h-6 w-6" />
                </button>
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black border-2 border-black dark:border-white rounded-md p-3">
                    {resolutions.map((res) => (
                      <div
                        key={res}
                        className={`cursor-pointer ${
                          currentResolution === res ? "text-blue-500" : ""
                        }`}
                        onClick={() => changeResolution(res)}
                      >
                        <p className="my-1">{res}p</p>
                        {res !== resolutions[resolutions.length - 1] && (
                          <hr className="border-white" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;