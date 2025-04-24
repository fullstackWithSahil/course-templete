"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useSocket } from "./SocketContext";

export default function Inputfield() {
    const {user} = useUser()
    const [message,setMessage] = useState("");
    const [loading,setLoading]= useState(false);
    const {id} = useParams();
    const socket = useSocket();

    async function handleSend(){
        try {
            if(!message.trim())return;
            if(loading) return;
            setLoading(true);
            const newMessage ={
                message,
                sender:user?.id,
                to:process.env.NEXT_PUBLIC_TEACHER,
                group:true,
                course:Number(id),
                profile:user?.imageUrl,
                firstname:user?.firstName || user?.username || "User",
            }
            socket.emit("sendMessage",newMessage);
            const {data} = await axios.post("http://localhost:8080/api/messages/addmessage",newMessage);
            if(data.error){
                toast.error("There was an error sending the message");
                setLoading(false);
                return;
            }
            setLoading(false);
            setMessage("");
        } catch (error) {
            toast.error("There was an error sending the message");
            setLoading(false);
        }
    }
  return (
    <div className="flex items-center gap-2 px-2 mt-2">
        <Input 
            value={message} 
            onChange={(e)=>setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>
            Send
            <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-0 sm:mr-2" /> 
        </Button>
    </div>
  )
}
