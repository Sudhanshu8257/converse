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
    label: "Celebrity Chat",
    route: "/celebrities",
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

export const celebs = [
  { name: "Salman Khan", img: "/celebs/salman.jpeg" },
  { name: "Amitabh Bachchan", img: "/celebs/amit.webp" },
  // { name: "Shah Rukh Khan", img: "https://example.com/srk.jpg" },
  // { name: "Aamir Khan", img: "https://example.com/aamir.jpg" },
  // { name: "Akshay Kumar", img: "https://example.com/akshay.jpg" },
  // { name: "Hrithik Roshan", img: "https://example.com/hrithik.jpg" },
  // { name: "Ranbir Kapoor", img: "https://example.com/ranbir.jpg" },
  // { name: "Deepika Padukone", img: "https://example.com/deepika.jpg" },
  // { name: "Priyanka Chopra", img: "https://example.com/priyanka.jpg" },
  // { name: "Alia Bhatt", img: "https://example.com/alia.jpg" },
  // { name: "Katrina Kaif", img: "https://example.com/katrina.jpg" },
  // { name: "Kareena Kapoor", img: "https://example.com/kareena.jpg" },
  // { name: "Leonardo DiCaprio", img: "https://example.com/leo.jpg" },
  // { name: "Brad Pitt", img: "https://example.com/brad.jpg" },
  // { name: "Tom Cruise", img: "https://example.com/tom.jpg" },
  // { name: "Robert Downey Jr.", img: "https://example.com/rdj.jpg" },
  // { name: "Johnny Depp", img: "https://example.com/johnny.jpg" },
  // { name: "Scarlett Johansson", img: "https://example.com/scarlett.jpg" },
  // { name: "Angelina Jolie", img: "https://example.com/angelina.jpg" },
  // { name: "Dwayne Johnson", img: "https://example.com/dwayne.jpg" }
];
