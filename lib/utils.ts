import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const NavLinks = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "Chat",
    route: "/chat",
  },
  {
    label: "About",
    route: "/about",
  },
  {
    label: "My projects",
    route: "/my-projects",
  },
];
