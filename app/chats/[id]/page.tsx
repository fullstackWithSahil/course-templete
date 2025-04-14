"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useMessages, useMessageActions, MessageType } from "./context";
import { useSession, useUser } from "@clerk/nextjs";
import Message from "./Message";
import Inputarea from "./Inputarea";
import supabaseClient from "@/lib/Supabase";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  const { state: messages } = useMessages();
  const { addMessage, updateMessage, deleteMessage, clearMessages } = useMessageActions();
  const params = useParams();
  const courseId = params.id ? Number(params.id) : null;
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { session } = useSession();
  const [supabase] = useState(() => supabaseClient(session));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasInitiallyFetched, setHasInitiallyFetched] = useState(false);

  // Memoize message event handlers to prevent recreation on every render
  const handleInsert = useCallback((payload: any) => {
    console.log('New message received!', payload.new);
    addMessage(payload.new as MessageType);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [addMessage]);

  const handleUpdate = useCallback((payload: any) => {
    console.log('Message updated!', payload.new);
    updateMessage(payload.new.id, payload.new as MessageType);
  }, [updateMessage]);

  const handleDelete = useCallback((payload: any) => {
    console.log('Message deleted!', payload.old);
    deleteMessage(payload.old.id);
  }, [deleteMessage]);

  // Fetch initial messages - separated from subscription logic
  useEffect(() => {
    if (!session || !courseId || hasInitiallyFetched) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        clearMessages();

        const { data, error } = await supabase
          .from("messages")
          .select('*')
          .eq('course', courseId)
          .order('created_at', { ascending: true });
        
        if (error) {
          console.error('Error fetching messages:', error);
          setError('Failed to load messages. Please try again.');
          setLoading(false);
          return;
        }
        
        if (data) {
          data.forEach(message => addMessage(message as MessageType));
          console.log('Fetched messages:', data);
          
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
        setLoading(false);
        setHasInitiallyFetched(true);
      } catch (error) {
        console.error('Error in message fetching:', error);
        setError('An unexpected error occurred. Please refresh the page.');
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [session, courseId, supabase, clearMessages, addMessage, hasInitiallyFetched]);

  // Subscribe to real-time changes - separate from fetching
  useEffect(() => {
    if (!session || !courseId) return;
    
    console.log(`Setting up subscription for course ${courseId}`);
    
    const channel = supabase.channel(`course-${courseId}-channel`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'messages',
          filter: `course=eq.${courseId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            handleInsert(payload);
          } else if (payload.eventType === "UPDATE") {
            handleUpdate(payload);
          } else if (payload.eventType === "DELETE") {
            handleDelete(payload);
          }
        }
      )
      .subscribe();
    
    // Cleanup function
    return () => {
      console.log(`Cleaning up subscription for course ${courseId}`);
      channel.unsubscribe();
    };
  }, [courseId, session, supabase, handleInsert, handleUpdate, handleDelete]);

  // Reset state when changing courses
  useEffect(() => {
    return () => {
      setHasInitiallyFetched(false);
    };
  }, [courseId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && !loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, loading]);

  const isCurrentUser = (msgSender: string | null) => {
    return user && msgSender === user.id;
  };

  return (
    <div className="flex flex-col h-screen max-h-screen p-2 sm:p-3 md:p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
        Course Chat {courseId && `#${courseId}`}
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto mb-2 sm:mb-4 pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Spinner className="mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Loading messages...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-500 dark:text-red-400">
              <p>{error}</p>
              <button 
                onClick={() => {
                  setHasInitiallyFetched(false);
                  setLoading(true);
                }}
                className="mt-2 text-blue-500 dark:text-blue-400 underline"
              >
                Retry
              </button>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
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
        )}
      </div>
      
      {/* Input area */}
      <Inputarea />
    </div>
  );
}