import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

const SignInPage = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <LoginLink>signin</LoginLink>
      <RegisterLink>Sign up</RegisterLink>
    </div>
  );
};

export default SignInPage;
