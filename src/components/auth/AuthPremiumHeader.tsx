
import React from "react";

/** Premium-styled brand gradient headline, description & underline bar */
export default function AuthPremiumHeader({ isSignUp }: { isSignUp: boolean }) {
  return (
    <div className="flex flex-col items-center w-full mb-0 mt-3">
      <h2 className="
        text-[2.25rem] sm:text-4xl md:text-5xl font-playfair font-extrabold leading-tight tracking-tight
        bg-gradient-to-br from-neon via-primary to-[#7E69AB] bg-clip-text text-transparent
        drop-shadow-xl mb-1
      ">
        {isSignUp
          ? (
            <>
              <span className="inline-block text-neon">Join</span>{" "}
              <span className="inline-block text-primary">Chapter Creator</span>
            </>
          )
          : <span className="inline-block text-primary">Sign In to Chapter Creator</span>
        }
      </h2>
      <div className="w-2/3 sm:w-1/2 h-[4px] bg-gradient-to-r from-neon via-[#9b87f5] to-[#8E9196] rounded-full my-2" />
      <p className="font-inter text-base text-muted-foreground mt-2 text-center max-w-xl">
        {isSignUp
          ? "Create your Chapter Creator account to unlock premium brand deals and creative collabs."
          : "Welcome back! Sign in to Chapter Creator and power up your next creative chapter."}
      </p>
    </div>
  );
}
