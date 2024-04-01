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
import { GrAddCircle, GrRotateRight, GrSubtractCircle } from "react-icons/gr";
import api from "@/app/utils/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../loading";
import { Goals } from "@/app/admin/goals/goals";
import FormSkeleton from "../form-skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
  goalId: z.optional(z.string()),
});

const NewTransaction = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const watchType = form.watch("type");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newData = {
      ...values,
      repeatInterval: "MONTHLY",
    };

    console.log(newData);

    try {
      const res = await api.post("/transactions", newData);
      console.log(res);
      form.reset({
        description: "",
        amount: 0,
        type: "",
      });
      router.push("/admin/transactions");
    } catch (error: any) {
      console.log(error.response.data.error);
      toast(error.response.data.error);
      console.error(error);
    }
  };

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const query = `/goals?completed=false`;
      const response = await api.get(query);
      setGoals(response.data);
    } catch (error) {
      toast("Erro ao buscar metas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  if (loading) return <FormSkeleton numberOfInputs={4} />;

  return (
    <Form {...form}>
      <form className="w-full flex flex-col items-center gap-3">
        <FormField
          control={form.control}
          name="description"
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
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Total</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="w-full gap-0 border border-input rounded-md"
                  >
                    <ToggleGroupItem
                      value="EXPENSE"
                      className="w-20  hover:bg-destructive hover:text-destructive-foreground data-[state=on]:bg-destructive data-[state=on]:text-destructive-foreground  rounded-e-none"
                    >
                      Saída
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="INCOME"
                      className="w-20  hover:bg-success hover:text-success-foreground data-[state=on]:bg-success data-[state=on]:text-success-foreground  rounded-s-none"
                    >
                      Entrada
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {watchType === "INCOME" ? (
          <FormField
            control={form.control}
            name="goalId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Meta (opcional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {goals.map((goal: Goals) => (
                      <SelectItem key={goal.id} value={goal.id.toString()}>
                        {goal.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

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
