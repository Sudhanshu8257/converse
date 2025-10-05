import Image from "next/image";

import CC from "@/public/assets/converse3.png";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { getUserToken } from "@/actions/userAction";

export default async function Home() {
  const userToken = await getUserToken();
  return (
    <div className="flex flex-col items-center max-w-[1830px] mx-auto lg:py-4 lg:px-6 max-lg:p-4 gap-4 w-full min-h-screen">
      <Navbar userToken={userToken} />
      <div className="w-full flex max-lg:flex-col-reverse items-center gap-3 h-[90vh] justify-center">
        <div className="flex flex-col w-full items-start  gap-4 justify-center">
          <h1 className="font-black text-2xl lg:text-6xl">
            Revolutionize Your Conversations with Converse AI
          </h1>
          <span className="font-medium lg:text-lg lg:mt-4">
            Enjoy intelligent, personalized, and seamless chats. Start chatting
            smarter today.
          </span>
          <Link
            href={"/login"}
            className="bg-black text-white font-bold lg:mt-4 px-4 lg:text-lg rounded-lg lg:px-8"
          >
            <h2>Get Started</h2>
          </Link>
        </div>
        <Image
          src={CC}
          quality={100}
          alt="converse"
          width={1150}
          className="w-[750px] max-lg:w-[400px]"
        />
      </div>
      <div className="w-full flex items-center gap-3 max-lg:flex-col h-screen justify-center">
        <div className="flex items-center justify-center relative lg:min-w-[750px]">
          <div className="rounded-xl h-[280px] lg:h-[450px] w-[200px] lg:w-[380px] z-[0] absolute top-12 right-[6rem] lg:right-[22rem]  shadow-xl overflow-hidden">
            <div className="w-full h-full relative">
              <Image
                src="/celebs/amit.webp"
                fill
                alt="amit"
                className="object-cover"
              />
            </div>
          </div>
          <div className="rounded-xl h-[280px] lg:h-[450px] w-[200px] lg:w-[380px] z-[10] shadow-xl overflow-hidden">
            <div className="w-full h-full relative">
              <Image
                src="/celebs/Salman.webp"
                fill
                alt="salman"
                className="object-cover rounded-xl"
              />
            </div>
          </div>
          <div className="rounded-xl h-[280px] lg:h-[450px] w-[200px] lg:w-[380px] z-[0]  absolute top-12 left-[6rem] lg:left-[22rem] shadow-xl overflow-hidden">
            <div className="w-full h-full relative">
              <Image
                src="/celebs/Tom.webp"
                fill
                alt="Tom"
                className="object-cover"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full items-start max-lg:mt-16 gap-4 justify-center">
          <h2 className="font-black text-2xl lg:text-6xl">
            Talk to Your Favorite Stars Like They’re Really There
          </h2>
          <span className="font-medium lg:text-lg lg:mt-4">
            Feel their voice, style, and personality — recreated with unmatched
            realism.
          </span>
          <Link
            href={"/celebrities"}
            className="bg-black text-white font-bold lg:mt-4 px-4 lg:text-lg rounded-lg lg:px-8"
          >
            <h2>Get Started</h2>
          </Link>
        </div>
      </div>
    </div>
  );
}
