"use client";

import { Dispatch, ReactNode, createContext, useContext, useReducer } from "react";

// All the types for the context
export type MessageType = {
  id: string;
  message: string | null;
  sender: string | null;
  to: string | null;
  firstname: string | null;
  profile: string | null;
  course: number | null;
  group: boolean;
  created_at: string;
}

type ActionType = 
  | { type: "ADD_MESSAGE"; payload: MessageType }
  | { type: "DELETE_MESSAGE"; payload: { id: string } }
  | { type: "UPDATE_MESSAGE"; payload: { id: string; updates: Partial<MessageType> } }
  | { type: "CLEAR_MESSAGES" };

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
      return state.filter(message => message.id !== action.payload.id);
    
    case "UPDATE_MESSAGE":
      return state.map(message => 
        message.id === action.payload.id 
          ? { ...message, ...action.payload.updates }
          : message
      );

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

// Helper functions to make using the context easier
export function useMessageActions() {
  const { dispatch } = useMessages();
  
  const addMessage = (message: MessageType) => {
    dispatch({ type: "ADD_MESSAGE", payload: message });
  };
  
  const deleteMessage = (id: string) => {
    dispatch({ type: "DELETE_MESSAGE", payload: { id } });
  };
  
  const updateMessage = (id: string, updates: Partial<MessageType>) => {
    dispatch({ type: "UPDATE_MESSAGE", payload: { id, updates } });
  };

  const clearMessages = () => {
    dispatch({ type: "CLEAR_MESSAGES" });
  };
  
  return {
    addMessage,
    deleteMessage,
    updateMessage,
    clearMessages
  };
}