"use client";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

const Context = createContext<{
    data:boolean;
    setdata: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export default function ContextProvider({children}:{children:ReactNode}){
    const [data,setdata] = useState(false);

    return (
        <Context.Provider value={{data,setdata}}>
            {children}
        </Context.Provider>
    )
}

export function useDisableControls(){
    const data = useContext(Context);
    if(!data){
        throw new Error("Context is empty");
    }
    return data;
}