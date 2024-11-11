import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const NavMenu = async () => {
  const session = await getServerSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className=" flex justify-between items-center px-[3vw] py-3 w-full text-foreground shadow bg-slate-900 p-0">
      <h1>
        Hello <span className="font-bold uppercase">{session?.user?.name}</span>
      </h1>
      <Image
        src="/icons/logout-icon.svg"
        alt="My Icon"
        width={24}
        height={24}
      />
    </div>
  );
};

export default NavMenu;
