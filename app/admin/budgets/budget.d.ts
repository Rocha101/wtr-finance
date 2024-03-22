type Budgets = {
  id: string;
  name: string;
  categories: {
    id: string;
    name: string;
  }[];
  limit: number;
};

export { Budgets };
