import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SignToken = (email: string) => {
  const token = jwt.sign({ id: email }, process.env.NEXTAUTH_SECRET as string, {
    expiresIn: "1d",
  });
  return token;
};
