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
import NewGoal from "@/components/goals/new-goal";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Goals } from "./goals";

const GoalsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");

  const [goals, setGoals] = useState<Goals[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Nome",
      key: "name",
      width: "70%",
      search: true,
    },
    {
      title: "Categorias",
      key: "categories",
      render: (item: Goals) => {
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
      title: "Total",
      key: "targetAmount",
    },
    {
      title: "Progresso",
      key: "progress",
      render: (item: Goals) => {
        const transactionsSum = item.transactions.reduce(
          (acc, transaction) => acc + transaction.amount,
          0
        );

        const progress = (transactionsSum / item.targetAmount) * 100;

        return `${progress.toFixed(2)}%`;
      },
    },
    {
      title: "Ações",
      key: "actions",
      render: (item: Goals) => (
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
      await api.delete(`/goals?id=${id}`);
      toast("Meta excluída com sucesso");
      fetchGoals();
    } catch (error) {
      console.error(error);
      toast("Erro ao excluir meta");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => router.push("/admin/goals");

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const query = `/goals`;
      const response = await api.get(query);
      setGoals(response.data);
    } catch (error) {
      toast("Erro ao buscar metas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchGoals = async () => {
      try {
        const query = `/goals`;
        const response = await api.get(query);
        console.log(response.data);
        setGoals(response.data);
      } catch (error) {
        toast("Erro ao buscar metas");
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, [modal]);

  return (
    <Suspense fallback={<Loading />}>
      <div className="h-full w-full">
        <PageHeader
          title="Metas"
          description="Lista de metas"
          backlink="/admin"
        />
        <div className="h-full w-full mt-10 p-3">
          <SimpleTable
            columns={columns}
            rows={goals}
            rowsPerPage={11}
            searchable
            actions={
              <Button onClick={() => router.push("/admin/goals?modal=new")}>
                Nova meta
              </Button>
            }
            loading={loading}
          />
        </div>
        <Suspense fallback={<Loading />}>
          <Dialog open={modal === "new"} onOpenChange={handleCloseModal}>
            <DialogContent className="sm:max-w-[425px]">
              <NewGoal />
            </DialogContent>
          </Dialog>
        </Suspense>
      </div>
    </Suspense>
  );
};

export default GoalsPage;
