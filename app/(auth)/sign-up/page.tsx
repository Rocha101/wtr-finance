"use client";

import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      {/* <Card className="w-96 flex flex-col gap-3 p-6">
        <RegisterForm />
      </Card> */}
      <SignUp />
    </div>
  );
};

export default SignUpPage;
