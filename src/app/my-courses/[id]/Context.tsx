"use client";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";

const Context = createContext<{
    data: {
        disableControls: boolean;
        id: number;
    };
    setdata: Dispatch<SetStateAction<{
        disableControls: boolean;
        id: number;
    }>>;
} | null>(null);

export default function ContextProvider({children}:{children:ReactNode}){
    const [data,setdata] = useState({
        disableControls: false,
        id:0,
    });

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