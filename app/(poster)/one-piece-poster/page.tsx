import FAQ from "@/components/poster/Faq";
import Gallery from "@/components/poster/Gallery";
import Hero from "@/components/poster/Hero";
import { PosterFaqs, PosterFaqSchema } from "@/lib/seo";
import {
  Upload,
  Wand2,
  Download,
  Zap,
  Shield,
  Type,
  ImagePlus,
  Move,
  CreditCard,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import React from "react";

export const metadata: Metadata = {
  title: "One Piece Wanted Poster Generator | Bounty Maker - Converse",
  description:
    "Create your own custom One Piece bounty poster in seconds! Upload a photo, set your bounty, and download high-quality anime wanted posters. Try it now on Converse.",
  keywords:
    "One Piece bounty poster maker, One Piece wanted poster generator, Custom anime bounty maker, Luffy wanted poster creator, DIY One Piece poster, Anime poster editor, Make your own One Piece bounty poster online, One Piece wanted poster template with custom photo",
  openGraph: {
    title: "Make Your Own One Piece Wanted Poster | Converse",
    description:
      "Become a part of the Straw Hat crew! Generate a custom high-res bounty poster with your own photo and name.",
    images: [
      {
        url: "https://ik.imagekit.io/r8pra5q2fr/posters/poster_446b3576-6540-430a-a5d2-2fac68d8f250_pNOBMMebQ.png",
      },
    ],
  },
};

const HowItWorks = () => (
  <section
    id="how-it-works"
    className="flex flex-col items-center w-full justify-center px-4 sm:px-8 lg:px-32 bg-white border-y-8 border-black h-full py-20 lg:py-32"
  >
    <header className="flex flex-col items-center justify-center gap-4 text-center">
      <span className="bg-gray-200 border-2 border-black rounded-full px-4 py-1.5 font-bold shadow-lg text-sm uppercase">
        How it Works
      </span>
      <h2 className="text-4xl lg:text-6xl font-bold m-0 text-balance">
        Create Poster in 5 Easy Steps
      </h2>
      <p className="text-lg lg:text-xl font-medium text-gray-600 mt-4 lg:mt-6 px-4 lg:px-52 text-balance">
        Our AI-powered generator makes it incredibly simple to turn yourself
        into a legendary anime character. Just follow these steps to claim your
        bounty.
      </p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 lg:mt-24 w-full">
      {/* Step 1 */}
      <article className="rounded-lg border-2 border-black shadow-sm flex flex-col p-8 justify-center bg-gray-50">
        <div className="flex justify-center lg:justify-start">
          <ImagePlus size={56} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl m-0 font-bold mt-8">01. Upload photo</h3>
        <p className="text-lg lg:text-xl mt-4 font-medium text-gray-800">
          Pick any clear face photo. The AI works best with front-facing shots
          and good lighting.
        </p>
      </article>

      {/* Step 2 */}
      <article className="rounded-lg border-2 border-black shadow-sm flex flex-col p-8 justify-center bg-gray-50">
        <div className="flex justify-center lg:justify-start">
          <Zap size={56} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl m-0 font-bold mt-8">02. AI animefies it</h3>
        <p className="text-lg lg:text-xl mt-4 font-medium text-gray-800">
          Gemini transforms your photo into One Piece anime art. You get 3 tries
          per day.
        </p>
      </article>

      {/* Step 3 */}
      <article className="rounded-lg border-2 border-black shadow-sm flex flex-col p-8 justify-center bg-gray-50">
        <div className="flex justify-center lg:justify-start">
          <Type size={56} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl m-0 font-bold mt-8">03. Edit your name</h3>
        <p className="text-lg lg:text-xl mt-4 font-medium text-gray-800">
          Double-tap the name on the poster to edit it. Drag to reposition
          anywhere.
        </p>
      </article>

      {/* Step 4 */}
      <article className="rounded-lg border-2 border-black shadow-sm flex flex-col p-8 justify-center bg-gray-50">
        <div className="flex justify-center lg:justify-start">
          <Move size={56} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl m-0 font-bold mt-8">04. Adjust the image</h3>
        <p className="text-lg lg:text-xl mt-4 font-medium text-gray-800">
          Drag and resize your anime portrait to fit perfectly. Pinch to zoom on
          mobile.
        </p>
      </article>

      {/* Step 5 */}
      <article className="rounded-lg border-2 border-black shadow-sm flex flex-col p-8 justify-center bg-gray-50">
        <div className="flex justify-center lg:justify-start">
          <CreditCard size={56} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl m-0 font-bold mt-8">05. Pay & download</h3>
        <p className="text-lg lg:text-xl mt-4 font-medium text-gray-800">
          Happy with the result? Pay $1.99 and get the full-res poster sent to
          your email.
        </p>
      </article>
    </div>
  </section>
);

const Features = () => (
  <section
    id="features"
    className="flex flex-col items-center w-full bg-white justify-center shrink-0 px-4 sm:px-8 lg:px-32 border-b-8 border-black  py-20 lg:py-32"
  >
    <header className="flex flex-col items-center justify-center gap-4 text-center">
      <span className="bg-gray-200 border-2 border-black rounded-full px-4 py-1.5 font-bold shadow-lg text-sm uppercase">
        Key Features
      </span>
      <h2 className="text-4xl lg:text-6xl font-bold m-0 text-balance">
        Power Packed Features
      </h2>
    </header>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full items-stretch justify-between gap-4 lg:gap-16 mt-16 lg:mt-24">
      {[
        {
          icon: Wand2,
          title: "Instant Anime Style",
          desc: "State-of-the-art AI accurately maps your features to anime art.",
        },
        {
          icon: Type,
          title: "Custom Poster Text",
          desc: "Easily edit the poster to display your own unique pirate name.",
        },
        {
          icon: Download,
          title: "HD Print Quality",
          desc: "Download high-resolution files perfect for framing or posters.",
        },
        {
          icon: Zap,
          title: "Lightning Fast",
          desc: "Get your fully generated artwork in just a matter of seconds.",
        },
        {
          icon: Shield,
          title: "No Login Required",
          desc: "No login is required! start creating your One Piece wanted poster immediately.",
        },
        {
          icon: Upload,
          title: "Easy Upload",
          desc: "Works seamlessly on both mobile and desktop devices.",
        },
      ].map((feature, i) => (
        <article
          key={i}
          className="rounded-lg border-2 border-black overflow-hidden shadow-sm flex flex-row lg:flex-col bg-white h-full"
        >
          <div className="w-24 lg:w-32 lg:h-32 lg:rounded-br-2xl lg:rounded-tr-none bg-black flex items-center justify-center shrink-0 self-stretch lg:self-auto">
            <feature.icon size={32} color="white" className="lg:w-12 lg:h-12" />
          </div>
          <div className="flex justify-center gap-1 lg:gap-4 flex-col p-4 lg:p-8 grow text-left">
            <h3 className="text-lg lg:text-xl m-0 font-bold">
              {feature.title}
            </h3>
            <p className="text-sm lg:text-lg mt-1 lg:mt-2 font-medium text-gray-800">
              {feature.desc}
            </p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

const FaqSection = () => (
  <section className="flex flex-col items-center w-full justify-center shrink-0 px-4 sm:px-8 lg:px-32 border-b-8 border-black bg-[#E6E4D5] py-20 lg:py-32">
    <header className="flex flex-col items-center justify-center gap-4 text-center mb-12 lg:mb-16">
      <span className="bg-gray-200 border-2 border-black rounded-full px-4 py-1.5 font-bold shadow-lg text-sm uppercase">
        Support
      </span>
      <h2 className="text-4xl lg:text-6xl font-bold m-0 text-balance">
        Frequently Asked Questions
      </h2>
    </header>
    <div className="w-full max-w-4xl">
      <FAQ data={PosterFaqs} />
    </div>
  </section>
);

const Page = () => {
  return (
    <main className="w-full flex flex-col items-center bg-[#E6E4D5] overflow-x-hidden">
      <Hero />
      <HowItWorks />
      <Gallery />
      <Features />
      <FaqSection />
      <section className="flex flex-col items-center w-full bg-white justify-center shrink-0 px-4 sm:px-8 lg:px-32 border-b-8 border-black  py-20 lg:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Primary SEO Content Block */}
          <div className="prose prose-red max-w-none">
            <h2 className="text-3xl lg:text-4xl font-black text-black mb-6 tracking-tight">
              The Ultimate{" "}
              <span className="text-red-600">One Piece Bounty Poster</span>{" "}
              Generator
            </h2>

            <p className="text-lg leading-relaxed text-gray-700 mb-6">
              Have you ever wondered what your <strong>pirate bounty</strong>{" "}
              would be in the world of the Grand Line? At{" "}
              <Link href={"/"}><strong>Converse</strong></Link>, we’ve built the most advanced{" "}
              <strong>One Piece bounty poster maker</strong> that uses
              professional-grade AI to turn your real-life photos into authentic
              anime artwork. Whether you want to join the Straw Hat crew or
              start your own pirate fleet, our generator creates high-definition
              <strong> wanted posters</strong> that look like they were pulled
              straight from the manga.
            </p>

            <h3 className="text-2xl font-bold text-black mt-10 mb-4">
              Why Use the Converse Anime Poster Maker?
            </h3>
            <p className="text-gray-700 mb-6">
              Unlike basic templates or generic photo filters,  Converse offers a
              premium experience for true anime fans. We don&apos;t just slap a
              filter on your photo; our AI regenerates your image from scratch
              to match the specific line art, shading, and aesthetic of the
              legendary pirate series.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✓</span>
                <span>
                  <strong>No Login Required:</strong> Start creating
                  immediately. We value your privacy—no accounts or tedious
                  sign-ups.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✓</span>
                <span>
                  <strong>3 Free Regenerations:</strong> Not happy with the
                  first look? You can regenerate your anime photo up to 3 times
                  every 24 hours.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✓</span>
                <span>
                  <strong>Pay Only for Perfection:</strong> You can create,
                  edit, and preview your poster for free. Only pay to download
                  the high-resolution, watermark-free version.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">✓</span>
                <span>
                  <strong>HD Quality for Printing:</strong> Our posters are
                  generated in high-definition, making them perfect for custom
                  anime wall art or social media profiles.
                </span>
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-black mt-10 mb-4">
              How to Make Your Own One Piece Wanted Poster
            </h3>
            <p className="text-gray-700 leading-relaxed italic">
              Simply upload a front-facing photo, wait a few seconds for the AI
              to work its magic, and enter your custom name. Our system ensures
              your name fits perfectly in the iconic typography of the
              <strong> One Piece wanted poster template</strong>. Once finished,
              you’ll have a professional pirate bounty ready for the world to
              see.
            </p>
          </div>
        </div>
      </section>
      <Script
        id="FaqSchema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(PosterFaqSchema),
        }}
      />
    </main>
  );
};

export default Page;
