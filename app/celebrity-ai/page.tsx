import { getUserToken } from "@/actions/userAction";
import Navbar from "@/components/Navbar";
import { celebs } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const userToken = await getUserToken();
  return (
    <div className="flex flex-col items-center max-w-[1830px] mx-auto lg:py-4 lg:px-6 max-lg:p-4 gap-4 w-full h-screen">
      <Navbar userToken={userToken} />
      <h1 className="font-black text-2xl lg:text-6xl">Chat With Celebrity</h1>
      <div className="flex flex-wrap gap-6">
        {celebs.map((celeb, i) => (
          <Link
            key={i}
            href={`/celeb/${celeb.name.replaceAll(" ","-").toLowerCase()}`}
            className="flex flex-col items-center justify-center group px-4 py-3 bg-white rounded-2xl w-40 relative"
          >
            <div className="w-24 h-24 overflow-hidden rounded-full border-2 border-white relative">
              <Image
                src={celeb.img}
                alt=""
                fill
                className="object-cover group-hover:scale-125 transition-all"
              />
            </div>
            <h2 className="text-center">{celeb.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
