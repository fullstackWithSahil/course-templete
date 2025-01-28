//Chats.tsx

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
import Message from "./Message";

export default function Chats() {
  const { messages, dispatch } = useChats();
  const { getToken, userId } = useAuth();
  const supabaseRef = useRef<SupabaseClient | null>(null);

  useEffect(() => {
    async function subscribe() {
      try {
        console.log("connecting to supabase")
        const token = await getToken({ template: "supabase" });
        const supabase = supabaseClient(token);
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

  return (
    <ScrollArea className="h-[65vh] px-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <Message key={message.id} {...message} />
        ))}
      </div>
    </ScrollArea>
  );
}