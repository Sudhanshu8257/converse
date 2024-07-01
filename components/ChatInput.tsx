"use client";

import * as React from "react";
import Textarea from "react-textarea-autosize";

import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import { SendHorizontalIcon } from "lucide-react";
import { sendMessage } from "@/actions/chatAction";
import { Message } from "@/lib/types";

export function ChatInput({
  setMessages,
  setLoading,
  loading,
}: {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}) {
  const [input, setInput] = React.useState("");

  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (window.innerWidth < 600) {
      e.target["message"]?.blur();
    }
    const value = input.trim();
    setInput("");
    if (!value) return;
    try {
      const newMessage = { role: "user", parts: value };
      setMessages((currentMessages: any) => [...currentMessages, newMessage]);
      const responseMessage = await sendMessage({ message: value });
      setMessages((currentMessages: any) => [
        ...currentMessages,
        responseMessage?.chats,
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      ref={formRef}
      className=" items-center justify-center gap-2 max-lg:min-h-[50px] bg-[#fbfbfb] px-2 border-2 rounded-xl relative flex max-h-60 max-lg:max-h-40 w-full overflow-hidden"
      onSubmit={handleSubmit}
    >
      <Textarea
        ref={inputRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        placeholder="Send a message..."
        className="min-h-[60px] max-lg:min-h-[50px] pl-2 w-full max-h-60 max-lg:max-h-40 resize-none bg-transparent max-lg:py-[1rem] py-[1.3rem] lg:text-[16px] focus-within:outline-none sm:text-sm"
        autoFocus
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        name="message"
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button disabled={loading} className="flex items-center h-[60px] mt-auto">
        <div className="bg-black rounded-md cursor-pointer p-2">
          <SendHorizontalIcon
            color="white"
            size={28}
            className="shrink-0 max-lg:w-[24px] max-lg:h-[24px]"
          />
        </div>
      </button>
    </form>
  );
}
