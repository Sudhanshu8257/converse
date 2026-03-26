"use client";
import { useState } from "react"; // Added for loading state
import { startPosterSession } from "@/actions/posterAction";
import Navbar from "./Navbar";
import { Noto_Sans } from "next/font/google";
import { toast } from "sonner"; // Import sonner

const noto_sans = Noto_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const Hero = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartSession = async () => {
    setIsLoading(true);
    // Optional: Show a loading toast that we can dismiss later
    const toastId = toast.loading("Preparing your bounty session...");

    try {
      await startPosterSession();
      toast.success("Session started! Ready for your selfie?", { id: toastId });
    } catch (error) {
      console.error("Poster Session Error:", error);
      toast.error("Failed to start session. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center mx-auto lg:pt-4 pt-4 pb-16 lg:pb-24 px-4 lg:px-6 lg:gap-24 gap-12 w-full min-h-screen lg:h-screen">
      <Navbar />
      <div className="flex flex-col lg:flex-row items-center w-full justify-between px-2 sm:px-8 lg:px-32 gap-12 lg:gap-0 mt-8 lg:mt-0">
        <header className="flex flex-col justify-center gap-6 text-center lg:text-left">
          <h1
            className={`text-black text-4xl sm:text-4xl lg:text-8xl font-black m-0 leading-[1.1] ${noto_sans.className}`}
          >
            Create Your Own
            <br className="block" />
            <span className="max-lg:text-4xl text-red-600">Wanted Poster</span>
          </h1>
          <h2 className="text-lg lg:text-xl font-medium text-gray-800 max-w-2xl">
            Upload your selfie and let our AI instantly animefy it into a
            high-definition pirate wanted poster. Customize your name and bounty
            with no design skills required.
          </h2>
          <div className="flex justify-center lg:justify-start">
            <button
              onClick={handleStartSession}
              disabled={isLoading}
              className={`rounded-full px-8 py-4 text-lg bg-white border-black border-2 w-fit font-bold transition-all flex items-center gap-2
                ${isLoading ? "opacity-70 cursor-not-allowed bg-gray-50" : "hover:bg-gray-100 cursor-pointer active:scale-95"}`}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Starting...
                </>
              ) : (
                "Create Poster"
              )}
            </button>
          </div>
        </header>
        <figure className="w-full max-w-[320px] sm:max-w-[400px] aspect-[2/3] rounded-md bg-red-600 border-4 border-black shadow-lg"></figure>
      </div>
    </section>
  );
};

export default Hero;