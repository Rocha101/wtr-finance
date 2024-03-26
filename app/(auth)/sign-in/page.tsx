"use client";

import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      {/* <Card className="w-96 flex flex-col gap-3 p-6">
        <LoginForm />
      </Card> */}
      <SignIn />
    </div>
  );
};

export default SignInPage;
