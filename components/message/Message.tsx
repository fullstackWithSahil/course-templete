"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Textmessage from "./Textmessage";
import Imagemessage from "./Imagemessage";
import Filemessage from "./Filemessage";
import Options from "./Options";
import { Crown, Reply, Zap } from "lucide-react";
import Reactions from "./Reactions";
import AddReaction from "./AddReaction";

export type MessageType = {
  id: string;
  sender: string; // Clerk user ID
  name: string; // Display name of the sender
  profile: string; // URL or initials
  content: string;
  createdAt: string;
  type:"text" | "image" | "file";
  replyTo?:MessageType|null;
  tier:"basic"|"premium" | "vip";
  reactions:{
    emoji:string;
    reactedBy:string[];
  }[]
};

export default function Message({
  id,
  sender,
  name,
  profile,
  content,
  createdAt,
  type,
  tier,
  reactions,
  replyTo
}: MessageType) {
  const [isEditing, setIsEditing] = useState(false);
  const formattedDate = new Date(createdAt).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="group relative">
    <AddReaction 
      messageId={id} 
      message={{id,sender,name,profile,content,createdAt,type,reactions,replyTo,tier}}
    />
    <div
      className="p-2 dark:text-white text-black hover:bg-white/5 rounded transition-colors border-b-[1px] border-black dark:border-white"
    >
      {replyTo&&<div className="dark:bg-gray-700">
        <p className="flex items-center gap-3 text-gray-300">replying to<Reply className="rotate"/></p>
        <div>
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
                <AvatarImage src={replyTo.profile} />
                <AvatarFallback>{replyTo.profile}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">{replyTo.name}</span>
              <span className="text-xs dark:text-gray-400">{formattedDate}</span>
            </div>
          </div>
          <p>{replyTo.content}</p>
          <br />
        </div>
      </div>}
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

        <div className="flex items-center">
          {tier=="premium"&&<Zap/>}
          {tier=="vip"&&<Crown/>}
        <Options 
          id={id}
          sender={sender}
          name={name}
          profile={profile} 
          content={content}
          createdAt={createdAt}
          type={type} 
          setIsEditing={setIsEditing}
          tier={tier}
        />
        </div>
      </div>

      {/* Message Content */}
      <div className="mt-2 text-gray-200">
        {type=="text"&&<Textmessage isEditing={isEditing} setIsEditing={setIsEditing} id={id} content={content}/>}
        {type=="image"&&<Imagemessage content={content}/>}
        {type=="file"&&<Filemessage content={content}/>}
      </div>
      {(reactions&&reactions.length>0)?<Reactions messageId={id} reactions={reactions}/>:<></>}
    </div>
    </div>
  );
}