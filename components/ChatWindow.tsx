"use client";
import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { ArrowDown, Loader } from "lucide-react";
import { Message } from "@/lib/types";

const ChatWindow = ({ data }: { data: Message[] }) => {
  const [messages, setMessages] = useState<Message[]>(data);
  const [loading, setLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollToBottomBtn, setShowScrollToBottomBtn] =
    useState<boolean>(false);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    scrollToBottom("auto");
  }, [messages.length]);

  useEffect(() => {
    const handleScroll = () => {
      const container = chatContainerRef.current;
      if (container) {
        const isNotAtBottom =
          container.scrollTop + container.clientHeight <
          container.scrollHeight - 10;
        setShowScrollToBottomBtn(isNotAtBottom);
      }
    };

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="relative bg-white flex overflow-y-auto flex-col p-4 rounded-2xl items-center max-w-[1280px] w-full h-full">
      {showScrollToBottomBtn && (
        <div
          onClick={() => scrollToBottom()}
          className="bg-white z-10 cursor-pointer backdrop-blur-md absolute w-fit top-4 right-4 bg-opacity-65 rounded-lg p-4"
        >
          <ArrowDown className="w-4 h-4 lg:h-6 lg:w-6" />
        </div>
      )}
      <div
        ref={chatContainerRef}
        className="w-full h-full overflow-y-auto pb-2 custom-scrollbar rounded-xl mb-[72px]"
      >
        {messages?.map((message: any, i: any) => (
          <ChatMessage key={i} role={message.role} parts={message.parts} />
        ))}
        {loading && <Loader size={32} className="animate-spin mx-auto mt-4" />}
      </div>

      <div className="absolute bottom-4 w-full px-4">
        <ChatInput
          setMessages={setMessages}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
