import { getUserToken } from "@/actions/userAction";
import EmblaCarousel from "@/components/carousel/EmlaCarousel";
import Navbar from "@/components/Navbar";
import Wrapper from "@/components/Wrapper";
import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import Image from "next/image";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { Search } from "@/components/SearchBar";
import { getAllPersonalities } from "@/actions/chatAction";
import { Metadata } from "next";
import { CelebritiesFaqs, getCelebritiesPageSchema } from "@/lib/seo";
import Script from "next/script";
import FAQ from "@/components/Faq";

export const metadata: Metadata = {
  title: "Free Celebrity AI Chat: Talk to Bollywood Stars on Converse",
  description:
    "Experience unique conversations with AI personas. Chat with anime characters, celebrity models, and expert AI astrologers for instant, engaging interaction.",
  keywords:
    "celebrity ai chat free, talk to stars ai, bollywood ai chatbot, salman khan ai, amitabh bachchan ai chat, realistic ai personalities, converse ai characters",
};

const Celebrities = async ({
  searchParams,
}: {
  searchParams: { query?: string };
}) => {
  const userToken = await getUserToken();
  const search = searchParams.query;

  const [featuredPersonalities, personalitiesData] = await Promise.all([
    getAllPersonalities({ featured: true }),
    getAllPersonalities({ search }),
  ]);
  const jsonLd = getCelebritiesPageSchema({ personalitiesData });
  const OPTIONS: EmblaOptionsType = { loop: true };

  return (
    <>
      <Script
        id="Celebrity"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col items-center mx-auto p-0 gap-2 lg:gap-4 w-full min-h-screen pb-4">
        <Wrapper>
          <Navbar userToken={userToken} />
        </Wrapper>
        <h1 className="font-black text-center text-xl lg:text-5xl">
          Chat with your Favorite AI Personas & Personalities
        </h1>
        <div className="w-full max-w-[1830px] lg:rounded-2xl overflow-hidden">
          <EmblaCarousel
            slides={featuredPersonalities.data}
            options={OPTIONS}
          />
        </div>
        <Wrapper>
          <div className="flex items-center justify-center gap-1 w-full rounded-lg border border-black/20">
            <Search
              placeholder="Search a celebrity"
              className="w-full p-2 min-h-10 rounded-lg bg-transparent text-sm font-normal focus:outline-none"
            />
            <button className="text-black rounded-lg flex items-center justify-center w-10 h-10">
              <SearchIcon />
            </button>
          </div>
        </Wrapper>
        <Wrapper>
          <div className="grid lg:grid-cols-4 grid-cols-2 w-full gap-4">
            {personalitiesData.data.map((item: any, i: any) => (
              <Link
                href={`/personality/${item.fullName.replaceAll(" ", "-").replaceAll(".", "")}`}
                key={item?._id}
                className="w-full bg-white rounded-lg overflow-hidden"
              >
                <div className="relative w-full lg:h-48 h-32">
                  <Image
                    src={item.imgUrl}
                    alt="amit"
                    className="object-cover"
                    fill
                  />
                </div>
                <div className="flex flex-col gap-2 lg:p-2 p-0.5 items-center justify-center">
                  <h3 className="lg:text-lg text-sm font-bold capitalize">
                    {item.fullName}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </Wrapper>
        <FAQ data={CelebritiesFaqs} />
      </div>
    </>
  );
};

export default Celebrities;
