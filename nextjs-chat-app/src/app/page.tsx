import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <div className=" min-w-full text-white text-center font-semibold uppercase">
      Select a Room and Chat!
    </div>
  );
}
