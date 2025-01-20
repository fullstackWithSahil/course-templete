"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, ThumbsUp, ThumbsDown, Smile } from "lucide-react";
import { MessageType, useChats } from "./Chatcontext";
import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { SupabaseClient } from '@supabase/supabase-js';
import supabaseClient from "@/lib/Supabase";

export default function Chats() {
  const { messages, dispatch } = useChats();
  const { getToken, userId } = useAuth();
  const supabaseRef = useRef<SupabaseClient | null>(null);

  function handleReaction(
    id: number,
    reaction: "heart" | "thumbsUp" | "thumbsDown" | "smile"
  ) {
    dispatch({ type: "add_reaction", payload: { id, reaction } });
  }

  useEffect(() => {
    async function subscribe() {
      try {
        console.log("connecting to supabase")
        const token = await getToken({ template: "supabase" });
        const supabase = await supabaseClient(token);
        supabaseRef.current = supabase;
        
        supabase
        .channel("custom-insert-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages" },
          (payload) => {
            const newMessage = payload.new as MessageType;
            dispatch({ type: "add_message", payload: newMessage });
            console.log({newMessage});
          }
        )
        .subscribe((status) => {
          if (status !== "SUBSCRIBED") {
            console.error("Subscription failed:", status);
          }
        });
      } catch (error) {
        console.error("Error setting up real-time subscription:", error);
      }
    }
    
    if (userId) {
      subscribe();
    }
    
    return () => {
      if (supabaseRef.current) {
        supabaseRef.current.removeAllChannels();
        console.log("dis connecting to supabase")
      }
    };
  }, [getToken, userId, dispatch]);

  const reactions = [
    { type: "heart", Icon: Heart },
    { type: "thumbsUp", Icon: ThumbsUp },
    { type: "thumbsDown", Icon: ThumbsDown },
    { type: "smile", Icon: Smile },
  ] as const;

  return (
    <ScrollArea className="h-[400px] pr-4">
      {messages.map((message) => (
        <div key={message.id} className="mb-4">
          <div className="flex items-start space-x-2">
            <Avatar>
              <AvatarImage src={message.profile} alt={message.firstname||""} />
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{message.firstname}</p>
              <p>{message.message}</p>
              <div className="flex space-x-2 mt-2">
                {reactions.map(({ type, Icon }) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => handleReaction(message.id, type)}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {message.reactions[type]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}