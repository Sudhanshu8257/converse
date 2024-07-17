import Image from "next/image";

import CC from "@/public/assets/converse3.png";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { getUserToken } from "@/actions/userAction";

export default async function Home() {
  const userToken = await getUserToken();
  return (
    <div className="flex flex-col items-center max-w-[1830px] mx-auto lg:py-4 lg:px-6 max-lg:p-4 gap-4 w-full h-screen">
      <Navbar userToken={userToken} />
      <div className="w-full flex max-lg:flex-col-reverse items-center gap-3 h-full justify-center">
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
    </div>
  );
}
