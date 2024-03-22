/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import PageHeader from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { GrCreditCard, GrMoney, GrTransaction, GrUser } from "react-icons/gr";
import { toast } from "sonner";
import api from "../utils/api";
import Loading from "@/components/loading";
import {
  Bar,
  BarChart,
  CartesianAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { addDays, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type Transaction = {
  id: number;
  type: "expense" | "entry";
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
    from: subDays(new Date(), 1),
    to: addDays(new Date(), 7),
  });
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
      const userId = Cookies.get("userId");
      const query = `/transaction/total/${userId}?startDate=${dateRange.from?.toISOString()}&endDate=${dateRange.to?.toISOString()}&type=INCOME`;
      const response = await api.get(query);
      setWidgetValues((prev) => ({ ...prev, incomes: response.data }));
    } catch (error: any) {
      toast(JSON.parse(error.request.response).error);
    }
  };

  const getExpensesTotal = async () => {
    setLoading(true);
    try {
      const userId = Cookies.get("userId");
      const query = `/transaction/total/${userId}?startDate=${dateRange.from?.toISOString()}&endDate=${dateRange.to?.toISOString()}&type=EXPENSE`;
      const response = await api.get(query);
      setWidgetValues((prev) => ({ ...prev, expenses: response.data }));
    } catch (error: any) {
      toast(JSON.parse(error.request.response).error);
    } finally {
      setLoading(false);
    }
  };

  const getAllTransactionsToChart = async () => {
    setLoading(true);
    try {
      const userId = Cookies.get("userId");
      const query = `/transaction/totalbymonth/${userId}?startDate=${dateRange.from?.toISOString()}&endDate=${dateRange.to?.toISOString()}`;
      const response = await api.get<
        {
          month: string;
          total: number;
        }[]
      >(query);
      setTransactionsToChart(response.data);
    } catch (error: any) {
      if ("Token inválido" === JSON.parse(error.request.response).error) {
        toast("Sessão expirada, por favor, faça login novamente.");
        router.push("/sign-in");
        return;
      }
      toast(JSON.parse(error.request.response).error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      await getIncomesTotal();
      await getExpensesTotal();
      await getAllTransactionsToChart();
    };

    fetchTransactions();
  }, []);

  const fetchDateDependentTransactions = async () => {
    await getIncomesTotal();
    await getExpensesTotal();
    await getAllTransactionsToChart();
  };

  const disabledAttButton = !dateRange || !dateRange.from || !dateRange.to;

  if (loading) return <Loading />;

  return (
    <div className="h-full w-full">
      <PageHeader title="Painel" description="Informações gerais" />
      <div className="flex gap-2 items-center justify-end p-3">
        <CalendarDateRangePicker
          date={dateRange}
          setDate={setDateRange as SelectRangeEventHandler}
        />
        <Button
          onClick={async () => fetchDateDependentTransactions()}
          disabled={disabledAttButton}
          size="sm"
        >
          Atualizar
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-3 p-3">
        {widgets.map((widget, index) => (
          <Card
            key={index}
            className="flex-1 flex justify-between bg-white p-4 rounded-lg shadow-xs"
          >
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold">{widget.title}</h2>
              <p className="text-3xl font-bold">
                {widget.value
                  ? widget.value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  : "R$0,00"}
              </p>
            </div>
            <div className="flex items-start justify-end">{widget.icon}</div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-4 p-3">
        <Card className="col-span-4 md:col-span-2">
          <CardHeader>
            <CardTitle>Transações por mês</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={transactionsToChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip />
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$${value}`}
                />
                <Bar
                  dataKey="total"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MainAdminPage;
