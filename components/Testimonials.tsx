import { QuoteIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

const Testimonials = ({
  data,
}: {
  data: {
    message: string;
    author: string;
    role: string;
    avatar: string;
  }[];
}) => {
  const batch1 = data?.slice(0,10)

  const batch2 = data?.slice(10)

  return (
    <div className="flex flex-col items-center justify-center gap-12 py-12 w-full">
      <div className="text-center">
        <h2 className="lg:text-4xl text-xl font-bold lg:mb-4">
          Words of praise from others
        </h2>
        <h2 className="lg:text-4xl text-xl font-bold lg:mb-4 leading-tight my-0">
          about our presence
        </h2>
      </div>

      <div className="w-full overflow-hidden">
        <div className="flex w-fit animate-marquee">
          <div className="flex shrink-0">
            {batch1.map((testimonial, i) => (
              <TestimonialCard key={`batch1-${i}`} {...testimonial} />
            ))}
          </div>
          <div className="flex shrink-0" aria-hidden="true">
            {batch1.map((testimonial, i) => (
              <TestimonialCard key={`batch2-${i}`} {...testimonial} />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <div className="flex w-fit animate-marquee_reverse">
          <div className="flex shrink-0">
            {batch2.map((testimonial, i) => (
              <TestimonialCard key={`batch3-${i}`} {...testimonial} />
            ))}
          </div>
          <div className="flex shrink-0" aria-hidden="true">
            {batch2.map((testimonial, i) => (
              <TestimonialCard key={`batch4-${i}`} {...testimonial} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Helper component for clarity
};
const TestimonialCard = ({
  message,
  avatar,
  author,
  role,
}: {
  message: string;
  avatar: string;
  author: string;
  role: string;
}) => (
  <div className="rounded-2xl shrink-0 flex flex-col gap-2 bg-white p-6 max-w-[520px] w-[320px] lg:w-[520px] mx-3">
    <QuoteIcon className="rotate-180" />
    <h3 className="text-sm lg:text-lg font-medium">{message}</h3>
    <div className="flex items-center gap-2 w-fit mt-2 lg:mt-4">
      <div className="w-12 h-12 rounded-full relative overflow-hidden max-lg:hidden">
        <Image src={avatar} alt={author} fill sizes="48px" />
      </div>
      <div className="w-8 h-8 rounded-full relative overflow-hidden lg:hidden">
        <Image src={avatar} alt={author} fill sizes="16px" />
      </div>
      <div className="flex flex-col gap-0">
        <p className="font-semibold max-lg:text-sm m-0">{author}</p>
        <p className="text-sm opacity-70 m-0 max-lg:text-xs">{role}</p>
      </div>
    </div>
  </div>
);

export default Testimonials;
