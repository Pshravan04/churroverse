"use client";

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function HeaderAuth() {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    return <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>;
  }

  return (
    <>
      {!userId ? (
        <SignInButton mode="modal">
          <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
            Login
          </Button>
        </SignInButton>
      ) : (
        <UserButton />
      )}
    </>
  );
}
