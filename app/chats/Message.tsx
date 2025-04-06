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
      className={`flex items-start gap-3 ${isUserMessage ? "flex-row-reverse" : "flex-row"}`}
    >
      
      <div className="relative max-w-[75%]">        
        {/* Message bubble */}
        <div 
          className={`p-3 rounded-lg shadow-sm flex items-center gap-2 ${
            isUserMessage 
              ? "bg-blue-500 text-white" 
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {/* Avatar */}
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={profile || undefined} alt={firstname || "User"} />
            <AvatarFallback>{firstname ? getInitials(firstname) : "U"}</AvatarFallback>
          </Avatar>

          {editingId === id ? (
            <div className="flex flex-col gap-2">
              <Input 
                value={editText} 
                onChange={(e) => setEditText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleEdit(id)}
                autoFocus
                // className="bg-white"
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleEdit(id)}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div>{message}</div>
              <div className="text-xs mt-1 opacity-70">
                {new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )}
          {/* Action buttons (only for current user's messages) */}
          {isUserMessage && editingId !== id && (
            <div className="self-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => startEditing(message || "", id)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-500" 
                    onClick={() => deleteMessage(id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
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