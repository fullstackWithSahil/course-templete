"use client";
import { useState } from "react";
import { useVideoContext } from "./Context";

export default function Description() {
  const [more, setMore] = useState(false);
  const {data} = useVideoContext();
  return (
    <div
      className={
        more
          ? "p-2 bg-gray-300 dark:bg-gray-900"
          : "p-2 rounded-md bg-gray-300 flex items-center justify-center dark:bg-gray-900"
      }
    >
      <p className={more ? "" : "truncate"}>
        {data.currentVideo.description}
      </p>
      <p
        className={more ? "hidden" : "text-blue-400 cursor-pointer"}
        onClick={() => setMore(true)}
      >
        more
      </p>
      <p
        className={more ? "text-blue-400 cursor-pointer" : "hidden"}
        onClick={() => setMore(false)}
      >
        show less
      </p>
    </div>
  );
}
