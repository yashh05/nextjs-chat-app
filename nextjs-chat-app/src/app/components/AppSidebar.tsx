import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import LogoutButton from "./LogoutButton";
import { CreateRoomDialog } from "./createRoomDialog";
import Link from "next/link";

export async function AppSidebar() {
  const session = await getServerSession();
  console.log(session);

  let rooms: { id: string; name: string }[] = [];

  const handleFetchRooms = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chatroom/allChatrooms?email=${session?.user.email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();

    rooms = data.data;
  };

  await handleFetchRooms();

  return (
    <Sidebar>
      <SidebarContent className=" bg-stone-600 text-white">
        <SidebarGroup>
          <SidebarGroupLabel className=" text-white text-xl mb-5 font-semibold">
            Hello, {session?.user?.name}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {rooms &&
                rooms.length > 0 &&
                rooms.map((item) => (
                  <SidebarMenuItem key={item.id + "chatroom"}>
                    <SidebarMenuButton asChild>
                      <Link href={`/chat?chatroomId=${item.id}`}>
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className=" cursor-pointer bg-slate-600 text-white">
        <CreateRoomDialog />
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
}
