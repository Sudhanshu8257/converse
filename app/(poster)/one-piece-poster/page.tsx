import FAQ from "@/components/Faq";
import Navbar from "@/components/poster/Navbar";
import { Upload } from "lucide-react";
import { Noto_Sans } from "next/font/google";
import React from "react";

const noto_sans = Noto_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const faq = [
  {
    question: 'How realistic is the Sydney Sweeney AI?',
    answer: 'It’s designed to sound, think, and express emotions like Sydney Sweeney herself — blending her calm confidence, kindness, humor, and real-world experiences.',
    _id: '68ef03c0c3c87d688084d4fc'
  },
  {
    question: 'Is this the real Sydney Sweeney?',
    answer: 'No, this is a digital recreation inspired by Sydney Sweeney’s public persona and interviews — built for immersive and fun fan conversations.',
    _id: '68ef03c0c3c87d688084d4fd'
  },
  {
    question: 'What can I talk to Sydney Sweeney AI about?',
    answer: 'You can talk about acting, Hollywood, personal growth, self-confidence, fitness, mindfulness, and even lighthearted banter about films and life.',
    _id: '68ef03c0c3c87d688084d4fe'
  },
  {
    question: 'Why does the AI feel so natural?',
    answer: 'Because it’s trained on Sydney’s speaking patterns, warmth, humor, and communication style — making her replies emotionally intelligent and humanlike.',
    _id: '68ef03c0c3c87d688084d4ff'
  },
  {
    question: 'Is my chat with Sydney Sweeney AI private?',
    answer: 'Absolutely. All your chats are private, secure, and designed purely for entertainment and fan engagement.',
    _id: '68ef03c0c3c87d688084d500'
  }
]

const page = () => {
  return (
    <div className={` w-full flex flex-col items-center h-screen bg-[#E6E4D5]`}>
      <div className="flex flex-col items-center mx-auto lg:pt-4 lg:pb-24 lg:px-6 max-lg:p-4 lg:gap-24 gap-4 w-full h-full">
        <Navbar />
        <div className="flex items-center w-full justify-between px-32">
          <div className="flex flex-col justify-center gap-4">
            <h1
              className={`text-black text-8xl font-black m-0 leading-none ${noto_sans.className}`}
            >
              Create Your Own
              <br />
              <span>Wanted Poster</span>
            </h1>
            <h2 className="text-xl">
              Instantly generate high-definition pirate wanted posters with
              <br />
              custom bounties and professional styles. No design skills
              <br />
              required.
            </h2>
            <button className="rounded-full px-6 py-3 text-lg bg-white border-black border-2 w-fit font-bold ">
              Create Poster
            </button>
          </div>
          <div className="w-[400px] h-[600px] rounded-md bg-red-300"></div>
        </div>
      </div>

      {/* SECTIOM 2 */}
      <div className="flex flex-col items-center w-full justify-center px-32 bg-white border-y-8 border-black h-full py-32">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="bg-gray-200 border-2 rounded-full px-3 py-1 shadow-lg">
            How it Works
          </div>
          <h2 className="text-6xl font-bold m-0">
            Create Poster in 3 Easy Steps
          </h2>
          <p className="text-xl font-medium text-gray-600 mt-6 px-52 text-center">{`It's up to you if you want to use these modern features in your projects — if the browsers you're targeting don't support them, simply don't use those utilities and variants.`}</p>
        </div>
        <div className="flex items-center justify-between gap-16 mt-24">
          <div className="rounded-lg border-2 border-black shadow-sm flex flex-col p-8 justify-center">
            <Upload size={64} />
            <p className="text-2xl m-0 font-bold mt-12">1. Upload</p>
            <p className="text-xl mt-4 font-medium text-gray-800">
              Just upload your selfie and see the magic
            </p>
          </div>

          <div className="rounded-lg border-2 border-black shadow-sm flex flex-col p-8 justify-center">
            <Upload size={64} />
            <p className="text-2xl m-0 font-bold mt-12">1. Upload</p>
            <p className="text-xl mt-4 font-medium text-gray-800">
              Just upload your selfie and see the magic
            </p>
          </div>

          <div className="rounded-lg border-2 border-black shadow-sm flex flex-col p-8 justify-center">
            <Upload size={64} />
            <p className="text-2xl m-0 font-bold mt-12">1. Upload</p>
            <p className="text-xl mt-4 font-medium text-gray-800">
              Just upload your selfie and see the magic
            </p>
          </div>
        </div>
      </div>

      {/* SECTIOM 3 */}
      <div className="flex flex-col items-center w-full justify-center shrink-0 px-32 border-black bg-[#E6E4D5]  py-32">
        <div className="flex flex-col items-center justify-center gap-4 ">
          <div className="bg-gray-200 border-2 rounded-full px-3 py-1 shadow-lg">
            Key Features
          </div>
          <h2 className="text-6xl font-bold m-0">Power Packed Features</h2>
        </div>
        <div className="grid grid-cols-3 items-center justify-between gap-16 mt-24">
          <div className="rounded-lg border-2  border-black overflow-hidden shadow-sm flex flex-col justify-center">
            <div className="w-32 h-32 rounded-br-2xl bg-black flex items-center justify-center">
              <Upload size={48} color="white" />
            </div>
            <div className="flex  justify-center gap-4 flex-col p-4">
              <p className="text-xl m-0 font-bold mt-4">Upload</p>
              <p className="text-lg mt-4 font-medium text-gray-800">
                Just upload your selfie and see the magic
              </p>
            </div>
          </div>

          <div className="rounded-lg border-2  border-black overflow-hidden shadow-sm flex flex-col justify-center">
            <div className="w-32 h-32 rounded-br-2xl bg-black flex items-center justify-center">
              <Upload size={48} color="white" />
            </div>
            <div className="flex  justify-center gap-4 flex-col p-4">
              <p className="text-xl m-0 font-bold mt-4">Upload</p>
              <p className="text-lg mt-4 font-medium text-gray-800">
                Just upload your selfie and see the magic
              </p>
            </div>
          </div>
          <div className="rounded-lg border-2  border-black overflow-hidden shadow-sm flex flex-col justify-center">
            <div className="w-32 h-32 rounded-br-2xl bg-black flex items-center justify-center">
              <Upload size={48} color="white" />
            </div>
            <div className="flex  justify-center gap-4 flex-col p-4">
              <p className="text-xl m-0 font-bold mt-4">Upload</p>
              <p className="text-lg mt-4 font-medium text-gray-800">
                Just upload your selfie and see the magic
              </p>
            </div>
          </div>
          <div className="rounded-lg border-2  border-black overflow-hidden shadow-sm flex flex-col justify-center">
            <div className="w-32 h-32 rounded-br-2xl bg-black flex items-center justify-center">
              <Upload size={48} color="white" />
            </div>
            <div className="flex  justify-center gap-4 flex-col p-4">
              <p className="text-xl m-0 font-bold mt-4">Upload</p>
              <p className="text-lg mt-4 font-medium text-gray-800">
                Just upload your selfie and see the magic
              </p>
            </div>
          </div>
          <div className="rounded-lg border-2  border-black overflow-hidden shadow-sm flex flex-col justify-center">
            <div className="w-32 h-32 rounded-br-2xl bg-black flex items-center justify-center">
              <Upload size={48} color="white" />
            </div>
            <div className="flex  justify-center gap-4 flex-col p-4">
              <p className="text-xl m-0 font-bold mt-4">Upload</p>
              <p className="text-lg mt-4 font-medium text-gray-800">
                Just upload your selfie and see the magic
              </p>
            </div>
          </div>
          <div className="rounded-lg border-2  border-black overflow-hidden shadow-sm flex flex-col justify-center">
            <div className="w-32 h-32 rounded-br-2xl bg-black flex items-center justify-center">
              <Upload size={48} color="white" />
            </div>
            <div className="flex  justify-center gap-4 flex-col p-4">
              <p className="text-xl m-0 font-bold mt-4">Upload</p>
              <p className="text-lg mt-4 font-medium text-gray-800">
                Just upload your selfie and see the magic
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTIOM 4 */}
      <div className="flex flex-col items-center w-full justify-center  bg-white border-y-8 border-black shrink-0 py-32">
        <div className="flex flex-col items-center justify-center gap-4 px-32">
          <div className="bg-gray-200 border-2 rounded-full px-3 py-1 shadow-lg">
            Our Works
          </div>
          <h2 className="text-6xl font-bold m-0">Gallery</h2>
        </div>

        <div className="w-full h-fit overflow-hidden mt-24">
          <div className="flex w-fit h-fit animate-marquee">
            <div className="flex shrink-0">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((testimonial, i) => (
                <GalleryCard key={`batch1-${i}`} />
              ))}
            </div>
            <div className="flex shrink-0" aria-hidden="true">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((testimonial, i) => (
                <GalleryCard key={`batch1-${i}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden mt-12">
          <div className="flex w-fit animate-marquee_reverse">
            <div className="flex shrink-0">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((testimonial, i) => (
                <GalleryCard key={`batch1-${i}`} />
              ))}
            </div>
            <div className="flex shrink-0" aria-hidden="true">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((testimonial, i) => (
                <GalleryCard key={`batch1-${i}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTIOM 5 */}
      <div className="flex flex-col items-center w-full justify-center shrink-0 px-32 border-black bg-[#E6E4D5]  py-32">
        <div className="flex flex-col items-center justify-center gap-4 ">
          <div className="bg-gray-200 border-2 rounded-full px-3 py-1 shadow-lg">
            Key Features
          </div>
          <h2 className="text-6xl font-bold m-0">
            Frequently Asked Questions
          </h2>
        </div>
         <FAQ data={faq} />
      </div>
    </div>
  );
};

const GalleryCard = () => {
  return (
    <div className="w-64 h-80 mx-6 bg-red-300 relative rounded-md overflow-hidden border-2 border-black">
      <div className="w-32 h-40 bg-green-300 absolute rounded-md bottom-0 left-0"></div>
    </div>
  );
};

export default page;
