"use client";
import { GrFormView, GrHide } from "react-icons/gr";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = ({ value, onChange, ...props }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        {...props}
      />
      <Button
        type="button"
        size="minimal"
        className="absolute right-2 top-2"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <GrHide className="h-5 w-5" />
        ) : (
          <GrFormView className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export { PasswordInput };
