"use client";

import { ActionTypes, MessageType } from "@/components/chats/types";
import { createContext, Dispatch, ReactNode, useContext, useReducer } from "react";

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