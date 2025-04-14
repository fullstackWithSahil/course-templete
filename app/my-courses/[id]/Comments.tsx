"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";

export default function Comments() {
    const url = "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ydklyUTIwUHNiUzR4aU9la0RZYWdDVjFlUUEifQ?width=160"
    const {user} = useUser();
    console.log(user?.imageUrl)
    const comments = [
        {comment:"hi there",url},
        {comment:"hi here",url},
        {comment:"hi tere",url},
        {comment:"hi thre",url},
        {comment:"hi thee",url},
        {comment:"hi ther",url},
        {comment:"hi athere",url},
        {comment:"hi tbhere",url},
        {comment:"hi thcere",url},
        {comment:"hi thedre",url},
        {comment:"hi theree",url},
        {comment:"hi theref",url},
        {comment:"hi thereg",url},
    ]
  return (
    <div>
        <p className="text-2xl font-bold">180 comments</p>
        <div className="flex items-center gap-2 m-3">
            <Avatar>
                <AvatarImage src={user?.imageUrl} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Input placeholder="add a comment"/>
        </div>
        <div>
            {comments.map((comment)=><div key={comment.comment} className="flex items-center gap-2 m-3 border-2 border-black dark:border-white dark:bg-gray-800 p-2 rounded-sm">
                <Avatar>
                    <AvatarImage src={comment.url} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>{comment.comment}</span>
            </div>)}
        </div>
    </div>    
  )
}
