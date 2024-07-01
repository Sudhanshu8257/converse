"use client";
import { Trash2Icon } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { clearConversation } from "@/actions/chatAction";
import { useRouter } from "next/navigation";
const DeleteChat = () => {
  const router = useRouter();
  const handleClick = async () => {
    const result = await clearConversation();
    console.log("result", result);
    if (result && result.message === "OK") {
      window.location.reload();
    }
  };
  return (
    <>
      <Dialog>
        <DialogTrigger className="lg:absolute lg:top-28 lg:left-8 lg:z-10 focus-visible:bg-none">
          <div className="lg:bg-black z-10 flex gap-2 font-medium  items-center justify-center cursor-pointer backdrop-blur-md  rounded-full lg:p-4">
            <Trash2Icon size={24} className="lg:text-white text-black" />
            <span className="lg:hidden">Clear Chat</span>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear this conversation? This action
              cannot be undone
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                onClick={handleClick}
                className="bg-black mx-auto text-white hover:bg-black"
                type="button"
                variant="secondary"
              >
                Clear
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteChat;
