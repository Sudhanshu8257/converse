import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Converse: Your Intelligent AI Chatbot - Transforming Conversations with Intelligent AI",
  description:
    "Converse is your friendly AI chatbot, always ready to help. Get instant answers, personalized assistance, and engaging conversations, all powered by cutting-edge technology. Experience the future of communication, make your life easier, and get more done with Converse!",
  keywords:
    "AI Chatbot, Conversational AI, Intelligent Chatbot, AI Assistant, Converse AI, Chatbot Service, AI Powered Chat, Virtual Assistant, Automation, Customer Engagement, Customer Experience, AI Technology, Natural Language Processing, Machine Learning, Online Chat, Live Chat, 24/7 Support, Instant Answers, Personalized Experience, User-Friendly, Efficient Communication",
  icons: {
    icon: ["/favicon.ico?v=4"],
    apple: ["/apple-touch-icon.png?v=4"],
    shortcut: ["/apple-touch-icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.3.2/build/styles/lightfair.min.css"
        />
        <meta
          property="og:title"
          content="Converse - Transforming Conversations with Intelligent AI"
        />
        <meta property="og:site_name" content="Converse" />
        <meta
          property="og:url"
          content="https://converse-chatbot.netlify.app/"
        />
        <meta
          property="og:description"
          content="Converse: Transforming Conversations with Intelligent AI. Experience secure, accurate, and engaging chat with our advanced AI chatbot."
        />
        <link rel="icon" href="/public/favicon.ico" />
        <meta
          name="google-site-verification"
          content="RfgfIR2mggs0B4hLU5DI53ne6Iq0vai5C6pyqP4BvG0"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <Script src="https://unpkg.com/@highlightjs/cdn-assets@11.7.0/highlight.min.js" />
      <body className={poppins.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
