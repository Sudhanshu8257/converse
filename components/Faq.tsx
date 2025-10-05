"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

export default function FAQ({ data }: { data: FaqItem[] }) {
  return (
    <section id="faq" className="py-20 w-full bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="lg:text-4xl text-xl font-bold lg:mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid  gap-8">
          <div className="max-w-[900px] w-full mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {data.map((faq: any, index: number) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-black/20 rounded-2xl px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline font-semibold leading-none lg:text-[20px]">
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
