"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

type ModeType = {
  mode: "dark" | "light";
  setMode: Dispatch<SetStateAction<"dark" | "light">>;
};

const ModeContext = createContext<ModeType | null>(null);

export default function ModeProvider({
  children,
  className
}: {
  children: ReactNode,
  className: string
}) {
  const [mode, setMode] = useState<"dark" | "light">("dark");
  
  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      <body className={mode + " " + className}>
        {children}
      </body>
    </ModeContext.Provider>
  );
}

export function useDarkMode() {
  const mode = useContext(ModeContext);
  if (!mode) {
    throw new Error("Invalid mode context");
  }
  return mode;
}