"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import supabaseClient from "@/lib/Supabase";
import { useSession, useUser } from "@clerk/nextjs";
import { Heart, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { use, useState } from "react";
import { useVideoContext } from "./Context";
import { toast } from "sonner";
import { CommentType } from "./Comments";

interface CommentBlockProps extends CommentType {
    replies?: CommentType[];
    replyCount?: number;
    onReplyAdded?: (reply: CommentType) => void;
}

export function CommentBlock(props: CommentBlockProps) {
    const { setdata } = useVideoContext();
    const { 
        comment, 
        commented_by, 
        created_at, 
        id, 
        likes, 
        profile, 
        video, 
        liked_by, 
        reply,
        replies = [],
        replyCount = 0,
        onReplyAdded 
    } = props;
    
    const { user } = useUser();
    const { session } = useSession();
    const included = liked_by.includes(user?.id || "");
    const [liked, setLiked] = useState(included);
    const [noOfLikes, setNoOfLikes] = useState(liked_by.length);
    const [showReplies, setShowReplies] = useState(false);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");

    async function handleLike() {
        try {
            const supabase = supabaseClient(session);
            if (!liked) {
                await supabase
                    .from("comments")
                    .update({
                        liked_by: [...liked_by, (user?.id || "")],
                    })
                    .eq("id", id);
                setNoOfLikes((prev) => prev + 1);
            } else {
                await supabase
                .from("comments")
                .update({
                    liked_by: liked_by.filter((userId) => userId !== user?.id),
                })
                .eq("id", id);
                setNoOfLikes((prev) => prev - 1);
            }
            setLiked((prev) => !prev);
        } catch (error) {
            toast.error("Error liking comment");
        }
    }

    async function handleReplySubmit(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && replyText.trim() !== "") {
            try {
                const supabase = supabaseClient(session);
                const { data: newReply, error } = await supabase
                    .from('comments')
                    .insert({
                        comment: replyText,
                        profile: user?.imageUrl,
                        video: video,
                        commented_by: user?.firstName,
                        liked_by: [],
                        reply: id, // This reply belongs to the current comment
                    })
                    .select()
                    .single();

                if (newReply && onReplyAdded) {
                    onReplyAdded(newReply as CommentType);
                    setReplyText("");
                    setShowReplyInput(false);
                    setShowReplies(true); // Show replies when a new one is added
                }
                
                if (error) {
                    toast.error("Error adding reply");
                }
            } catch (error) {
                toast.error("Error adding reply");
            }
        }
    }

    return (
        <div className="mb-4">
            {/* Main Comment */}
            <div className="flex items-center justify-between gap-2 m-3 border-2 border-black dark:border-white dark:bg-gray-800 p-2 rounded-sm">
                <div className="flex items-center gap-2 flex-1">
                    <Avatar>
                        <AvatarImage src={profile} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{commented_by}</span>
                            <span className="text-xs text-gray-500">
                                {new Date(created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <span>{comment}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Reply button and count */}
                    <div className="flex items-center gap-1">
                        <MessageCircle
                            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-blue-500"
                            onClick={() => setShowReplyInput(!showReplyInput)}
                        />
                        {replyCount > 0 && (
                            <span className="text-sm text-gray-500">{replyCount}</span>
                        )}
                    </div>
                    
                    {/* Like button */}
                    <div className="cursor-pointer flex items-center gap-2">
                        <p>{noOfLikes}</p>
                        <Heart
                            onClick={handleLike}
                            className={liked ? "fill-red-500 dark:fill-white w-4 h-4" : "text-red-500 dark:text-white w-4 h-4"}
                        />
                    </div>
                </div>
            </div>

            {/* Reply Input */}
            {showReplyInput && (
                <div className="flex items-center gap-2 ml-8 mb-2">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={user?.imageUrl} alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Input
                        placeholder={`Reply to ${commented_by}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={handleReplySubmit}
                        className="text-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            setdata((prev) => ({ ...prev, disabled: true }));
                        }}
                    />
                </div>
            )}

            {/* Show/Hide Replies Toggle */}
            {replyCount > 0 && (
                <div className="ml-8 mb-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReplies(!showReplies)}
                        className="text-blue-500 hover:text-blue-700 p-0 h-auto font-normal"
                    >
                        {showReplies ? (
                            <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                Hide {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                Show {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                            </>
                        )}
                    </Button>
                </div>
            )}

            {/* Replies */}
            {showReplies && replies.length > 0 && (
                <div className="ml-8 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
                    {replies.map((reply) => (
                        <div key={reply.id} className="flex items-center justify-between gap-2 mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-sm">
                            <div className="flex items-center gap-2 flex-1">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={reply.profile} alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-sm">{reply.commented_by}</span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(reply.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span className="text-sm">{reply.comment}</span>
                                </div>
                            </div>
                            <div className="cursor-pointer flex items-center gap-2">
                                <p className="text-sm">{reply.liked_by.length}</p>
                                <Heart
                                    onClick={() => {}}
                                    className="w-4 h-4 text-red-500 dark:text-white"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}