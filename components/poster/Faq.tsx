"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
  _id?: string;
}

export default function FAQ({ data }: { data: FaqItem[] }) {
  return (
    <section id="faq" className="w-full" aria-labelledby="faq-title">
      <div className="container mx-auto">
        <div className="grid gap-8">
          <div className="max-w-[900px] w-full mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {data.map((faq, index) => (
                <AccordionItem
                  key={faq?._id || index}
                  value={`item-${index}`}
                  className="border border-black/20 rounded-2xl px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline font-semibold lg:leading-none lg:text-[20px]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 font-medium text-sm lg:text-[16px] leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
