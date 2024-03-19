import LoginForm from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const SignInPage = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Card className="w-96 flex flex-col gap-3 p-6">
        <LoginForm />
      </Card>
    </div>
  );
};

export default SignInPage;
