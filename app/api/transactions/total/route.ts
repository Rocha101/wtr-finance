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

    const totalAmount = transactions.reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0);

    return new Response(JSON.stringify({ total: totalAmount }), {
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
