"use client";

import PageHeader from "@/components/page-header";
import SimpleTable from "@/components/table/simple-table";
import NewTransaction from "@/components/transactions/new-transaction";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/components/loading";
import api from "@/app/utils/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Goals } from "../goals/goals";
import { GrStorage, GrTarget } from "react-icons/gr";
import { Column } from "@/components/table/simple-table.d";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { subDays } from "date-fns";

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: string;
  goals: Goals[];
};

const TransactionsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const columns: Column[] = [
    {
      title: "Nome",
      key: "description",
      width: "40%",
      search: true,
      sortable: true,
    },
    {
      title: "Total",
      key: "amount",
      sortable: true,
    },
    {
      title: "Tipo",
      key: "type",
      render: (item: Transaction) => {
        return (
          <Badge variant={item.type === "INCOME" ? "success" : "destructive"}>
            {item.type === "INCOME" ? "Entrada" : "Saída"}
          </Badge>
        );
      },
      search: true,
      type: "select",
      options: [
        { value: "NULL", label: "Todos" },
        { value: "INCOME", label: "Entrada" },
        { value: "EXPENSE", label: "Saída" },
      ],
    },
    {
      title: "Objetivo",
      key: "goals",
      render: (item: Transaction) => {
        if (!item.goals[0]) {
          return (
            <Badge variant="outline" className="mr-2">
              Sem objetivo
            </Badge>
          );
        }
        return (
          <>
            {item.goals[0] && (
              <Badge variant="outline" className="mr-2">
                <GrTarget className="mr-1" />
                {item.goals[0].name}
              </Badge>
            )}
          </>
        );
      },
    },
    {
      title: "Ações",
      key: "actions",
      render: (item: Transaction) => (
        <Button variant="ghost" onClick={() => handleDelete(item.id)}>
          Excluir
        </Button>
      ),
      width: "5%",
    },
  ];

  const handleTypeChange = (type: string) => {
    setType(type);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/transaction/${id}`);
      toast("Transação excluída com sucesso");
      fetchTransactions();
    } catch (error) {
      console.error(error);
      toast("Erro ao excluir transação");
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    switch (type) {
      case "income":
        return transaction.type === "INCOME";
      case "expense":
        return transaction.type === "EXPENSE";
      default:
        return true;
    }
  });

  const handleCloseModal = () => router.push("/admin/transactions");

  const fetchTransactions = async ({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }) => {
    setLoading(true);
    try {
      const query = `/transactions?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      const response = await api.get(query);
      console.log(response.data);
      setTransactions(response.data);
    } catch (error) {
      toast("Erro ao buscar transações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions({
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
    });
  }, [modal]);

  return (
    <Suspense fallback={<Loading />}>
      <div className="h-full w-full">
        <PageHeader
          title="Transações"
          description="Lista de transações"
          backlink="/admin"
        />
        <div className="h-full w-full mt-14 p-3">
          <SimpleTable
            columns={columns}
            rows={filteredTransactions}
            rowsPerPage={11}
            searchable
            actions={
              <Button
                onClick={() => router.push("/admin/transactions?modal=new")}
              >
                Nova transação
              </Button>
            }
            advancedSearch={
              <Suspense fallback={<Loading />}>
                <CalendarDateRangePicker
                  date={dateRange}
                  setDate={setDateRange as SelectRangeEventHandler}
                  updateFn={async () =>
                    fetchTransactions({
                      startDate: dateRange.from as Date,
                      endDate: dateRange.to as Date,
                    })
                  }
                />
              </Suspense>
            }
            loading={loading}
          />
        </div>
        <Suspense fallback={<Loading />}>
          <Dialog open={modal === "new"} onOpenChange={handleCloseModal}>
            <DialogContent className="sm:max-w-[425px]">
              <NewTransaction />
            </DialogContent>
          </Dialog>
        </Suspense>
      </div>
    </Suspense>
  );
};

export default TransactionsPage;
