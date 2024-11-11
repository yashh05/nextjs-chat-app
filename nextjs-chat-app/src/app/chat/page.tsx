import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ChatRoom from "../components/ChatRoom";

const Page = async () => {
  const session = await getServerSession();

  if (!session?.user?.email || !session?.user?.name) {
    redirect("/api/auth/signin");
  }

  return (
    <ChatRoom user={{ id: session.user.email, name: session.user.name }} />
  );
};

export default Page;
