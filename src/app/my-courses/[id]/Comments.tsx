"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useDisableControls } from "./Context";
import  supabaseClient from "@/lib/Supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser } from "@clerk/nextjs";

export default function Comments({video}:{video:number}) {
  const {getToken,userId} = useAuth();
  const User = useUser();
  const {data,setdata} = useDisableControls();
  const [value,setValue] = useState("");
  const {toast}= useToast();
  async function handleSend(){
    const token = await getToken({template:"supabase"});
    const supabase = supabaseClient(token);
    setdata(prev=>({...prev,disable:false}));

    try {
      const res =await supabase.from("comments").insert({
        video,
        comment:value,
        commented_by:userId,
        profile:User.user?.imageUrl
      });
      console.log({res})
      setValue("");
    } catch (error) {
      toast({
        title:"Error commenting on this video",
        description:"There was an error commenting on this video. Please try again later"
      })
      setValue("");
      console.log(error)
    }
  }
  return (
    <div>
      <div className="flex items-center justify-between my-2">
        <h1 className="text-xl">Comments:400</h1>
        <Button onClick={()=>{
          console.log("comments clicked")
          setdata(prev=>({...prev,disabled:true}))
        }}>
          Add a comment
        </Button>
      </div>
      {data.disabled&&<div>
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