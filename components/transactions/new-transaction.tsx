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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { GrAddCircle, GrSubtractCircle } from "react-icons/gr";
import api from "@/app/utils/api";
import Cookies from "js-cookie";

const formSchema = z.object({
  description: z.string({
    required_error: "Nome obrigatório",
  }),
  type: z.string({
    required_error: "Tipo obrigatório",
  }),
  amount: z.number({
    required_error: "Total obrigatório",
  }),
});

const NewTransaction = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newData = {
      ...values,
      userId: Number(Cookies.get("userId")),
    };

    try {
      const res = await api.post("/transaction", newData);
      console.log(res);
      form.reset({
        description: "",
        amount: 0,
        type: "",
      });
      router.push("/admin/transactions");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form className="w-full flex flex-col items-center gap-3">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nome</FormLabel>
              <FormMessage />
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Total</FormLabel>
              <FormMessage />
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(parseFloat(e.target.value));
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Tipo</FormLabel>
              <FormMessage />
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="expense">
                    <span className="flex gap-2 items-center">
                      <GrSubtractCircle />
                      Saída
                    </span>
                  </SelectItem>
                  <SelectItem value="entry">
                    <span className="flex gap-2  items-center">
                      <GrAddCircle />
                      Entrada
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end mt-2">
          <Button className="" onClick={form.handleSubmit(onSubmit)}>
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewTransaction;
