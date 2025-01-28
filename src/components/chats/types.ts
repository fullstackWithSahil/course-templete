export interface MessageType {
    id: number;
    firstname: string|null;
    course:number|null;
    profile: string;
    sender: string;
    message: string;
    created_at: string;
    reactions: {
        heart: number;
        thumbsUp: number;
        thumbsDown: number;
        smile: number;
    };
}

export type ActionTypes =
    | { type: "add_message"; payload: MessageType }
    | { type: "add_many"; payload: MessageType[]}
    | { type: "delete_message"; payload: { id: number } }
    | { type: "add_reaction"; payload: { id: number; reaction: "heart" | "thumbsUp" | "thumbsDown" | "smile" } };