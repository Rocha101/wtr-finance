type RecurrentTransactions = {
  id: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  day: number; // day of the month to repeat
  completed: boolean;
  goals: Goal[];
  budgets: Budget[];
};

export type { RecurrentTransactions };
