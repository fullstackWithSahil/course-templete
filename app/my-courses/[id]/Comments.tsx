"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import supabaseClient from "@/lib/Supabase";
import { useSession, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useVideoContext } from "./Context";
import { toast } from "sonner";
import { CommentBlock } from "./CommentBlock";

export type CommentType = {
    comment: string;
    commented_by: string;
    created_at: string;
    id: number;
    likes: number;
    profile: string;
    video: number;
    liked_by: string[];
    reply?: number | null; // null for top-level comments, comment ID for replies
}

export default function Comments() {
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<CommentType[]>([]);
    const { user } = useUser();
    const { session } = useSession();
    const { data, setdata } = useVideoContext();

    useEffect(() => {
        const supabase = supabaseClient(session);
        supabase
            .from("comments")
            .select("*")
            .eq("video", Number(data.currentVideo.id))
            .order("created_at", { ascending: false })
            .then(({ data, error }) => {
                if (error) {
                    toast.error("Error fetching comments")
                } else {
                    setComments(data as any[]);
                }
            });
    }, [data.currentVideo.id])

    async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && comment !== "") {
            const supabase = supabaseClient(session);
            const { data: newComment, error } = await supabase
                .from('comments')
                .insert({
                    comment,
                    profile: user?.imageUrl,
                    video: Number(data.currentVideo.id),
                    commented_by: user?.firstName,
                    liked_by: [],
                    reply: null, // Top-level comment
                })
                .select()
                .single();
            
            if (newComment) {
                setComments((prev) => [newComment as any, ...prev]);
            }
            setComment("");
            if (error) {
                toast.error("Error adding comment")
            }
        }
    }

    // Get top-level comments (no reply field or reply is null)
    const topLevelComments = comments.filter(comment => !comment.reply);

    // Function to get replies for a specific comment
    const getReplies = (commentId: number) => {
        return comments.filter(comment => comment.reply === commentId);
    };

    // Function to get reply count for a comment
    const getReplyCount = (commentId: number) => {
        return comments.filter(comment => comment.reply === commentId).length;
    };

    return (
        <div>
            <p className="text-2xl font-bold">{topLevelComments.length} comments</p>
            <div className="flex items-center gap-2 m-3">
                <Avatar>
                    <AvatarImage src={user?.imageUrl} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Input
                    placeholder="add a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onClick={(e) => {
                        e.stopPropagation();
                        setdata((prev) => ({ ...prev, disabled: true }));
                    }}
                />
            </div>
            <div>
                {topLevelComments.length > 0 ? 
                    topLevelComments.map((comment) => (
                        <CommentBlock
                            key={comment.id}
                            comment={comment.comment}
                            commented_by={comment.commented_by}
                            created_at={comment.created_at}
                            id={comment.id}
                            likes={comment.likes}
                            profile={comment.profile}
                            video={comment.video}
                            liked_by={comment.liked_by}
                            reply={comment.reply}
                            replies={getReplies(comment.id)}
                            replyCount={getReplyCount(comment.id)}
                            onReplyAdded={(newReply) => setComments(prev => [newReply, ...prev])}
                        />
                    )) : 
                    <p className="text-center">No comments yet</p>
                }
            </div>
        </div>
    )
}