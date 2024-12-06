"use server";

import db from "@/lib/db";

export async function getMoreProducts(page: number) {
  const pageSize = 1;

  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      photo: true,
      created_at: true,
      id: true,
    },
    skip: page * pageSize,
    take: pageSize,
    orderBy: {
      created_at: "desc",
    }
  });

  return products;
}