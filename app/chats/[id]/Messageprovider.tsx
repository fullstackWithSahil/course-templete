"use client";

import { createContext, Dispatch, ReactNode, useContext, useReducer } from "react";

export type MessageType = {
    _id: string;
    chat: string;
    sender: string;
    content: string;
    type: string;
    replyTo: null|string;
    createdAt:string;
    updatedAt:string;
    profile:string;
    firstname:string;
}

type ActionType = 
  | { type: "ADD_MESSAGE"; payload: MessageType }
  | { type: "DELETE_MESSAGE"; payload: { id: string } }
  | { type: "UPDATE_MESSAGE"; payload: { id: string; updates: Partial<MessageType> } }
  | { type: "CLEAR_MESSAGES" }
  | { type:"ADD_MANY_MESSAGES"; payload:MessageType[]};

type StateType = MessageType[];

export const Messages = createContext<{ 
  state: StateType; 
  dispatch: Dispatch<ActionType>;
} | null>(null);

const initialState: StateType = [];

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case "ADD_MESSAGE":
      return [...state, action.payload];

    case "DELETE_MESSAGE":
      return state.filter((msg) => msg._id !== action.payload.id);

    case "UPDATE_MESSAGE":
      return state.map((msg) =>{
        if(msg._id===action.payload.id){
          return {...msg,...action.payload.updates}
        }else{
          return msg;
        }
      }
      );

    case "ADD_MANY_MESSAGES":
      return [
        // Filter out duplicates
        ...action.payload,
        ...state,
      ];

    case "CLEAR_MESSAGES":
      return [];

    default:
      return state;
  }
}


export default function MessagesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <Messages.Provider value={{ state, dispatch }}>
      {children}
    </Messages.Provider>
  );
}

export function useMessages() {
  const context = useContext(Messages);
  if (!context) throw new Error("useMessages must be used within a MessagesProvider");
  return context;
}