"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import logo from "@/public/assets/logo.png";
import { LogOutIcon, Menu } from "lucide-react";
import { NavLinks } from "@/lib/utils";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logoutUser } from "@/actions/userAction";
import DeleteChat from "./DeleteChat";

const Navbar = ({ userToken }: { userToken?: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleClick = async () => {
    userToken ? await logoutUser() : router.push("/login");
  };

  return (
    <div className="w-full flex max-lg:px-2 max-lg:bg-white max-lg:rounded-full items-center justify-between">
      <Link href={"/"} className="basis-48 flex items-center justify-start">
        <div className="w-[32px] h-[32px] relative">
          <Image fill src={logo} quality={100} sizes="max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Coverse Ai" />
        </div>
        <h3 className="font-bold text-base lg:text-xl">Converse</h3>
      </Link>
      <div className="bg-white max-lg:hidden shrink-0 overflow-hidden font-medium rounded-full w-fit flex items-center justify-center gap-4 p-0">
        {NavLinks.map((link, i) => (
          <Link
            href={link.route}
            key={i}
            className={`text-[16px] py-3 flex items-center justify-center rounded-full px-8 ${
              pathname === link.route ? "bg-black text-white" : "text-slate-800"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="basis-48 flex max-lg:hidden  justify-end">
        <div
          onClick={handleClick}
          className="flex items-center font-medium cursor-pointer justify-center gap-2 bg-white rounded-full px-8 py-3"
        >
          {userToken ? (
            <>
              <LogOutIcon color="black" />
              Logout
            </>
          ) : (
            "Get Started"
          )}
        </div>
      </div>
      <div className="mr-2 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Menu size={24} />
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col items-center gap-3 justify-start w-full h-full">
              {NavLinks.map((link, i) => (
                <SheetClose key={i} asChild>
                  <Link
                    href={link.route}
                    className={`text-[16px] text-slate-800 w-full py-3 flex items-center justify-start rounded-full  ${
                      pathname === link.route && "font-semibold"
                    }`}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
              {userToken && <>
                <div className="w-full mt-auto">
                  <DeleteChat />
                </div>
                <SheetClose asChild>
                  <button
                    onClick={handleClick}
                    className="flex mt-2 items-center font-medium w-full cursor-pointer justify-start gap-2 rounded-full  py-3"
                  >
                    <LogOutIcon color="black" />
                    Logout
                  </button>
                </SheetClose>
              </>}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Navbar;
