"use client"
import Login from "./(auth)/login/page";
import { Toaster } from "@/components/ui/sonner"

export default function Home() {
  return (
    <div>
      <Toaster />
      <Login />
    </div>
  );
}
