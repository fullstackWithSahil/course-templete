"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import supabaseClient from "@/lib/Supabase";
import { useSession, useUser } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useVideoContext } from "./Context";
import { toast } from "sonner";


type CommentType ={
    comment: string;
    commented_by: string;
    created_at: string;
    id: number;
    likes: number;
    profile: string;
    video: number;
    liked_by: string[];
}

export default function Comments() {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<CommentType[]>([]);
    const {user} = useUser();
    const {session} = useSession();
    const {data,setdata} = useVideoContext();

    useEffect(()=>{
        const supabase = supabaseClient(session);
        supabase
            .from("comments")
            .select("*")
            .eq("video",Number(data.currentVideo.id))
            .then(({data,error})=>{
                if(error){
                    toast.error("Error fetching comments")
                }else{
                    setComments(data as CommentType[]);
                }
            });
    },[data.currentVideo.id])

    async function handleKeyDown(e:React.KeyboardEvent<HTMLInputElement>){
        if(e.key==="Enter" && comment!==""){
            const supabase = supabaseClient(session);
            const { data:comments, error } = await supabase
                .from('comments')
                .insert({
                    comment,
                    profile:user?.imageUrl,
                    video:Number(data.currentVideo.id),
                    commented_by:user?.firstName,
                    liked_by:[],
                })
                .select();
            setComments((prev)=>[...(comments as CommentType[]),...(prev)]);
            setComment("");
            if(error){
                toast.error("Error adding comment")
            }
        }
    }

  return (
    <div>
        <p className="text-2xl font-bold">{comments?comments.length:0} comments</p>
        <div className="flex items-center gap-2 m-3">
            <Avatar>
                <AvatarImage src={user?.imageUrl} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Input 
                placeholder="add a comment"
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
                onKeyDown={(e)=>handleKeyDown(e)}
                onClick={(e)=>{
                    e.stopPropagation();
                    setdata((prev)=>({...prev,disabled:true}));
                }}
            />
        </div>
        <div>
            {comments?comments.map((comment)=><CommentBlock
                key={comment.id}
                comment={comment.comment}
                commented_by={comment.commented_by}
                created_at={comment.created_at}
                id={comment.id}
                likes={comment.likes}
                profile={comment.profile}
                video={comment.video}
                liked_by={comment.liked_by}
            />):<p className="text-center">No comments yet</p>}
        </div>
    </div>    
  )
}


function CommentBlock(comment:CommentType){
    const {user} = useUser();
    const {session} = useSession();
    console.log({liked:comment.liked_by.includes(user?.id||"")})
    const [liked,setLiked] = useState(comment.liked_by.includes(user?.id||""));

    async function handleLike(){
        try {
            const supabase = supabaseClient(session);
            if(!liked){
                await supabase
                    .from("comments")
                    .update({
                        liked_by:[...comment.liked_by,(user?.id||"")],
                    })
                    .eq("id",comment.id);
            }else{
                await supabase
                    .from("comments")
                    .update({
                        liked_by:comment.liked_by.filter((id)=>id!==user?.id),
                    })
                    .eq("id",comment.id);
            }
            setLiked((prev)=>!prev);
        } catch (error) {
            toast.error("Error liking comment");
        }
    }

    return(
        <div key={comment.comment} className="flex items-center justify-between gap-2 m-3 border-2 border-black dark:border-white dark:bg-gray-800 p-2 rounded-sm">
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src={comment.profile} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>{comment.comment}</span>
            </div>
            <div className="cursor-pointer">
                <Heart
                    onClick={handleLike} 
                    className={liked?"fill-red-500 dark:fill-white":"text-red-500 dark:text-white"}
                />
            </div>
        </div>
    )
}