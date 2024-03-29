import { SafeParseReturnType, z } from "zod";
import prisma from "@/app/utils/prisma";
import { RepeatInterval, Transaction, TransactionType } from "@prisma/client";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs";

const PostParamsSchema = z.object({
  name: z.string(),
  targetAmount: z.number(),
  progress: z.number(),
  categories: z.array(z.string()),
});

const getParams = async (request: NextRequest) => {
  return request.nextUrl.searchParams;
};

const calculateGoalProgress = (
  transactions: Transaction[],
  targetAmount: number
) => {
  const totalAmount = transactions.reduce((total, transaction) => {
    if (transaction.type === TransactionType.INCOME) {
      return total + transaction.amount;
    } else {
      return total - transaction.amount;
    }
  }, 0);
  return (totalAmount / targetAmount) * 100;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = await getParams(request);
    const completed = searchParams.get("completed");
    const { userId } = auth();

    if (!userId)
      return new Response(JSON.stringify({ error: "Missing user id" }), {
        headers: { "content-type": "application/json" },
        status: 400,
      });

    const goals = await prisma.goal.findMany({
      include: {
        categories: true,
        transactions: true,
      },
      where: {
        userId: userId,
        ...(completed && { completed: completed === "true" }),
      },
    });

    // Calculate progress for each goal
    const goalsWithProgress = goals.map((goal) => ({
      ...goal,
      progress: calculateGoalProgress(goal.transactions, goal.targetAmount),
    }));

    // Update goals to completed if progress is 100%
    const updatedGoals = goalsWithProgress.map((goal) => {
      if (goal.progress === 100) {
        return prisma.goal.update({
          where: {
            id: goal.id,
          },
          data: {
            completed: true,
            progress: goal.progress,
          },
        });
      } else {
        return prisma.goal.update({
          where: {
            id: goal.id,
          },
          data: {
            completed: false,
            progress: goal.progress,
          },
        });
      }
    });

    await Promise.all(updatedGoals);

    return new Response(JSON.stringify(goalsWithProgress), {
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

    const { name, targetAmount, categories } = response.data;

    const { userId } = auth();

    if (!userId)
      return new Response(JSON.stringify({ error: "Missing user id" }), {
        headers: { "content-type": "application/json" },
        status: 400,
      });

    const newGoal = await prisma.goal.create({
      data: {
        name,
        targetAmount,
        categories: {
          create: categories.map((category: string) => ({
            name: category,
          })),
        },
        userId: userId,
      },
    });

    return new Response(JSON.stringify(newGoal), {
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
    const { name, targetAmount, categories } = response.data;
    const { userId } = auth();
    if (!userId)
      return new Response(JSON.stringify({ error: "Missing user id" }), {
        headers: { "content-type": "application/json" },
        status: 400,
      });
    const updatedGoal = await prisma.goal.update({
      where: {
        id: Number(id),
        userId: userId,
      },
      data: {
        name,
        targetAmount,
        categories: {
          create: categories.map((category: string) => ({
            name: category,
          })),
        },
        userId: userId,
      },
    });

    return new Response(JSON.stringify(updatedGoal), {
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
    const removedGoal = await prisma.goal.delete({
      where: {
        id: Number(id),
      },
    });

    return new Response(JSON.stringify(removedGoal), {
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
