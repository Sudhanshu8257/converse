export const maxDuration = 1000;

import { getChats } from "@/actions/chatAction";
import { getUserToken } from "@/actions/userAction";
import ChatWindow from "@/components/ChatWindow";
import DeleteChat from "@/components/DeleteChat";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Converse: Your Intelligent AI Chatbot - Transforming Conversations with Intelligent AI",
  description:
    "Meet Converse, your friendly and intelligent AI chatbot! Get instant answers, personalized assistance, and engaging conversations, all powered by cutting-edge technology. Converse is always ready to help, making your online experience more efficient and enjoyable.",
  keywords:
    "AI Chatbot, AI Chat, Conversational AI, Intelligent Chatbot, Smart Chatbot, AI Assistant, Converse AI, Chatbot Service, AI Powered Chat, AI Customer Service, AI Support, Virtual Assistant, Automation, Customer Engagement, Customer Experience, AI Technology, Natural Language Processing, Machine Learning, Conversational Marketing, Online Chat, Live Chat, 24/7 Support, Instant Answers, Personalized Experience, User-Friendly, Efficient Communication, Converse Chatbot",
};

const page = async () => {
  const chatData = await getChats();
  const userToken = await getUserToken();
  return (
    <div className="flex flex-col items-center max-w-[1830px] mx-auto lg:py-4 lg:px-6 max-lg:p-4 gap-4 w-full h-screen">
      <Navbar userToken={userToken} />
      <div className="max-lg:hidden">
        <DeleteChat />
      </div>
      <ChatWindow data={chatData.chats} />
    </div>
  );
};

export default page;

/*
TODO
=> table markdown
=> copy read aloud tooltip 
=> delete chat
=> image sizes
*/
