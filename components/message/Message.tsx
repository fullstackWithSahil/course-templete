"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Textmessage from "./Textmessage";
import Imagemessage from "./Imagemessage";
import Filemessage from "./Filemessage";
import Options from "./Options";

export type MessageProps = {
  id: string;
  sender: string; // Clerk user ID
  name: string; // Display name of the sender
  profile: string; // URL or initials
  content: string;
  createdAt: string;
  type:"text" | "image" | "file"
};

export default function Message({
  id,
  sender,
  name,
  profile,
  content,
  createdAt,
  type
}: MessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const formattedDate = new Date(createdAt).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="p-2 dark:text-white text-black hover:bg-white/5 rounded transition-colors border-b-[1px] border-black dark:border-white">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
              <AvatarImage src={profile} />
              <AvatarFallback>{profile}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{name}</span>
            <span className="text-xs dark:text-gray-400">{formattedDate}</span>
          </div>
        </div>

        <Options type={type} sender={sender} id={+id} setIsEditing={setIsEditing} content={content}/>
      </div>

      {/* Message Content */}
      <div className="mt-2 text-gray-200">
        {type=="text"&&<Textmessage isEditing={isEditing} setIsEditing={setIsEditing} id={id} content={content}/>}
        {type=="image"&&<Imagemessage content={content}/>}
        {type=="file"&&<Filemessage content={content}/>}
      </div>
    </div>
  );
}