"use client";

import PageHeader from "@/components/page-header";
import SimpleTable from "@/components/table/simple-table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/components/loading";
import api from "@/app/utils/api";
import { toast } from "sonner";
import { getUserId } from "@/app/utils/getUserId";

type Category = {
  id: string;
  name: string;
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Nome",
      key: "name",
      width: "70%",
    },
    {
      title: "Ações",
      key: "actions",
      render: (item: Category) => (
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
      await api.delete(`/categories/${id}`);
      toast("Meta excluída com sucesso");
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast("Erro ao excluir meta");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      const query = `/categories`;
      const response = await api.get(query);
      setCategories(response.data);
    } catch (error) {
      toast("Erro ao buscar metas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchCategories = async () => {
      try {
        const userId = getUserId();
        const query = `/categories`;
        const response = await api.get(query);
        console.log(response.data);
        setCategories(response.data);
      } catch (error) {
        toast("Erro ao buscar metas");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <div className="h-full w-full">
        <PageHeader
          title="Categorias"
          description="Lista de categorias"
          backlink="/admin"
        />
        <div className="h-full w-full flex flex-col gap-3 items-center justify-center mb-3 pt-3 mt-6">
          <div className="w-full p-4 items-end">
            <div className="mt-2">
              <SimpleTable
                columns={columns}
                rows={categories}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default CategoriesPage;
