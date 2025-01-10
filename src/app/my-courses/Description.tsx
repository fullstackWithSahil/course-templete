"use client";
import { useState } from "react";

export default function Description() {
    const [more,setMore] = useState(false);
  return (
    <div className={more?"p-2 bg-gray-300 dark:bg-gray-900 mx-1 rounded-md":"p-2 rounded-md mx-1 bg-gray-300 flex items-center justify-center dark:bg-gray-900"}>
      <p className={more?"":"truncate"}>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda
        distinctio consequatur rerum iste id dignissimos dolore alias itaque
        quidem modi, eaque culpa iusto nihil, placeat eveniet, fugit adipisci
        accusantium recusandae veritatis autem odio. Itaque animi, corporis,
        perferendis quae minima totam maxime maiores harum modi repellat vel.
        Amet, nulla minima?
      </p>
      <p 
        className={more?"hidden":"text-blue-400 cursor-pointer"}
        onClick={()=>setMore(true)}
      >
        more
       </p>
      <p 
        className={more?"text-blue-400 cursor-pointer":"hidden"}
        onClick={()=>setMore(false)}
      >
        show less
       </p>
    </div>
  );
}
