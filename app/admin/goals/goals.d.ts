type Goals = {
  id: string;
  name: string;
  targetAmount: number;
  progress: number;
  categories: {
    id: string;
    name: string;
  }[];
};

export { Goals };
