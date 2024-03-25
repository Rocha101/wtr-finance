"use client";

import PageHeader from "@/components/page-header";
import SimpleTable from "@/components/table/simple-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/components/loading";
import api from "@/app/utils/api";
import { toast } from "sonner";
import NewBudget from "@/components/budgets/new-budget";
import { getUserId } from "@/app/utils/getUserId";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Budgets } from "./budget";

const BudgetPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");

  const [budgets, setBudgets] = useState<Budgets[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Nome",
      key: "name",
      width: "60%",
      search: true,
    },
    {
      title: "Categorias",
      key: "categories",
      render: (item: Budgets) => {
        return (
          <div>
            {item.categories.map((category, index) => {
              if (index > 2) return null;
              if (index === 2)
                return (
                  <TooltipProvider key={category.id}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge className="mr-2">...</Badge>
                      </TooltipTrigger>
                      <TooltipContent
                        className="flex flex-col gap-1"
                        align="start"
                        alignOffset={30}
                      >
                        {item.categories.map((category, index) => {
                          if (index < 2) return null;
                          return (
                            <Badge key={category.id} className="mr-2">
                              {category.name}
                            </Badge>
                          );
                        })}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              return (
                <Badge key={category.id} className="mr-2">
                  {category.name}
                </Badge>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Limite",
      key: "limit",
      money: true,
    },
    {
      title: "Ações",
      key: "actions",
      render: (item: Budgets) => (
        <Button variant="ghost" onClick={() => handleDelete(item.id)}>
          Excluir
        </Button>
      ),
      width: "5%",
    },
  ];

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/budget/${id}`);
      toast("Orçamento excluído com sucesso");
      fetchBudgets();
    } catch (error) {
      console.error(error);
      toast("Erro ao excluir orçamento");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => router.push("/admin/budgets");

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      const query = `/budget/${userId}`;
      const response = await api.get(query);
      setBudgets(response.data);
    } catch (error) {
      toast("Erro ao buscar orçamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchBudgets = async () => {
      try {
        const userId = getUserId();
        const query = `/budget/${userId}`;
        const response = await api.get(query);
        console.log(response.data);
        setBudgets(response.data);
      } catch (error) {
        toast("Erro ao buscar orçamentos");
      } finally {
        setLoading(false);
      }
    };
    fetchBudgets();
  }, [modal]);

  return (
    <Suspense fallback={<Loading />}>
      <div className="h-full w-full">
        <PageHeader
          title="Orçamentos"
          description="Lista de orçamentos"
          backlink="/admin"
        />
        <div className="h-full w-full mt-14 p-3">
          <SimpleTable
            columns={columns}
            rows={budgets}
            rowsPerPage={11}
            actions={
              <Button onClick={() => router.push("/admin/budgets?modal=new")}>
                Novo Orçamento
              </Button>
            }
            searchable
            loading={loading}
          />
        </div>
        <Suspense fallback={<Loading />}>
          <Dialog open={modal === "new"} onOpenChange={handleCloseModal}>
            <DialogContent className="sm:max-w-[425px]">
              <NewBudget />
            </DialogContent>
          </Dialog>
        </Suspense>
      </div>
    </Suspense>
  );
};

export default BudgetPage;
