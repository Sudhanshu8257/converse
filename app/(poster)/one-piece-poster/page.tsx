import FAQ from "@/components/poster/Faq";
import Hero from "@/components/poster/Hero";
import Navbar from "@/components/poster/Navbar";
import { Upload, Wand2, Download, Zap, Shield, Type } from "lucide-react";
import { Noto_Sans } from "next/font/google";
import React from "react";

const noto_sans = Noto_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const faq = [
  {
    question: "How realistic is the AI anime transformation?",
    answer:
      "Our AI is perfectly tuned to map your facial features and seamlessly blend them into an authentic, high-quality anime art style, creating a truly unique pirate wanted poster.",
    _id: "68ef03c0c3c87d688084d4fc",
  },
  {
    question: "Can I customize the name on the bounty poster?",
    answer:
      "Yes! Once our AI animefies your selfie, you can easily edit the text to include your own custom pirate alias or real name before downloading.",
    _id: "68ef03c0c3c87d688084d4fd",
  },
  {
    question: "Are the generated posters good enough for printing?",
    answer:
      "Absolutely. We generate all wanted posters in high-definition (HD), ensuring they look crisp and professional whether you share them online or print them as wall art.",
    _id: "68ef03c0c3c87d688084d4fe",
  },
  {
    question: "How long does it take to create my poster?",
    answer:
      "It takes just seconds. Upload your image, let the AI process it almost instantly, type your custom name, and your poster is ready to download.",
    _id: "68ef03c0c3c87d688084d4ff",
  },
  {
    question: "Is my uploaded selfie kept private?",
    answer:
      "Your privacy is our priority. Your photos are securely processed to generate the artwork and are automatically deleted from our servers right after.",
    _id: "68ef03c0c3c87d688084d500",
  },
];



const HowItWorks = () => (
  <section className="flex flex-col items-center w-full justify-center px-4 sm:px-8 lg:px-32 bg-white border-y-8 border-black h-full py-20 lg:py-32">
    <header className="flex flex-col items-center justify-center gap-4 text-center">
      <span className="bg-gray-200 border-2 border-black rounded-full px-4 py-1.5 font-bold shadow-lg text-sm uppercase">
        How it Works
      </span>
      <h2 className="text-4xl lg:text-6xl font-bold m-0 text-balance">
        Create Poster in 3 Easy Steps
      </h2>
      <p className="text-lg lg:text-xl font-medium text-gray-600 mt-4 lg:mt-6 px-4 lg:px-52 text-balance">
        Our AI-powered generator makes it incredibly simple to turn yourself
        into a legendary anime character. Just follow these steps to claim
        your bounty.
      </p>
    </header>
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 mt-16 lg:mt-24 w-full">
      <article className="rounded-lg border-2 border-black shadow-sm flex flex-col p-8 justify-center w-full lg:w-1/3 text-center lg:text-left bg-gray-50">
        <div className="flex justify-center lg:justify-start">
          <Upload size={56} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl m-0 font-bold mt-8">1. Upload Selfie</h3>
        <p className="text-lg lg:text-xl mt-4 font-medium text-gray-800">
          Upload a clear photo of yourself. Good lighting helps the AI
          capture your best features.
        </p>
      </article>

      <article className="rounded-lg border-2 border-black shadow-sm flex flex-col p-8 justify-center w-full lg:w-1/3 text-center lg:text-left bg-gray-50">
        <div className="flex justify-center lg:justify-start">
          <Wand2 size={56} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl m-0 font-bold mt-8">
          2. AI Animefy & Edit
        </h3>
        <p className="text-lg lg:text-xl mt-4 font-medium text-gray-800">
          Watch as our system transforms you into anime art. Customize the
          text with your name.
        </p>
      </article>

      <article className="rounded-lg border-2 border-black shadow-sm flex flex-col p-8 justify-center w-full lg:w-1/3 text-center lg:text-left bg-gray-50">
        <div className="flex justify-center lg:justify-start">
          <Download size={56} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl m-0 font-bold mt-8">3. Download Poster</h3>
        <p className="text-lg lg:text-xl mt-4 font-medium text-gray-800">
          Instantly save your high-resolution pirate wanted poster to share
          or print.
        </p>
      </article>
    </div>
  </section>
);

const Features = () => (
  <section className="flex flex-col items-center w-full justify-center shrink-0 px-4 sm:px-8 lg:px-32 border-black bg-[#E6E4D5] py-20 lg:py-32">
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
          title: "100% Secure",
          desc: "Photos are deleted immediately after your poster is created.",
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
            <feature.icon
              size={32}
              color="white"
              className="lg:w-12 lg:h-12"
            />
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

const GalleryCard = () => {
  return (
    <figure className="w-60 h-72 lg:w-64 lg:h-80 mx-3 lg:mx-6 bg-red-300 relative rounded-md overflow-hidden border-2 border-black shrink-0 bg-[url('https://placehold.co/400x600/e2e8f0/1e293b?text=Output+Poster')] bg-cover bg-center">
      <div className="w-28 h-36 lg:w-32 lg:h-40 bg-green-300 absolute rounded-tr-md bottom-0 left-0 border-t-2 border-r-2 border-black bg-[url('https://placehold.co/200x300/cbd5e1/475569?text=Selfie')] bg-cover bg-center"></div>
    </figure>
  );
};

const Gallery = () => (
  <section className="flex flex-col items-center w-full justify-center bg-white border-y-8 border-black shrink-0 py-20 lg:py-32 overflow-hidden">
    <header className="flex flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="bg-gray-200 border-2 border-black rounded-full px-4 py-1.5 font-bold shadow-lg text-sm uppercase">
        Our Works
      </span>
      <h2 className="text-4xl lg:text-6xl font-bold m-0">Gallery</h2>
      <p className="text-lg font-medium text-gray-600 mt-2 text-balance">
        See how ordinary selfies transform into legendary bounties.
      </p>
    </header>

    <div className="w-full h-fit overflow-hidden mt-16 lg:mt-24">
      <div className="flex w-fit h-fit animate-marquee hover:[animation-play-state:paused]">
        <div className="flex shrink-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
            <GalleryCard key={`batch1-${i}`} />
          ))}
        </div>
        <div className="flex shrink-0" aria-hidden="true">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
            <GalleryCard key={`batch2-${i}`} />
          ))}
        </div>
      </div>
    </div>

    <div className="w-full overflow-hidden mt-8 lg:mt-12">
      <div className="flex w-fit animate-marquee_reverse hover:[animation-play-state:paused]">
        <div className="flex shrink-0">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
            <GalleryCard key={`batch3-${i}`} />
          ))}
        </div>
        <div className="flex shrink-0" aria-hidden="true">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
            <GalleryCard key={`batch4-${i}`} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

const FaqSection = () => (
  <section className="flex flex-col items-center w-full justify-center shrink-0 px-4 sm:px-8 lg:px-32 border-black bg-[#E6E4D5] py-20 lg:py-32">
    <header className="flex flex-col items-center justify-center gap-4 text-center mb-12 lg:mb-16">
      <span className="bg-gray-200 border-2 border-black rounded-full px-4 py-1.5 font-bold shadow-lg text-sm uppercase">
        Support
      </span>
      <h2 className="text-4xl lg:text-6xl font-bold m-0 text-balance">
        Frequently Asked Questions
      </h2>
    </header>
    <div className="w-full max-w-4xl">
      <FAQ data={faq} />
    </div>
  </section>
);

const Page = () => {
  return (
    <main className="w-full flex flex-col items-center bg-[#E6E4D5] overflow-x-hidden">
      <Hero />
      <HowItWorks />
      <Features />
      <Gallery />
      <FaqSection />
    </main>
  );
};

export default Page;