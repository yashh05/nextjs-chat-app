"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Image from "next/image";
import React from "react";

const LogoutButton = () => {
  return (
    <Button
      asChild
      onClick={() => signOut({ callbackUrl: "/api/auth/signin" })}
    >
      <span>
        <Image
          src="/icons/logout-icon.svg"
          alt="My Icon"
          width={24}
          height={24}
        />{" "}
        Logout
      </span>
    </Button>
  );
};

export default LogoutButton;
