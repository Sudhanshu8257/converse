"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import logo from "@/public/assets/logo.png";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import html from "highlight.js/lib/languages/xml"; // HTML
import css from "highlight.js/lib/languages/css";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import ruby from "highlight.js/lib/languages/ruby";
import php from "highlight.js/lib/languages/php";
import typescript from "highlight.js/lib/languages/typescript";
import json from "highlight.js/lib/languages/json";
const ChatMessage = ({
  parts,
  role,
}: {
  parts: string;
  role: "user" | "model" | string;
}) => {
  hljs.configure({
    ignoreUnescapedHTML: true,
  });
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("python", python);
  hljs.registerLanguage("html", html);
  hljs.registerLanguage("css", css);
  hljs.registerLanguage("java", java);
  hljs.registerLanguage("cpp", cpp);
  hljs.registerLanguage("ruby", ruby);
  hljs.registerLanguage("php", php);
  hljs.registerLanguage("typescript", typescript);
  hljs.registerLanguage("json", json);
  function SyntaxHighlightedCode(props: any) {
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
      if (ref.current && props.className?.includes("lang-") && hljs) {
        hljs.highlightElement(ref.current);

        // hljs won't reprocess the element unless this attribute is removed
        ref.current.removeAttribute("data-highlighted");
      }
    }, [props.className, props.children]);

    return <code {...props} ref={ref} />;
  }
  return (
    <>
      {role === "model" ? (
        <>
          <div className="w-full bg-[#F0FAF9] p-3 rounded-xl flex gap-2">
            <div className="w-8 h-8 relative shrink-0 mt-3 rounded-full ">
              <Image
                fill
                src={logo}
                sizes="max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={100}
                alt="Coverse Ai"
              />
            </div>
            <div className="text-left overflow-hidden  break-words w-full md:text-lg">
              <Markdown
                options={{
                  overrides: {
                    code: SyntaxHighlightedCode,
                  },
                }}
              >
                {parts}
              </Markdown>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full p-3 rounded-xl flex gap-2">
            <div className="w-8 h-8 relative flex items-center justify-center font-medium shrink-0 rounded-full ">
              SL
            </div>
            <div className="text-left mt-1 overflow-x-auto break-words  md:text-lg">
              <Markdown
                options={{
                  overrides: {
                    code: SyntaxHighlightedCode,
                  },
                  disableParsingRawHTML: true,
                }}
              >
                {parts}
              </Markdown>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatMessage;
