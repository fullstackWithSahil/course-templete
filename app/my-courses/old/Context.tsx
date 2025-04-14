// "use client";
// import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";


// export type Video = {
//     id: string;
//     title: string;
//     description: string;
//     url: string;
//     thumbnail: string;
//     createdAt:string;
// };
  
// export type Module = {
//     id: string;
//     name: string;
//     videos: Video[];
// };
  
// export type State = {
//     disabled: boolean;
//     currentVideo:Video;
// };

// const Context = createContext<{
//     data: State;
//     setdata: Dispatch<SetStateAction<State>>;
// } | null>(null);

// export default function ContextProvider({
//     children,currentVideo
// }:{
//     children:ReactNode,currentVideo:Video
// }){
//     const [data,setdata] = useState({
//         disabled:false,
//         currentVideo
//     });


//     return (
//         <Context.Provider value={{data,setdata}}>
//             {children}
//         </Context.Provider>
//     )
// }

// export function useDisableControls(){
//     const data = useContext(Context);
//     if(!data){
//         throw new Error("Context is empty");
//     }
//     return data;
// }