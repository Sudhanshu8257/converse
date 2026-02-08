import { getUserToken } from "@/actions/userAction";
import Navbar from "@/components/Navbar";
import { getAboutPageSchema } from "@/lib/seo";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "About Converse | Revolutionizing AI Conversations",
  description:
    "Meet Sudhanshu Lohana, the creator of Converse AI. Discover our mission to provide secure, intelligent, and private AI chat for everyone.",
  keywords:
    "Converse AI mission, Sudhanshu Lohana, intelligent AI chat features, secure AI assistant, private personality chat",
};
const AboutPage = async () => {
  const userToken = await getUserToken();
  const jsonLd = getAboutPageSchema();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-[1830px] mx-auto lg:py-4 lg:px-6 max-lg:p-4">
        <Navbar userToken={userToken} />
        <header className="text-center lg:mb-12">
          <h1 className="lg:text-4xl text-xl font-bold lg:mb-4">
            About Converse
          </h1>
          <p className="lg:text-xl text-lg text-gray-600">
            Transforming Conversations with Intelligent AI
          </p>
        </header>

        <section className="lg:mb-12">
          <h2 className="lg:text-3xl text-lg font-semibold mb-1 lg:mb-4">
            Our Story
          </h2>
          <p className="lg:text-lg text-gray-700">
            Converse was created with a vision to make online communication as
            effortless and intuitive as possible. In a world where digital
            interactions are becoming increasingly important, we believe in the
            power of meaningful conversations and aim to bridge the gap between
            people, no matter where they are.
          </p>
        </section>

        <section className="lg:mb-12">
          <h2 className="lg:text-3xl text-lg font-semibold mb-1 lg:mb-4">
            Features
          </h2>
          <ul className="list-disc list-inside lg:text-lg text-gray-700">
            <li>User-friendly chat interface</li>
            <li>Seamless integration across devices</li>
            <li>Real-time messaging</li>
            <li>Secure and private communication</li>
            <li>Customizable chat settings</li>
          </ul>
        </section>

        <section className="lg:mb-12">
          <h2 className="lg:text-3xl text-lg font-semibold mb-1 lg:mb-4">
            Our Mission
          </h2>
          <h3 className="lg:text-lg text-gray-700">
            Our mission is to create a platform that brings people together
            through simple and effective communication tools. We strive to
            foster a community where users can engage in meaningful dialogues
            and stay connected with ease.
          </h3>
        </section>

        <section className="lg:mb-12">
          <h2 className="lg:text-3xl text-lg font-semibold mb-1 lg:mb-4">
            About the Creator
          </h2>
          <h3 className="text-gray-600 lg:mt-4">
            {`Hi, I'm `}
            <strong>Sudhanshu Lohana</strong>, the creator of Converse. As an
            aspiring web developer and UI/UX designer from India, I am
            passionate about creating tools that enhance online communication.
            Converse is a result of my dedication to providing a seamless and
            intuitive chat experience for users everywhere.
          </h3>
        </section>

        <section>
          <h2 className="lg:text-3xl text-lg font-semibold mb-1 lg:mb-4">
            Contact Us
          </h2>
          <h3 className="lg:text-lg text-gray-700">
            {`Have questions or need support? Feel free to reach out to me at`}{" "}
            <Link
              href="mailto:lohanasudhanshu8257@gmail.com"
              className="text-blue-500"
            >
              lohanasudhanshu8257@gmail.com
            </Link>
            .{`I'm here to help!`}
          </h3>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
