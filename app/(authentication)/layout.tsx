import Image from "next/image";
import authBg from "@/public/assets/authBg.jpg";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-screen">
      <div className="h-full w-full md:w-[50%] lg:py-8 px-6 lg:px-24">
        {children}
      </div>
      <div className="min-h-full md:w-[50%] max-md:hidden relative">
        <Image alt="bg" quality={100} fill src={"/assets/authBg.jpg"} />
      </div>
    </div>
  );
}
