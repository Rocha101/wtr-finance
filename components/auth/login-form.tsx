"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/app/utils/api";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { GrFormView, GrHide } from "react-icons/gr";
import { PasswordInput } from "../password-input";

const formSchema = z.object({
  email: z.string({
    required_error: "Email obrigatório",
  }),
  password: z.string({
    required_error: "Senha obrigatória",
  }),
});

const LoginForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    api
      .post("/auth/login", values, config)
      .then((res) => {
        console.log(res);
        const { data } = res;
        const { user, token } = data;
        Cookies.set("user", JSON.stringify(user));
        Cookies.set("userId", user.id);
        Cookies.set("token", token);
        toast("Login realizado com sucesso!");
        router.push("/admin");
      })
      .catch((err) => {
        console.log(err);
        toast(JSON.parse(err.request.response).error);
      });
  };

  return (
    <Form {...form}>
      <form
        className="w-full flex flex-col items-center gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-between mt-2">
          <Button
            type="button"
            variant="link"
            className="p-0"
            onClick={() => router.push("/sign-up")}
          >
            Quero criar uma conta
          </Button>

          <Button className="" type="submit">
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
