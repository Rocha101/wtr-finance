import LoginForm from "@/components/auth/login-form";
import { Card } from "@/components/ui/card";

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
