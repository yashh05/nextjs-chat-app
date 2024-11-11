"use client";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function CreateRoomDialog() {
  const { data: session } = useSession();
  const [chatRoomName, setChatRoomName] = useState("");

  const handleJoinRoom = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chatroom/joinroom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session?.user?.email,
            chatRoomName,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to join room:", errorData.message);
        alert(`Error: ${errorData.message}`);
        return;
      }

      window.location.reload();
      alert("You have successfully joined the room!");
    } catch (error) {
      console.error("An error occurred while joining the room:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton asChild>
          <span>
            <Plus />
            Join room
          </span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Room Name</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              placeholder="RoomName"
              onChange={(e) => setChatRoomName(e.target.value)}
              value={chatRoomName}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button onClick={() => handleJoinRoom()}>join</Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
