"use client";

import { SignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userId) {
      router.push("/dashboard");
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded || userId) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
        <div className="w-8 h-8 rounded-full bg-orange-500/50 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md relative overflow-hidden rounded-3xl p-4">
        {/* Decorative Space Portal */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2 text-center text-white">Space Station Portal</h1>
          <p className="text-gray-500 text-sm text-center mb-6">
            Sign in to access your mission dashboard
          </p>
          <div className="w-full text-center mb-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-gray-600 bg-white/[0.03] border border-white/5 rounded-full px-3 py-1">
              🔐 Admin: <span className="text-orange-400/70">admin@churroverse.com</span>
            </span>
          </div>
          <SignIn 
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
                footerActionLink: "text-orange-500 hover:text-orange-400"
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
}
