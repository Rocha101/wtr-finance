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
import api from "@/app/utils/api";
import { InputTags } from "../tag-input";
import { getUserId } from "@/app/utils/getUserId";

const formSchema = z.object({
  name: z.string({
    required_error: "Nome obrigatório",
  }),
  categories: z.array(
    z.string({
      required_error: "Categoria obrigatória",
    })
  ),
  limit: z.number({
    required_error: "Limite obrigatório",
  }),
});

const NewBudget = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newData = {
      ...values,
      userId: getUserId(),
    };

    console.log(newData);

    try {
      const res = await api.post("/budget", newData);
      console.log(res);
      form.reset({
        limit: 0,
        name: "",
        categories: [],
      });
      router.push("/admin/budgets");
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form className="w-full flex flex-col items-center gap-3">
        <FormField
          control={form.control}
          name="name"
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
          name="categories"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Categorias</FormLabel>
              <FormMessage />
              <FormControl>
                <InputTags {...field} />
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
