import { getUserToken } from "@/actions/userAction";
import Navbar from "@/components/Navbar";
import { Project } from "@/lib/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Sudhanshu Lohana's Projects: A Showcase of Web Development Skills",
  description:
    "Explore the latest projects by Converse's creator. Discover innovative developments and advancements beyond the AI chatbot.",
  keywords:
    "AI Chatbot, Conversational AI, Intelligent Chatbot, sudhanshu lohana Projects, Web Development Projects, React Projects, Next.js Projects, React Developer, Next.js Developer, Full-Stack Developer, Portfolio Projects, UI/UX Design",
};

const MyProjects = async () => {
  const userToken = await getUserToken();

  const projects: Project[] = [
    {
      deployedLink: "https://stack-flow-mu.vercel.app/",
      imageUrl: "/assets/project-images/stackFlow.png",
      name: "Stack Flow - Stack Overflow Clone",
      description:
        "A Stack Overflow clone built with Next.js, Clerk, Shadcn, and MongoDB. Features user authentication, question posting, voting, and search.",
    },
    {
      deployedLink: "https://pokedex2-0-six.vercel.app/",
      imageUrl: "/assets/project-images/pokedex.png",
      name: "Full Stack Pokedex App",
      description:
        "A Pokedex app built with React, React Router DOM, and Firebase. Features detailed Pokemon information, search functionality, and user authentication.",
    },
    {
      deployedLink: "https://portfolio-black-two-36.vercel.app/",
      imageUrl: "/assets/project-images/portfolio.png",
      name: "Portfolio",
      description:
        "A modern portfolio showcasing my skills and projects as a web developer. Built with Next.js, it highlights my expertise in building engaging web experiences.",
    },
  ];
  return (
    <div className="max-w-[1830px] mx-auto lg:py-4 lg:px-6 max-lg:p-4">
      <Navbar userToken={userToken} />
      <header className="text-center lg:mb-12">
        <h1 className="lg:text-4xl text-xl font-bold lg:mb-4">My Projects</h1>
        <p className="lg:text-xl text-lg text-gray-600">
          A showcase of my work and recent projects
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-28">
        {projects.map((project, i) => (
          <Link
            href={project.deployedLink}
            key={i}
            className="bg-white rounded-lg overflow-hidden shadow-md"
          >
            <div className="bg-gray-700 w-full h-52 relative">
              <Image src={project.imageUrl} fill alt={project.name} />
            </div>
            <div className="px-6 pb-4">
              <h2 className="text-lg lg:text-2xl font-semibold lg:mb-2">
                {project.name}
              </h2>
              <p className="lg:text-lg text-gray-700 lg:mb-4">
                {project.description}
              </p>
              <Link
                href={project.deployedLink}
                className="inline-block bg-black text-white px-4 py-2 rounded-lg"
              >
                View {project.name}
              </Link>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default MyProjects;
