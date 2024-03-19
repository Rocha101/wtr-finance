"use client";

import PageHeader from "@/components/page-header";
import SimpleTable from "@/components/simple-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/components/loading";
import api from "@/app/utils/api";
import { toast } from "sonner";
import NewGoal from "@/components/goals/new-goal";

type Goals = {
  id: string;
  name: string;
  targetAmount: number;
  progress: number;
};

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
    },
    {
      title: "Total",
      key: "targetAmount",
    },
    {
      title: "Progresso",
      key: "progress",
      render: (item: Goals) => `${item.progress}%`,
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
      await api.delete(`/goal/${id}`);
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
      const response = await api.get("/goal");
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
        const response = await api.get("/goal");
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

  if (loading) return <Loading />;

  return (
    <div className="h-full w-full">
      <PageHeader
        title="Metas"
        description="Lista de metas"
        backlink="/admin"
      />
      <div className="h-full w-full flex flex-col gap-3 items-center justify-center mb-3 pt-3 mt-6">
        <div className="w-full p-4 items-end">
          <div className="w-full flex items-center gap-3 justify-end">
            <Button onClick={() => router.push("/admin/goals?modal=new")}>
              Nova meta
            </Button>
          </div>
          <div className="mt-2">
            <SimpleTable columns={columns} rows={goals} rowsPerPage={12} />
          </div>
        </div>
      </div>
      <Suspense fallback={<Loading />}>
        <Dialog open={modal === "new"} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-[425px]">
            <NewGoal />
          </DialogContent>
        </Dialog>
      </Suspense>
    </div>
  );
};

export default GoalsPage;
