
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useMessages, useMessageActions} from "./context"; // Adjust import path
import { useUser } from "@clerk/nextjs"; // Import Clerk's useUser hook
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Message from "./Message";

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}

export default function Page() {
  const { state: messages } = useMessages();
  const { addMessage} = useMessageActions();
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() && user) {
      addMessage({
        id: Date.now(),
        message: newMessage,
        sender: user.id,
        to: null,
        firstname: user.firstName || user.username || "User",
        profile: user.imageUrl || null,
        course: null,
        group: false,
        created_at: new Date().toISOString(),
      });
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isCurrentUser = (msgSender: string | null) => {
    return user && msgSender === user.id;
  };

  return (
    <div className="flex flex-col h-screen max-h-screen p-4 bg-gray-50">
      <div className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Chat Messages</div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        <div className="flex flex-col gap-6">
          {messages.map((msg) => {
            const isUserMessage = isCurrentUser(msg.sender);
            return <Message
              key={msg.id}
              isUserMessage={isUserMessage}
              profile={msg.profile}
              firstname={msg.firstname || "User"}
              message={msg.message||""}
              id={msg.id}
              created_at={msg.created_at}
            />
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="sticky bottom-0 bg-gray-50 pt-2">
        <div className="flex gap-2 items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.imageUrl} alt={user?.firstName || "User"} />
            <AvatarFallback>
              {user?.firstName ? getInitials(user.firstName) : "U"}
            </AvatarFallback>
          </Avatar>
          <Input 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            disabled={!newMessage.trim() || !user}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="mr-2 h-4 w-4" /> Send
          </Button>
        </div>
      </div>
    </div>
  );
}