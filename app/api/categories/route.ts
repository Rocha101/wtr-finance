import prisma from "@/app/utils/prisma";
import { NextRequest } from "next/server";

const getParams = async (request: NextRequest) => {
  return request.nextUrl.searchParams;
};

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({});

    return new Response(JSON.stringify(categories), {
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

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = await getParams(request);
    const id = searchParams.get("id");
    if (!id)
      return new Response(JSON.stringify({ error: "Missing id" }), {
        headers: { "content-type": "application/json" },
        status: 400,
      });
    const removedCategory = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });

    return new Response(JSON.stringify(removedCategory), {
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
