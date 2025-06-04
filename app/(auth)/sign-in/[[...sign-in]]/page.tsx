"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect } from "react";

export default function SignInPage() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="/favicon.png"
            alt="Pinsearch"
            width={48}
            height={48}
            className="mb-2"
          />
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-sm text-gray-400">
              Sign in to your account to continue to Analytics Dashboard
            </p>
          </div>
        </div>

        <SignIn
          appearance={{
            baseTheme: dark,
            elements: {
              formButtonPrimary:
                "bg-primary hover:bg-primary/90 text-primary-foreground",
              card: "bg-zinc-900 shadow-lg border border-zinc-800 rounded-lg",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "border-zinc-800 hover:bg-zinc-800",
              formFieldInput:
                "bg-zinc-950 border-zinc-800 focus:border-primary",
              footerActionLink: "text-primary hover:text-primary/90",
              formFieldLabel: "text-gray-300",
              formFieldInputShowPasswordButton:
                "text-gray-400 hover:text-gray-300",
              identityPreviewEditButton: "text-primary hover:text-primary/90",
              formFieldAction: "text-primary hover:text-primary/90",
              footer: "text-gray-400",
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          redirectUrl="/"
        />
      </div>
    </div>
  );
}
