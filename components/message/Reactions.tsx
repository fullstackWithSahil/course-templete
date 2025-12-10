"use client";

import { SocketContext } from "@/app/communities/components/Socketprovider";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { toast } from "sonner";

export default function Reactions({reactions,messageId}:{
    reactions:{emoji:string;reactedBy:string[]}[];
    messageId:string;
}) {
	const { getToken,userId } = useAuth();
    const socket = useContext(SocketContext);
    const {chat} = useParams();
    async function handelReaction(emoji:string){
        try {
            socket?.emit("addReaction",{
                chatId:chat,
                emoji,
                user:userId,
                messageId
            })
            const token = await getToken();
            const data = await axios.post(`${process.env.NEXT_PUBLIC_CHAT_URL}/messages/reaction`,{
                messageId,
                reaction:{
                    emoji
                },
                user:userId
            },{
                headers: { 
                    Authorization: `Bearer ${token}`,
                    tenent:process.env.NEXT_PUBLIC_TEACHER! 
                },
            })
        } catch (error) {
            toast("There was an error reacting to this message");
        }
    }
    return (
        <div className="dark:bg-gray-800 p-2 flex items-center flex-wrap justify-start gap-2">
            {reactions.map((react)=><div
                key={react.emoji}
                onClick={()=>handelReaction(react.emoji)} 
                className="border-2 cursor-pointer dark:bg-gray-500 bg-gray-300 bg-opacity-50 border-black dark:border-white px-3 py-1 rounded-md"
            >
                <span>{react.reactedBy.length}</span>
                <span>{react.emoji}</span>
            </div>)}
      </div>
    )
}
