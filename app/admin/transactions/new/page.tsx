"use client";

import { useSearchParams } from "next/navigation";

const NewTransactionPage = () => {
  const searchParams = useSearchParams();

  const typeParam = searchParams.get("type");

  const transactionType = typeParam === "expense" ? "Despesa" : "Entrada";

  return (
    <div>
      <h1>Nova {transactionType}</h1>
    </div>
  );
};

export default NewTransactionPage;
