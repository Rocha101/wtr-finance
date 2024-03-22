"use client";

import PageHeader from "@/components/page-header";
import SimpleTable from "@/components/simple-table";
import NewTransaction from "@/components/transactions/new-transaction";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "@/components/loading";
import api from "@/app/utils/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { getUserId } from "@/app/utils/getUserId";
import { Budgets } from "../budgets/budget";
import { Goals } from "../goals/goals";
import { GrStorage, GrTarget } from "react-icons/gr";

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: string;
  goals: Goals[];
  budgets: Budgets[];
};

const TransactionsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState("all");

  const columns = [
    {
      title: "Nome",
      key: "description",
      width: "70%",
    },
    {
      title: "Total",
      key: "amount",
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
    },
    {
      title: "Objetivo",
      render: (item: Transaction) => {
        if (!item.goals[0] && !item.budgets[0]) {
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
            {item.budgets[0] && (
              <Badge variant="outline" className="mr-2">
                <GrStorage className="mr-1" />
                {item.budgets[0].name}
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
        return transaction.type === "income";
      case "expense":
        return transaction.type === "expense";
      default:
        return true;
    }
  });

  const handleCloseModal = () => router.push("/admin/transactions");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      const query = `/transaction/${userId}`;
      const response = await api.get(query);
      setTransactions(response.data);
    } catch (error) {
      toast("Erro ao buscar transações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchTransactions = async () => {
      try {
        const userId = getUserId();
        const query = `/transaction/${userId}`;
        const response = await api.get(query);
        console.log(response.data);
        setTransactions(response.data);
      } catch (error) {
        toast("Erro ao buscar transações");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [modal]);

  if (loading) return <Loading />;

  return (
    <div className="h-full w-full">
      <PageHeader
        title="Transações"
        description="Lista de transações"
        backlink="/admin"
      />
      <div className="h-full w-full flex flex-col gap-3 items-center justify-center mb-3 pt-3 mt-6">
        <div className="w-full p-4 items-end">
          <div className="w-full flex items-center gap-3 justify-end">
            <Select
              value={type}
              onValueChange={(value) => handleTypeChange(value as string)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtro por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tipo</SelectLabel>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="income">Entradas</SelectItem>
                  <SelectItem value="expense">Saídas</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              onClick={() => router.push("/admin/transactions?modal=new")}
            >
              Nova transação
            </Button>
          </div>
          <div className="mt-2">
            <SimpleTable
              columns={columns}
              rows={filteredTransactions}
              rowsPerPage={12}
            />
          </div>
        </div>
      </div>
      <Suspense fallback={<Loading />}>
        <Dialog open={modal === "new"} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-[425px]">
            <NewTransaction />
          </DialogContent>
        </Dialog>
      </Suspense>
    </div>
  );
};

export default TransactionsPage;