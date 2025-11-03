import Image from "next/image";
import Link from "next/link";
import React from "react";
import salman from "@/public/celebs/salman.jpeg";
import Navbar from "@/components/Navbar";
import { getUserToken } from "@/actions/userAction";
import FAQ from "@/components/Faq";
import Testimonials from "@/components/Testimonials";
import Wrapper from "@/components/Wrapper";
import { redirect } from "next/navigation";
import { getPersonalityById, getPersonalityByName } from "@/actions/chatAction";
import { Personality } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: { personalityName: string };
}) {
  const { personalityName } = params;
  const personalityData = await getPersonalityByName({ personalityName });
  const personality: Personality = personalityData?.data;

  return {
    title: personality?.metaTitle,
    description: personality?.metaDescription,
    keywords: personality?.metaKeywords,
    openGraph: {
      title: `${personality.fullName} AI`,
      description: personality?.metaDescription,
      url: `https://converse-chatbot.netlify.app/personality/${personalityName}`,
      siteName: "GuruCool",
      images: [
        {
          url: personality?.imgUrl,
          width: 1200,
          height: 630,
          alt: `${personalityName} converse ai`,
        },
      ],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${personality?.imgUrl}`,
      description: personality?.metaDescription,
      images: [personality?.imgUrl],
    },
  };
}

const personality = async ({
  params,
}: {
  params: { personalityName: string };
}) => {
  const { personalityName } = params;
  if (!personalityName) redirect("/");

  const [personalityData, userToken] = await Promise.all([
    getPersonalityByName({ personalityName }),
    getUserToken(),
  ]);

  const personality: Personality = personalityData?.data;

  if (!personality) redirect("/");

  return (
    <div className="flex flex-col items-center mx-auto p-0 gap-2 lg:gap-4 w-full min-h-screen">
      <Wrapper>
        <Navbar userToken={userToken} />
      </Wrapper>
      <Wrapper classname="max-lg:pt-0">
        <div className="w-full flex lg:mt-12 max-lg:flex-col gap-4 lg:gap-6 justify-center max-lg:items-center">
          <div className="relative w-1/2 h-[450px] max-lg:w-full rounded-3xl overflow-hidden">
            <Image
              src={personality.imgUrl}
              quality={100}
              alt="converse"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col w-full items-start h-fit gap-3 lg:gap-2 justify-center">
            <h1 className="font-black text-2xl lg:text-6xl capitalize">
              {personality.fullName} AI
            </h1>
            <span className="font-medium lg:text-lg ">
              {personality.heroDescription}
            </span>
            <Link
              href={`/chat/personality/${personality._id}`}
              className="bg-black text-white font-bold lg:mt-4 px-4 lg:text-lg rounded-lg lg:px-8"
            >
              <h2>Chat</h2>
            </Link>
          </div>
        </div>
      </Wrapper>
      <div className="flex mt-12 items-center justify-center bg-white w-full gap-6 pb-6">
        <Wrapper classname="flex flex-col justify-center gap-4 ">
          <>
            <h2 className="lg:text-4xl text-xl font-bold lg:mb-4">Features</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 w-full gap-12">
              {personality?.features?.map((feature, i) => (
                <div
                  key={i}
                  className={`h-[240px] flex justify-between rounded-2xl [box-shadow:0_0_15px_rgba(0,0,0,0.15)] flex-col p-8 [background-image:radial-gradient(rgba(0,0,0,0.06)_2px,transparent_0)] [background-size:30px_30px] [background-position:-5px_-5px] ${
                    feature.colspan === 2 ? "col-span-2" : "col-span-1"
                  } max-lg:col-span-2`}
                >
                  <div className="flex gap-2">
                    <Image
                      src={feature.icon}
                      width={34}
                      height={34}
                      alt="icon"
                      className="mt-2 max-lg:w-[24px] max-lg:h-[24px]"
                    />
                  </div>
                  <div className="flex h-fit flex-col ">
                    <p className="font-bold leading-none text-[16px] lg:text-[20px]">
                      {feature.title}
                    </p>
                    <p className="font-medium m-0">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        </Wrapper>
      </div>
      <Testimonials data={personality.testimonials} />
      <FAQ data={personality?.faq} />
    </div>
  );
};

export default personality;

// TODO
// PHASE - 1 (3 days) (2 oct)
// all personality page
//  - hero
//  - featured personalities
//  - all personlity
//  - seo text

// personality page
//  - hero
//  - about
//  - testimonials
//  - seo text
//  - faq
//  - seo schema codes

// personality chat page
// - image
// - personality id

// change the reactions [laugh] to emoji reactions 😂

// PHASE - 2 (3 days) (7 oct)
// otp verification
// rate limiting
// credit system with logging
// Improve prompt

// PHASE - 3 (2 days)
// admin panel
// - all users
// - chat page (list all the chat happened)
// - token usage
// - most conversed personality
// - add personality
// Improve prompt

// PHASE - 4 (2 days)
// notification system firebase or text
// analytics
// Improve prompt

// PHASE - 5  (3 days)
// payments

// PHASE 6
//
