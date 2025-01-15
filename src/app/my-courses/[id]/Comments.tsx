"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useDisableControls } from "./Context";
import  supabaseClient from "@/lib/Supabase";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsDown, ThumbsUp } from "lucide-react";


export default function Comments() {
  const {id} = useParams();
  const {getToken,userId} = useAuth();
  const User = useUser();
  const {data,setdata} = useDisableControls();
  const [value,setValue] = useState("");
  const {toast}= useToast();
  async function handleSend(){
    const token = await getToken({template:"supabase"});
    const supabase = supabaseClient(token);
    setdata(false);
    try {
      (await supabase).from("comments").insert({
        video:Number(id),
        comment:value,
        commented_by:userId,
        profile:User.user?.imageUrl
      });
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
        <Button onClick={()=>setdata(true)}>Add a comment</Button>
      </div>
      {data&&<div>
        <Textarea 
          value={value} 
          onChange={e=>setValue(e.target.value)} 
          className="dark:border-white dark:bg-gray-700"
        />
        <div className="text-right">
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>}
      <Comment imageUrl={User.user?.imageUrl} comment="hi this is a comment" likes={230}/>
      <Comment imageUrl={User.user?.imageUrl} comment="hi this is a comment" likes={230}/>
      <Comment imageUrl={User.user?.imageUrl} comment="hi this is a comment" likes={230}/>
      <Comment imageUrl={User.user?.imageUrl} comment="hi this is a comment" likes={230}/>
      <Comment imageUrl={User.user?.imageUrl} comment="hi this is a comment" likes={230}/>
      <Comment imageUrl={User.user?.imageUrl} comment="hi this is a comment" likes={230}/>
      <Comment imageUrl={User.user?.imageUrl} comment="hi this is a comment" likes={230}/>
      <Comment imageUrl={User.user?.imageUrl} comment="hi this is a comment" likes={230}/>
    </div>
  )
}

function Comment({
  imageUrl,
  comment,
  likes
}:{
  imageUrl?:string,
  comment:string,
  likes:number
}){
  const [liked,setLiked] = useState(false);
  const [disLiked,setDisLiked] = useState(false);
  const [noOfLikes,setNoOfLikes] = useState(likes);
  function handleLiked(){
    setLiked(true);
    setDisLiked(false);
    setNoOfLikes(prev=>prev+1);
  }
  function handleDisLiked(){
    setDisLiked(true);
    setLiked(false);
    setNoOfLikes(prev=>prev-1)
  }
  return(
    <div className="flex items-center border-2 m-2 px-2 py-1 rounded-md dark:border-white">
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p>{comment}</p>
          <div className="flex items-center gap-1">
            <ThumbsUp fill={liked?"rgb(96 165 350)":""} onClick={handleLiked}/>
            {noOfLikes}
            <ThumbsDown fill={disLiked?"rgb(96 165 350)":""} onClick={handleDisLiked}/>
          </div>
        </div>
      </div>
  )
}