//page.tsx
"use client";

import { useEffect, useRef } from "react";
import { useMessages, useMessageActions } from "./context";
import { useSession, useUser } from "@clerk/nextjs";
import Message from "./Message";
import Inputarea from "./Inputarea";
import supabaseClient from "@/lib/Supabase";

export default function Page() {
  const { state: messages } = useMessages();
  const { addMessage, updateMessage, deleteMessage } = useMessageActions();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { session } = useSession();
  const supabase = supabaseClient(session);

  // Subscribe to real-time changes from Supabase
  useEffect(() => {
    if (!session) return;
    
    // Create a channel for real-time updates
    const channel = supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            console.log('New message received!', payload.new);
            // Add the new message to our state
            addMessage(payload.new as any);
          } else if (payload.eventType === "UPDATE") {
            console.log('Message updated!', payload.new);
            // Update the message in our state
            updateMessage(payload.new.id, payload.new);
          } else if (payload.eventType === "DELETE") {
            console.log('Message deleted!', payload.old);
            // Remove the message from our state
            deleteMessage(payload.old.id);
          }
        }
      )
      .subscribe();
    
    // Initial message loading
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }
        
        // Add all fetched messages to state
        if (data) {
          data.forEach(message => addMessage(message));
        }
      } catch (error) {
        console.error('Error in message fetching:', error);
      }
    };
    
    fetchMessages();
    
    // Cleanup function
    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isCurrentUser = (msgSender: string | null) => {
    return user && msgSender === user.id;
  };

  return (
    <div className="flex flex-col h-screen max-h-screen p-2 sm:p-3 md:p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Chat Messages</div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto mb-2 sm:mb-4 pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <div className="flex flex-col gap-4 sm:gap-6">
          {messages.map((msg) => {
            const isUserMessage = isCurrentUser(msg.sender);
            return <Message
              key={msg.id}
              isUserMessage={isUserMessage}
              profile={msg.profile}
              firstname={msg.firstname || "User"}
              message={msg.message || ""}
              id={msg.id}
              created_at={msg.created_at}
            />
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <Inputarea />
    </div>
  );
}