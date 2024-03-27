import { Transaction } from "@prisma/client";

type Goals = {
  id: string;
  name: string;
  targetAmount: number;
  progress: number;
  categories: {
    id: string;
    name: string;
  }[];
  transactions: Transaction[];
};

export { Goals };
