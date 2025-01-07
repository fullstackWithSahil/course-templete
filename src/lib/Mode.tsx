"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { cn } from "./utils";

type modetype = { 
  mode: "dark" | "light"; 
  setMode: Dispatch<SetStateAction<"dark" | "light">>; 
}|null


const ModeContext = createContext<modetype>(null);

export default function ModeProvider({
  children,
  className
}:{
  children:ReactNode,
  className:string
}) {
  const [mode,setMode] = useState<"dark"|"light">("dark");
  return (
    <ModeContext value={{mode,setMode}}>
      <body className={cn(mode,className)}>
        {children}
      </body>
    </ModeContext>
  )
}


export function useDarkMode(){
  const mode = useContext(ModeContext);
  if (!mode){
    throw new Error("Invalid mode context");
  }
  return mode
}
