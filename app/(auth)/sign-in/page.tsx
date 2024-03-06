import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

const SignInPage = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Card className="w-96 flex flex-col gap-3 p-6">
        <h1 className="text-xl font-bold">Login</h1>
        <Button asChild>
          <LoginLink>Entrar</LoginLink>
        </Button>
        <Button asChild variant="outline">
          <RegisterLink>Me Cadastrar</RegisterLink>
        </Button>
      </Card>
    </div>
  );
};

export default SignInPage;
