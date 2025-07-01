"use client";

import API from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { MessageType, useMessages } from "./Messageprovider";
import Message from "./Message";

export default function MessageBubble(){
    const {id} = useParams();
    const {dispatch,state} = useMessages();
    useEffect(()=>{
        API.get(`/messages/chat/${id}/?limit=30&offset=1`).then(({data})=>{
            data.map((message:MessageType)=>{
                dispatch({type:"ADD_MESSAGE",payload:message})
            })
        })
        console.log({state});
    },[id])
    return (
        <div className="row-span-9 overflow-y-scroll">
            {state.map(message=><Message {...message}/>)}
        </div>
    )
}
