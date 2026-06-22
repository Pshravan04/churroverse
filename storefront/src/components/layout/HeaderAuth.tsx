"use client";

import { SignInButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserRound, Rocket } from "lucide-react";

export function HeaderAuth() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();

  const isAdmin =
    user?.publicMetadata?.role === "admin" ||
    user?.emailAddresses?.some(
      (e) => e.emailAddress === "admin@churroverse.com" || e.emailAddress === "shravanphutanr@gmail.com"
    );

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
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              label="Profile"
              labelIcon={<UserRound className="w-4 h-4" />}
              href="/profile"
            />
            {isAdmin && (
              <UserButton.Link
                label="Admin Panel"
                labelIcon={<Rocket className="w-4 h-4" />}
                href="/admin"
              />
            )}
          </UserButton.MenuItems>
        </UserButton>
      )}
    </>
  );
}
