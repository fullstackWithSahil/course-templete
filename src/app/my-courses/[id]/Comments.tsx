"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useDisableControls } from "./Context";
import { createSupabaseClient } from "@/lib/Supabase";
import { useToast } from "@/hooks/use-toast";

export default function Comments() {
  const {data,setdata} = useDisableControls();
  const [value,setValue] = useState("");
  const {toast}= useToast();
  async function handleSend(){
    const supabase = createSupabaseClient();
    setdata(prev=>({...prev,disableControls:false}));
    try {
      await supabase.from("comments").insert({
        video: data.id,
        comment:value,
      });
    } catch (error) {
      toast({
        title:"Error commenting on this video",
        description:"There was an error commenting on this video. Please try again later"
      })
    }
  }
  return (
    <div>
      <div className="flex items-center justify-between my-2">
        <h1 className="text-xl">Comments:400</h1>
        <Button onClick={()=>setdata(prev=>({...prev,disableControls:true}))}>Add a comment</Button>
      </div>
      {data.disableControls&&<div>
        <Textarea 
          value={value} 
          onChange={e=>setValue(e.target.value)} 
          className="dark:border-white dark:bg-gray-700"
        />
        <div className="text-right">
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>}
    </div>
  )
}