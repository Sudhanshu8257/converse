"use server";

import { LoginUser, RegisterUser } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const registerUser = async ({
  fullName,
  email,
  password,
}: RegisterUser) => {
  const url = process.env.BACKEND_URL + "user/signup";
  const obj = {
    name: fullName,
    email,
    password,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    const result = await response.json();
    if (result.message === "OK") {
      result.token;
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      cookies().set("auth", result.token, { expires: expires });
    }
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const loginUser = async ({ email, password }: LoginUser) => {
  const url = process.env.BACKEND_URL + "user/login";
  const obj = {
    email,
    password,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    const result = await response.json();
    if (result.message === "OK") {
      result.token;
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      cookies().set("auth", result.token, { expires: expires });
    }
    return result;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const logoutUser = () => {
  cookies().set("auth", "");
  cookies().delete("auth");
  revalidatePath("/");
  redirect("/");
};

export const getUserToken = () => {
  const auth = cookies().get("auth");
  return auth?.value;
};
