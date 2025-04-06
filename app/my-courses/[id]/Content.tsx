"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Module } from "./Context";

export default function Content({ blocks }: { blocks: Module[] }) {
  return (
    <div className="w-full md:w-1/3">
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
                <div className="flex items-center gap-2 mb-3" key={video.id}>
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
