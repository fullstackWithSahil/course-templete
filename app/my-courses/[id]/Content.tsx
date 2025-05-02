"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Module, useVideoContext } from "./Context";

export default function Content({ blocks }: { blocks: Module[] }) {
  const {setdata}=useVideoContext();
  return (
    <div className="w-full lg:w-1/3">
      <Accordion type="single" collapsible>
        {blocks.map((block, i) => (
          <AccordionItem key={block.id} value={`item-${i}`}>
            <AccordionTrigger>
              <h3 className="text-2xl font-bold text-center capitalize">
                {block.name}
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              {block.videos.map((video, i) => (
                <div 
                  key={video.id}
                  className="flex items-center gap-2 mb-3"
                  onClick={()=>{setdata((prev)=>({...prev,currentVideo:video}))}} 
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-1/4"
                  />
                  <h3 className="text-xl font-medium">
                    Lesson-{i}: {video.title}
                  </h3>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
