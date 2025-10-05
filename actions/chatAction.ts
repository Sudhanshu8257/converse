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

export const getPersonalityMessageById = async ({
  personalityId,
}: {
  personalityId: string;
}) => {
  const auth_token = cookies().get("auth")?.value;
  const url =
    process.env.BACKEND_URL +
    "chat/getPersonalityMessagesById?page=1&perPage=10000" +
    `&personalityId=${personalityId}`;

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
    console.error("Error fetching personality messages:", error);
    throw error;
  }
};

export const getPersonalityById = async ({
  personalityId,
}: {
  personalityId: string;
}) => {
  const auth_token = cookies().get("auth")?.value;
  const url =
    process.env.BACKEND_URL +
    "chat/getPersonalityById" +
    `?id=${personalityId}`;

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
    console.error("Error fetching personality messages:", error);
    throw error;
  }
};

export const getPersonalityByName = async ({
  personalityName,
}: {
  personalityName: string;
}) => {
  const auth_token = cookies().get("auth")?.value;
  const url =
    process.env.BACKEND_URL +
    "chat/getPersonalityByName" +
    `?name=${personalityName}`;

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
    console.error("Error fetching personality messages:", error);
    throw error;
  }
};

export const sendMessage = async ({ message ,personalityId}: { message: string , personalityId?:string }) => {
  const auth_token = cookies().get("auth")?.value;
  const url = process.env.BACKEND_URL + "chat/new";
  const obj = {
    message,
    personalityId,
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

export const clearConversation = async ({personalityId}:{personalityId?:string}) => {
  const auth_token = cookies().get("auth")?.value;
  let url = process.env.BACKEND_URL + "chat/delete";
  if(personalityId) url+= `?personalityId=${personalityId}`
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
    revalidatePath("/chat");
    return result;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getAllPersonalities = async ({
  search,
  featured,
}: {
  search?: string;
  featured?: boolean;
}) => {
  const auth_token = cookies().get("auth")?.value;
  const baseUrl = process.env.BACKEND_URL + "chat/getAllPersonalities";

  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  if (featured !== undefined) {
    params.append("featured", String(featured));
  }

  const queryString = params.toString();
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

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
    console.error("Error fetching all personalities:", error);
    throw error;
  }
};