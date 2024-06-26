/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import PageHeader from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense, useEffect, useState } from "react";
import {
  GrCreditCard,
  GrFormNextLink,
  GrMoney,
  GrTransaction,
} from "react-icons/gr";
import { toast } from "sonner";
import api from "../utils/api";
import Loading from "@/components/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CountUp from "react-countup";
import { BarChart } from "@tremor/react";

type Transaction = {
  id: number;
  type: "EXPENSE" | "INCOME";
  amount: number;
  description: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

const MainAdminPage = () => {
  const router = useRouter();
  const [widgetValues, setWidgetValues] = useState({
    incomes: 0,
    expenses: 0,
  });
  const [transactionsToChart, setTransactionsToChart] = useState<
    {
      month: string;
      total: number;
    }[]
  >([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const widgets = [
    {
      title: "Saldo",
      value: widgetValues.incomes - widgetValues.expenses,
      icon: <GrTransaction />,
    },
    {
      title: "Entradas",
      value: widgetValues.incomes,
      icon: <GrMoney />,
    },
    {
      title: "Saídas",
      value: widgetValues.expenses,
      icon: <GrCreditCard />,
    },
  ];

  const getIncomesTotal = async () => {
    setLoading(true);
    try {
      const query = `/transactions/total?startDate=${dateRange.from?.toISOString()}&endDate=${dateRange.to?.toISOString()}&type=INCOME`;
      const response = await api.get(query);
      console.log(response.data.total);
      setWidgetValues((prev) => ({ ...prev, incomes: response.data.total }));
    } catch (error: any) {
      toast(JSON.parse(error.request.response || "{}").error);
    }
  };

  const getExpensesTotal = async () => {
    setLoading(true);
    try {
      const query = `/transactions/total?startDate=${dateRange.from?.toISOString()}&endDate=${dateRange.to?.toISOString()}&type=EXPENSE`;
      const response = await api.get(query);
      console.log(response.data.total);
      setWidgetValues((prev) => ({ ...prev, expenses: response.data.total }));
    } catch (error: any) {
      toast(JSON.parse(error.request.response || "{}").error);
    } finally {
      setLoading(false);
    }
  };

  const getAllTransactionsToChart = async () => {
    setLoading(true);
    try {
      const query = `/transactions/totalByMonth?startDate=${dateRange.from?.toISOString()}&endDate=${dateRange.to?.toISOString()}`;
      const response = await api.get<
        {
          month: string;
          total: number;
        }[]
      >(query);
      setTransactionsToChart(response.data);
    } catch (error: any) {
      if (
        "Token inválido" === JSON.parse(error.request.response || "{}").error
      ) {
        toast("Sessão expirada, por favor, faça login novamente.");
        router.push("/sign-in");
        return;
      }
      toast(JSON.parse(error.request.response || "{}").error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTransactions = async () => {
    setLoading(true);
    try {
      const query = `/transactions?startDate=${dateRange.from?.toISOString()}&endDate=${dateRange.to?.toISOString()}`;
      const response = await api.get(query);
      const mostRecent = response.data.slice(0, 7);
      setTransactions(mostRecent);
    } catch (error) {
      toast("Erro ao buscar transações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      await getIncomesTotal();
      await getExpensesTotal();
      await getAllTransactionsToChart();
      await fetchRecentTransactions();
    };

    fetchTransactions();
  }, []);

  const fetchDateDependentTransactions = async () => {
    await getIncomesTotal();
    await getExpensesTotal();
    await getAllTransactionsToChart();
    await fetchRecentTransactions();
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="h-full w-full">
        <PageHeader title="Painel" description="Informações gerais" />
        <div className="flex gap-2 items-center justify-end p-3">
          <CalendarDateRangePicker
            date={dateRange}
            setDate={setDateRange as SelectRangeEventHandler}
            updateFn={async () => fetchDateDependentTransactions()}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-3 p-3">
          {widgets.map((widget, index) => (
            <Card
              key={index}
              className="flex-1 flex justify-between  p-4 rounded-lg shadow-xs"
            >
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold">{widget.title}</h2>
                <p className="text-3xl font-bold">
                  R$
                  <CountUp
                    end={widget.value}
                    duration={1}
                    decimals={2}
                    decimal=","
                    separator="."
                  />
                </p>
              </div>
              <div className="flex items-start justify-end">{widget.icon}</div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-12 p-3 gap-3">
          <Card className="col-span-12 md:col-span-7 lg:col-span-8">
            <CardHeader>
              <CardTitle>Transações por mês</CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <BarChart
                className="h-[30rem]"
                data={transactionsToChart}
                index="month"
                categories={["total"]}
                colors={["primary"]}
                yAxisWidth={48}
                noDataText="Sem dados"
                showLegend={false}
              />
            </CardContent>
          </Card>
          <Card className="h-full col-span-12 md:col-span-5 lg:col-span-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Transações</CardTitle>
                <CardDescription>Últimas transações realizadas</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/admin/transactions">
                  Ver Todas
                  <GrFormNextLink className="h-4 w-4 -rotate-45" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{transaction.description}</TableCell>

                      <TableCell
                        className={`text-right ${
                          transaction.type === "INCOME"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {transaction.amount.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Suspense>
  );
};

export default MainAdminPage;
