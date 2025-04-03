"use client";

import { AccordionContent } from "@/components/ui/accordion";
import { useDisableControls, Video } from "./Context";


export default function AccordionVideo(video:Video&{i:number}) {
    const {setdata} = useDisableControls();
    function handleClick(){
        setdata(prev=>({
            ...prev,
            currentVideo:{
                id:video.url,
                title:video.title,
                description: "sda",
                url: video.url,
                thumbnail: video.thumbnail,
                createdAt: video.createdAt
            }
        }))
        
    }
    return (
        <AccordionContent>
            <div className="flex items-center justify-between p-5" onClick={handleClick}>
                <div>
                    <img
                        src={video.thumbnail}
                        alt="thumbnail"
                        className="w-20 aspect-video"
                    />
                </div>
                <p>lesson-{video.i}:{video.title}</p>
            </div>
            <hr />
        </AccordionContent>
    )
}
