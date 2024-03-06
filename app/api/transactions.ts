import { tursoClient } from "@/lib/tursoClient";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        return handleGetRequest(res);
      case "POST":
        return handlePostRequest(req, res);
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetRequest(res: NextApiResponse) {
  const response = await tursoClient().execute({
    sql: `SELECT * FROM transactions`,
    args: [],
  });
  return res.status(200).json(response);
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { amount, date, type } = req.body;
  if (!amount || !date || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newTransaction = {
    id: randomUUID(),
    amount,
    date,
    type,
  };

  const create = await tursoClient().execute({
    sql: "INSERT INTO transactions (id, amount, date, type) VALUES ($1, $2, $3, $4)",
    args: [
      newTransaction.id,
      newTransaction.amount,
      newTransaction.date,
      newTransaction.type,
    ],
  });

  return res.status(201).json(newTransaction);
}
