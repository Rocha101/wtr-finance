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
  category: z.string({
    required_error: "Categoria obrigatória",
  }),
  limit: z.number({
    required_error: "Limite obrigatório",
  }),
});

const NewBudget = () => {
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
      const res = await api.post("/budget", newData);
      console.log(res);
      form.reset({
        category: "",
        limit: 0,
      });
      router.push("/admin/budgets");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form className="w-full flex flex-col items-center gap-3">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Categoria</FormLabel>
              <FormMessage />
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="limit"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Limite</FormLabel>
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
        <div className="w-full flex justify-end mt-2">
          <Button className="" onClick={form.handleSubmit(onSubmit)}>
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewBudget;
