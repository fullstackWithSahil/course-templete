"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useChats } from "./Chatcontext";
import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { SupabaseClient } from "@supabase/supabase-js";
import supabaseClient from "@/lib/Supabase";
import Message from "@/components/chats/Message";
import { getOldGroupMessages } from "@/actions/Messages";
import { MessageType } from "@/components/chats/types";

export default function Chats({courseId}:{courseId:number}) {
  const { messages, dispatch } = useChats();
  const { getToken, userId } = useAuth();
  const supabaseRef = useRef<SupabaseClient | null>(null);

  useEffect(() => {
    async function subscribe() {
      try {
        const data = await getOldGroupMessages(courseId);
        if(data=="error") return;
        const dataToSend = data?.map(message=>({
            ...message,
            reactions:JSON.parse(message.reactions as string)
        }))
        dispatch({ type: "add_many", payload: dataToSend as any });
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
              console.log({ newMessage });
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
        console.log("dis connecting to supabase");
      }
    };
  }, [getToken, userId, dispatch,courseId]);

  console.log({messages})

  return (
    <ScrollArea className="h-[65vh] px-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <Message
            key={message.id}
            id={message.id}
            firstname={message.firstname}
            course={message.course}
            profile={message.profile}
            sender={message.sender}
            message={message.message}
            created_at={String(message.created_at)}
            reactions={message.reactions}
            dispatch={dispatch}
          />
        ))}
      </div>
    </ScrollArea>
  );
}