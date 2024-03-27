import { SafeParseReturnType, z } from "zod";
import prisma from "@/app/utils/prisma";
import { RepeatInterval, Transaction, TransactionType } from "@prisma/client";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs";

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

    console.log(userId);

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

    const getMonthByNumber = (month: number) => {
      const months = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];
      return months[month - 1];
    };

    const transactionsByMonth: number[] = Array(12).fill(0);

    const transactionsWithMonths = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.createdAt).getMonth();
      acc[month] += transaction.amount;
      return acc;
    }, transactionsByMonth);

    const transactionsByMonthNames = transactionsWithMonths.map(
      (monthTotal, index) => {
        return {
          month: getMonthByNumber(index + 1),
          total: monthTotal,
        };
      }
    );

    return new Response(JSON.stringify(transactionsByMonthNames), {
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
