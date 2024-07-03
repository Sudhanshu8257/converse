"use client";
import Image from "next/image";
import React from "react";

import logo from "@/public/assets/logo.png";
import { Input } from "./ui/input";
import { LockKeyhole, Mail, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { loginUser, registerUser } from "@/actions/userAction";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

const AuthForm = ({ useAs }: { useAs: "login" | "register" }) => {
  const router = useRouter();
  const handleSubmit = async (formdata: FormData) => {
    const fullName = `${formdata.get("fullName")}`;
    const email = `${formdata.get("email")}`;
    const password = `${formdata.get("password")}`;
    const data =
      useAs === "register"
        ? await registerUser({ fullName, email, password })
        : await loginUser({ email, password });
    data.message === "OK" ? router.push("/chat") : toast.error(data.message);
    data.errors && toast.error(data.errors[0].msg);
  };
  return (
    <div className="w-full h-full flex flex-col gap-3 items-start justify-center">
      <Link href={"/"} className="flex gap-1 items-center justify-center">
        <div className="w-[32px] h-[32px] relative">
          <Image fill src={logo} quality={100} alt="Coverse Ai" />
        </div>
        <h3 className="font-bold text-base lg:text-xl">Converse</h3>
      </Link>
      <span className="font-bold text-2xl">
        {useAs === "login" ? "Login to your account" : "Create Your Account"}
      </span>
      <span className="mt-1">
        Transforming Conversations with Intelligent AI
      </span>
      <form
        action={handleSubmit}
        className="w-full h-fit flex flex-col mt-4 items-center justify-center gap-3"
      >
        {useAs === "register" && (
          <div className="w-full flex bg-white h-16 rounded-md px-3 py-2 items-center gap-2 justify-center">
            <UserCircle2 />
            <Input
              name="fullName"
              required
              className="bg-transparent border-0 text-base lg:text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
              type="text"
              placeholder="Full Name"
            />
          </div>
        )}
        <div className="w-full flex bg-white h-16 rounded-md px-3 py-2 items-center gap-2 justify-center">
          <Mail />
          <Input
            name="email"
            required
            className="bg-transparent border-0 text-base lg:text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
            type="email"
            placeholder="Email"
          />
        </div>
        <div className="w-full flex bg-white h-16 rounded-md px-3 py-2 items-center gap-2 justify-center">
          <LockKeyhole />
          <Input
            name="password"
            required
            className="bg-transparent border-0 text-base lg:text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
            type="password"
            placeholder="Password"
          />
        </div>
        <span className="mt-8 max-lg:text-sm">
          {useAs === "login"
            ? `Don't have an account? `
            : `Already have an account? `}
          <Link
            href={useAs === "login" ? "/register" : "/login"}
            className="font-bold"
          >
            {useAs === "login" ? `Create an account` : `Login here`}
          </Link>
        </span>
        <SubmitButton useAs={useAs} />
      </form>
    </div>
  );
};

const SubmitButton = ({ useAs }: { useAs: "login" | "register" }) => {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="w-full bg-black text-lg lg:text-xl font-bold text-white rounded-md mt-4 py-4"
    >
      {useAs === "login" ? `Log In` : `Register`}
    </button>
  );
};

export default AuthForm;
