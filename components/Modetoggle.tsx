"use client";

import { useDarkMode } from "@/lib/Mode";
import { Moon, Sun } from "lucide-react";

export default function Modetoggle() {
    const {mode,setMode}= useDarkMode();
    function toggleMode() {
        setMode(prevMode => prevMode === "dark" ? "light" : "dark");
    }
    return (
        <div onClick={toggleMode} className="flex items-center gap-5">
            {mode=="dark"?<Moon className="cursor-pointer"/>:<Sun className="cursor-pointer"/>}
        </div>
    )
}
