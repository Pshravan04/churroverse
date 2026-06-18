"use client";

import { SignUp, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userId) {
      router.push("/dashboard");
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded || userId) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-orange-500/50 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md relative overflow-hidden rounded-3xl p-4">
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-500/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2 text-center text-white">Create Commander Profile</h1>
          <p className="text-gray-500 text-sm text-center mb-6">
            Join the Churroverse fleet and claim your first mission.
          </p>
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-black/50 border border-white/10 backdrop-blur-md shadow-none",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton: "border-white/10 text-white hover:bg-white/10",
                socialButtonsBlockButtonText: "text-white",
                dividerLine: "bg-white/10",
                dividerText: "text-gray-500",
                formFieldLabel: "text-gray-300",
                formFieldInput: "bg-black/50 border-white/10 text-white focus:border-orange-500",
                formButtonPrimary: "bg-orange-600 hover:bg-orange-500 text-white",
                footerActionText: "text-gray-400",
                footerActionLink: "text-orange-500 hover:text-orange-400",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
