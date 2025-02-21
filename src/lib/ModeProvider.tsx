"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { cn } from "./utils";

type modetype = { 
    theme: "dark" | "light"; 
    setTheme: Dispatch<SetStateAction<"dark" | "light">>; 
}|null


const ModeContext = createContext<modetype>(null);

export default function ModeProvider({
  children,
  className
}:{
  children:ReactNode,
  className:string
}) {
  const [theme,setTheme] = useState<"dark"|"light">("dark");
  return (
    <ModeContext value={{theme,setTheme}}>
      <body className={cn(theme,className)}>
        {children}
      </body>
    </ModeContext>
  )
}


export function useTheme(){
  const mode = useContext(ModeContext);
  if (!mode){
    throw new Error("Invalid mode context");
  }
  return mode
}