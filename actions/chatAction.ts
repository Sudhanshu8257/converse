"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const getChats = async () => {
  const auth_token = cookies().get("auth")?.value;
  const url = process.env.BACKEND_URL + "chat/all-chats";

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Cookie: `auth_token=${auth_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error; // Re-throw the error to be handled elsewhere
  }
};

export const sendMessage = async ({ message }: { message: string }) => {
  const auth_token = cookies().get("auth")?.value;
  const url = process.env.BACKEND_URL + "chat/new";
  const obj = {
    message,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Cookie: `auth_token=${auth_token}`,
      },
      body: JSON.stringify(obj),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const clearConversation = async () => {
  const auth_token = cookies().get("auth")?.value;
  const url = process.env.BACKEND_URL + "chat/delete";
  try {
    const response = await fetch(url, {
      method: "DELETE",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Cookie: `auth_token=${auth_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("result", result);
    revalidatePath("/chat");
    return result;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
