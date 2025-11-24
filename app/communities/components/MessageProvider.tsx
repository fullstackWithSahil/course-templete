"use client";

import { createContext, ReactNode, useReducer, Dispatch, useContext } from "react";
import { MessageType } from "@/components/message/Message";

type ActionType = 
    | { type: "ADD_MESSAGE"; payload: MessageType }
    | { type: "ADD_INITIAL_MESSAGE"; payload: MessageType[] }
    | { type: "PREPEND_MESSAGES"; payload: MessageType[] }
    | { type: "DELETE_MESSAGE"; payload: string }
    | { type: "EDIT_MESSAGE"; payload:MessageType}
    | { type: "SELECT_MESSAGE"; payload: MessageType | null }
    | { type: "HANDLE_REACTION"; payload:{emoji:string;user:string;messageId:string} }
    | { type: "UN_SELECT_MESSAGE"}
    | { type: "CLEAR_MESSAGE"};

const MessagesContext = createContext<{ 
    state: StateType; 
    dispatch: Dispatch<ActionType>; 
} | null>(null);

type StateType = {
    selectedMessage: MessageType | null;
    messages: MessageType[];
};

const initialState: StateType = {
    selectedMessage: null,
    messages: []
};

function reducer(state: StateType, action: ActionType): StateType {
    switch (action.type) {
        case "ADD_INITIAL_MESSAGE":
            return {
                ...state,
                messages:action.payload
            }
        case "ADD_MESSAGE":
            return {
                ...state,
                messages: [...state.messages, action.payload]
            };
        case "PREPEND_MESSAGES":
            return {
                ...state,
                messages:[...action.payload,...state.messages]
            }
        case "DELETE_MESSAGE":
            return {
                ...state,
                messages: state.messages.filter(msg => msg.id !== action.payload)
            };
        case "EDIT_MESSAGE":
            return {
                ...state,
                messages: state.messages.map((msg) => 
                    msg.id === action.payload.id 
                        ? { ...msg, content: action.payload.content, edited: true } 
                        : msg
                )
            };
        case "SELECT_MESSAGE":
            return {
                ...state,
                selectedMessage: action.payload
            };
        case "UN_SELECT_MESSAGE":
            return {
                ...state,
                selectedMessage:null,
            };

        case "CLEAR_MESSAGE":
            return {
                ...state,
                messages:[]
            }
        case "HANDLE_REACTION":
            return {
                ...state,
                messages: state.messages.map((message) => {
                    if (message.id !== action.payload.messageId) return message;
                    
                    // Handle case where reactions might be undefined/null
                    const currentReactions = message.reactions || [];
                    let emojiExists = false;
                    const newReaction = [];
                    
                    currentReactions.forEach((react) => {
                        if (react.emoji === action.payload.emoji) {
                            emojiExists = true;
                            if (react.reactedBy.includes(action.payload.user)) {
                                // Remove the reaction
                                const removedUsers = react.reactedBy.filter((u) => u !== action.payload.user);
                                // Only add back if there are still users left
                                if (removedUsers.length > 0) {
                                    newReaction.push({
                                        emoji: react.emoji,
                                        reactedBy: removedUsers
                                    });
                                }
                            } else {
                                // Add the reaction
                                newReaction.push({
                                    emoji: react.emoji,
                                    reactedBy: [...react.reactedBy, action.payload.user]
                                });
                            }
                        } else {
                            newReaction.push(react);
                        }
                    });

                    // If emoji doesn't exist, add it to newReaction array
                    if (!emojiExists) {
                        newReaction.push({
                            emoji: action.payload.emoji,
                            reactedBy: [action.payload.user]
                        });
                    }
                    
                    // Return the message with updated reactions
                    return {
                        ...message,
                        reactions: newReaction
                    };
                })
            };
        default:
            return state;
    }
}

export default function MessageContextProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    return (
        <MessagesContext.Provider value={{ state, dispatch }}>
            {children}
        </MessagesContext.Provider>
    );
}

export function useMessages(){
    const data = useContext(MessagesContext);
    if(!data){
        throw new Error("Context is empty");
    }
    return data;
}