"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import supabaseClient from "@/lib/Supabase";
import { useUser } from "@clerk/clerk-react";
import { useSession } from "@clerk/nextjs";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Inputfield() {
    const {session} = useSession();
    const {user} = useUser()
    const [message,setMessage] = useState("");
    const [loading,setLoading]= useState(false);

    async function handleSend(){
        try {
            if(!message.trim())return;
            if(loading) return;
            setLoading(true);
            const supabase = supabaseClient(session);
            const {error} = await supabase.from("messages").insert({
                message,
                sender:user?.id,
                to:process.env.NEXT_PUBLIC_TEACHER,
                group:false,
                course:Number(process.env.NEXT_PUBLIC_DUMMY_COURSE!),
                profile:user?.imageUrl,
                firstname:user?.firstName || user?.username || "User",
            })
            setLoading(false);
            setMessage("");
            if(error){
                toast.error("There was an error sending the message");
                return;
            }
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
