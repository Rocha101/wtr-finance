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
  name: z.string({
    required_error: "Nome obrigatório",
  }),
  targetAmount: z.number({
    required_error: "Total obrigatório",
  }),
  progress: z.number({
    required_error: "Progresso obrigatório",
  }),
});

const NewGoal = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      progress: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newData = {
      ...values,
      userId: Number(Cookies.get("userId")),
    };

    try {
      const res = await api.post("/goal", newData);
      console.log(res);
      form.reset({
        name: "",
        targetAmount: 0,
        progress: 0,
      });
      router.push("/admin/goals");
    } catch (error) {
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
          name="targetAmount"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Total (objetivo)</FormLabel>
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
          name="progress"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                Progresso <b>{field.value}%</b>
              </FormLabel>
              <FormMessage />
              <Input
                {...field}
                type="range"
                min={0}
                max={100}
                value={field.value}
                onChange={(e) => {
                  field.onChange(parseFloat(e.target.value));
                }}
              />
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

export default NewGoal;
