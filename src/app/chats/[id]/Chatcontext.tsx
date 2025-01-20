"use client";

import { createContext, Dispatch, ReactNode, useContext, useReducer } from "react";

export interface MessageType {
    id: number;
    firstname: string|null;
    course:number|null;
    profile: string;
    sender: string;
    message: string;
    created_at: Date;
    reactions: {
        heart: number;
        thumbsUp: number;
        thumbsDown: number;
        smile: number;
    };
}

type ActionTypes =
    | { type: "add_message"; payload: MessageType }
    | { type: "add_many"; payload: MessageType[]}
    | { type: "delete_message"; payload: { id: number } }
    | { type: "add_reaction"; payload: { id: number; reaction: "heart" | "thumbsUp" | "thumbsDown" | "smile" } };

const Context = createContext<{ messages: MessageType[]; dispatch: Dispatch<ActionTypes> } | null>(null);

const initialState: MessageType[] = [];

function reducer(state: MessageType[], action: ActionTypes): MessageType[] {
    switch (action.type) {
        case "add_message":
            return [...state, action.payload];
        
        case "add_many":
            return [...state, ...action.payload];

        case "delete_message":
            return state.filter((message) => message.id !== action.payload.id);

        case "add_reaction":
            return state.map((message) =>
                message.id === action.payload.id
                    ? {
                          ...message,
                          reactions: {
                              ...message.reactions,
                              [action.payload.reaction]: message.reactions[action.payload.reaction] + 1,
                          },
                      }
                    : message
            );

        default:
            return state;
    }
}

export default function ChatProvider({ children }: { children: ReactNode }) {
    const [messages, dispatch] = useReducer(reducer, initialState);
    return (
        <Context.Provider value={{ messages, dispatch }}>
            {children}
        </Context.Provider>
    );
}

export function useChats() {
    const data = useContext(Context);
    if (!data) {
        throw new Error("Chat context is empty");
    }
    return data;
}