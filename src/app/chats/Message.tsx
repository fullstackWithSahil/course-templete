
//Message.tsx
"use client";
import { MessageType, useChats } from './Chatcontext'
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, ThumbsDown, Smile } from "lucide-react";


export default function Message(message:MessageType) {
    const {dispatch } = useChats();
    function handleReaction(
        id: number,
        reaction: "heart" | "thumbsUp" | "thumbsDown" | "smile"
      ) {
        dispatch({ type: "add_reaction", payload: { id, reaction } });
      }
    
      const reactions = [
        { type: "heart", Icon: Heart },
        { type: "thumbsUp", Icon: ThumbsUp },
        { type: "thumbsDown", Icon: ThumbsDown },
        { type: "smile", Icon: Smile },
      ] as const;
  return (
    <div key={message.id} className="mb-4">
            <div className="flex items-start space-x-2 border-2 p-2 rounded-lg">
                <Avatar className="block">
                    <AvatarImage src={message.profile} alt={message.firstname || ""} />
                </Avatar>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base">{message.firstname}</p>
                    <p className="break-words text-sm sm:text-base">{message.message}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {reactions.map(({ type, Icon }) => (
                            <Button
                                key={type}
                                variant="outline"
                                size="sm"
                                onClick={() => handleReaction(message.id, type)}
                                className="px-2 py-1"
                            >
                                <Icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                <span className="text-xs sm:text-sm">{message.reactions[type]}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
  )
}
