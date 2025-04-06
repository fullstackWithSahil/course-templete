//Inputarea.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, useUser } from "@clerk/nextjs";
import { useState } from "react";
import supabaseClient from "@/lib/Supabase";

export default function Inputarea() {
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState("");

  const { session } = useSession();
  const supabase = supabaseClient(session);

  async function handleSend() {
    if (newMessage.trim() && user && session) {
      const Message = {
        message: newMessage,
        sender: user.id,
        to: process.env.NEXT_PUBLIC_TEACHER!,
        firstname: user.firstName || user.username || "User",
        profile: user.imageUrl || null,
        course: 97,
        group: false,
      };
      const res = await supabase.from("messages").insert(Message);
      setNewMessage("");
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 pt-2 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex gap-2 items-center">
        <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
          <AvatarImage src={user?.imageUrl} alt={user?.firstName || "User"} />
          <AvatarFallback className="text-xs sm:text-sm">
            {user?.firstName ? getInitials(user.firstName) : "U"}
          </AvatarFallback>
        </Avatar>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className="flex-1 text-sm sm:text-base h-9 sm:h-10 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
        />
        <Button
          onClick={handleSend}
          disabled={!newMessage.trim() || !user}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white h-9 sm:h-10 px-2 sm:px-4 text-sm sm:text-base"
        >
          <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-0 sm:mr-2" /> 
          <span className="hidden sm:inline">Send</span>
        </Button>
      </div>
    </div>
  );
}

// Get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}