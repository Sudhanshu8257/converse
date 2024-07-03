import Image from "next/image";
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
        <Image
          alt="bg"
          quality={100}
          sizes="max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          fill
          src={"/assets/authBg.jpg"}
        />
      </div>
    </div>
  );
}
