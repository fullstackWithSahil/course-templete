//Message.tsx
"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useMessageActions } from "./context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, Trash2 } from "lucide-react";

export default function Message({
  isUserMessage,
  profile,
  firstname,
  message,
  id,
  created_at,
}:{
  isUserMessage:any;
  profile:string|null;
  firstname:string;
  message:string;
  id:number;
  created_at:string;
}) {
  const { deleteMessage, updateMessage } = useMessageActions();  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  
  const handleEdit = (id: number) => {
    if (editText.trim()) {
      updateMessage(id, { message: editText });
      setEditingId(null);
      setEditText("");
    }
  };

  const startEditing = (message: string, id: number) => {
    setEditingId(id);
    setEditText(message || "");
  };
  
  return (
    <div 
      className={`flex items-start gap-2 md:gap-3 ${isUserMessage ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className="relative w-full sm:max-w-[85%] md:max-w-[75%]">        
        {/* Message bubble */}
        <div 
          className={`p-2 md:p-3 rounded-lg shadow-sm flex items-start gap-2 ${
            isUserMessage 
              ? "bg-blue-500 text-white dark:bg-blue-600" 
              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          {/* Avatar */}
          <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
            <AvatarImage src={profile || undefined} alt={firstname || "User"} />
            <AvatarFallback className="text-xs md:text-sm">{firstname ? getInitials(firstname) : "U"}</AvatarFallback>
          </Avatar>

          {editingId === id ? (
            <div className="flex flex-col gap-2 w-full">
              <Input 
                value={editText} 
                onChange={(e) => setEditText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleEdit(id)}
                autoFocus
                className="bg-white dark:bg-gray-800 text-sm md:text-base"
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditingId(null)}
                  className="text-xs md:text-sm h-7 md:h-8"
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleEdit(id)}
                  className="text-xs md:text-sm h-7 md:h-8"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 break-words">
              <div className="text-sm md:text-base">{message}</div>
              <div className="text-xs mt-1 opacity-70">
                {new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )}
          
          {/* Action buttons (only for current user's messages) */}
          {isUserMessage && editingId !== id && (
            <div className="self-start ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 md:h-8 md:w-8 p-0">
                    <MoreVertical size={14} className="md:size-16" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:text-gray-200">
                  <DropdownMenuItem onClick={() => startEditing(message || "", id)}
                    className="text-xs md:text-sm dark:hover:bg-gray-700">
                    <Edit className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-500 dark:text-red-400 text-xs md:text-sm dark:hover:bg-gray-700" 
                    onClick={() => deleteMessage(id)}
                  >
                    <Trash2 className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}