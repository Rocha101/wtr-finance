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
import Link from "next/link";
import { useState } from "react";
import api from "@/app/utils/api";
import { toast } from "sonner";
import Loading from "../loading";

const formSchema = z.object({
  username: z.string({
    required_error: "Nome obrigatório",
  }),
  email: z.string({
    required_error: "Email obrigatório",
  }),
  password: z.string({
    required_error: "Senha obrigatória",
  }),
});

const RegisterForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [loading, setLoading] = useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    console.log(values);
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    const data = {
      username: values.username,
      email: values.email,
      password: values.password,
    };
    api
      .post("/auth/register", data, config)
      .then((res) => {
        setLoading(false);
        toast("Você foi cadastrado com sucesso!");
        router.push("/sign-in");
        form.reset();
      })
      .catch((err) => {
        console.log(err);
        toast(JSON.parse(err.request.response).error);
      })
      .finally(() => setLoading(false));
  }

  if (loading) return <Loading />;

  return (
    <Form {...form}>
      <form className="w-full flex flex-col items-center gap-3">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-between mt-2">
          <Link href="/sign-in" passHref>
            <Button variant="link" className="p-0">
              Já tenho conta
            </Button>
          </Link>
          <Button className="" onClick={form.handleSubmit(onSubmit)}>
            Registro
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
