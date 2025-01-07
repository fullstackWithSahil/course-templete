import image from "@/app/assets/logo.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

export default function Content() {
  const list = Array(10).fill(0);

  return (
    <section className="w-full md:w-1/4 md:absolute top-0 right-0">
      <Accordion type="single" collapsible>
        {list.map((item, i) => (
          <AccordionItem value={`item-${i}`} key={i}>
            <AccordionTrigger className="text-xl font-bold mx-2">
              {`Module-${i}`}
            </AccordionTrigger>
            {list.map((iteam, i) => (
              <AccordionContent key={i}>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <Image
                      src={image}
                      alt="thumbnail"
                      className="w-20 aspect-video"
                    />
                  </div>
                  <p>lesson-{i}: basics of HTML</p>
                </div>
                <hr />
              </AccordionContent>
            ))}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
