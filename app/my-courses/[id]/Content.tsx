import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Module } from "./Context";
import AccordionVideo from "./AccordionVideo";

export default async function Content({modules}:{modules:Module[]}) {
  return (
    <section className="w-full md:w-1/4 md:absolute top-0 right-0">
      <Accordion type="single" collapsible>
        {modules.map((item, i) => (
          <AccordionItem value={`item-${i}`} key={i}>
            <AccordionTrigger className="text-xl font-bold mx-2">
              {item.name}
            </AccordionTrigger>
            {item.videos.map((video, i) =><AccordionVideo 
              key={i}
              i={i}
              id={video.id}
              description={video.description}
              thumbnail={video.thumbnail} 
              url={video.url} 
              title={video.title}
              createdAt={video.createdAt}              
            />)}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
