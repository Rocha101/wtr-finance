"use client";

import { SignUp } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <SignUp />
    </div>
  );
};

export default SignInPage;
