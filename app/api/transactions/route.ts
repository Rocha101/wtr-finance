import { SafeParseReturnType, z } from "zod";
import prisma from "@/app/utils/prisma";
import { RepeatInterval, Transaction, TransactionType } from "@prisma/client";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs";

const GetParamsSchema = z.object({
  type: z.optional(z.string()),
  startDate: z.optional(z.string()),
  endDate: z.optional(z.string()),
});

const PostParamsSchema = z.object({
  type: z.string().refine((type) => ["INCOME", "EXPENSE"].includes(type), {
    message: "Invalid transaction type",
  }),
  amount: z.number(),
  description: z.string(),
  repeatInterval: z.optional(z.string()),
  createdAt: z.optional(z.string()),
  goalId: z.optional(z.string()),
});

const getParams = async (request: NextRequest) => {
  return request.nextUrl.searchParams;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = await getParams(request);
    const type = searchParams.get("type");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const { userId } = auth();

    if (!userId)
      return new Response(JSON.stringify({ error: "Missing user id" }), {
        headers: { "content-type": "application/json" },
        status: 400,
      });

    const transactions = await prisma.transaction.findMany({
      include: {
        goals: true,
      },
      where: {
        userId: userId,
        ...(startDate &&
          endDate && {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }),
        ...(type && {
          type: type as Transaction["type"],
        }),
      },
    });

    return new Response(JSON.stringify(transactions), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: e }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const response: any = PostParamsSchema.safeParse(await request.json());

    const { type, amount, description, repeatInterval, createdAt, goalId } =
      response.data;

    const { userId } = auth();

    if (!userId)
      return new Response(JSON.stringify({ error: "Faltando id do usuario" }), {
        headers: { "content-type": "application/json" },
        status: 400,
      });

    if (goalId) {
      const goal = await prisma.goal.findUnique({
        where: {
          id: Number(goalId),
        },
        include: {
          transactions: true,
        },
      });

      if (!goal) {
        return new Response(JSON.stringify({ error: "Meta nao encontrada" }), {
          headers: { "content-type": "application/json" },
          status: 404,
        });
      }

      // Calculate the total amount of transactions associated with the goal
      const totalTransactionsAmount = goal.transactions.reduce(
        (acc, transaction) => acc + transaction.amount,
        0
      );

      // Check if the new transaction amount exceeds the goal target amount
      if (amount > goal.targetAmount - totalTransactionsAmount) {
        return new Response(
          JSON.stringify({ error: "Total ultrapassa objetivo da meta" }),
          {
            headers: { "content-type": "application/json" },
            status: 400,
          }
        );
      }
      if (amount < totalTransactionsAmount) {
        return new Response(
          JSON.stringify({ error: "Total menor que o total de transações" }),
          {
            headers: { "content-type": "application/json" },
            status: 400,
          }
        );
      }
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        type: type as TransactionType,
        amount: amount,
        description: description,
        repeatInterval: repeatInterval as RepeatInterval,
        userId: userId,
        ...(createdAt && {
          createdAt: new Date(createdAt),
        }),
        ...(goalId && {
          goals: {
            connect: {
              id: Number(goalId),
            },
          },
        }),
      },
    });

    return new Response(JSON.stringify(newTransaction), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const searchParams = await getParams(request);
    const id = searchParams.get("id");
    const response: any = PostParamsSchema.safeParse(await request.json());
    const { type, amount, description, repeatInterval, createdAt, goalId } =
      response.data;
    const { userId } = auth();
    if (!userId)
      return new Response(JSON.stringify({ error: "Missing user id" }), {
        headers: { "content-type": "application/json" },
        status: 400,
      });

    if (goalId) {
      const goal = await prisma.goal.findUnique({
        where: {
          id: Number(goalId),
        },
        include: {
          transactions: true,
        },
      });

      if (!goal) {
        return new Response(JSON.stringify({ error: "Meta nao encontrada" }), {
          headers: { "content-type": "application/json" },
          status: 404,
        });
      }

      // Calculate the total amount of transactions associated with the goal
      const totalTransactionsAmount = goal.transactions.reduce(
        (acc, transaction) => acc + transaction.amount,
        0
      );

      const restValue = goal.targetAmount - totalTransactionsAmount;

      // Check if the new transaction amount exceeds the goal target amount
      if (amount > restValue) {
        return new Response(
          JSON.stringify({ error: "Total ultrapassa objetivo da meta" }),
          {
            headers: { "content-type": "application/json" },
            status: 400,
          }
        );
      }
    }

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id: Number(id),
        userId: userId,
      },
      data: {
        type: type as TransactionType,
        amount,
        description,
        repeatInterval: repeatInterval as RepeatInterval,
        ...(createdAt && {
          createdAt: new Date(createdAt),
        }),
        ...(goalId && {
          goals: {
            connect: {
              id: Number(goalId),
            },
          },
        }),
      },
    });

    return new Response(JSON.stringify(updatedTransaction), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = await getParams(request);
    const id = searchParams.get("id");
    if (!id)
      return new Response(JSON.stringify({ error: "Missing id" }), {
        headers: { "content-type": "application/json" },
        status: 400,
      });
    const removedTransaction = await prisma.transaction.delete({
      where: {
        id: Number(id),
      },
    });

    return new Response(JSON.stringify(removedTransaction), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
}
