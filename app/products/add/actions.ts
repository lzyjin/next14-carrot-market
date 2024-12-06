"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import {redirect} from "next/navigation";
import {productSchema} from "@/app/products/add/schema";

export async function uploadProduct(formData: FormData) {
  const data = {
    title: formData.get("title"),
    photo: formData.get("photo"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  const result = productSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();

  } else {
    const session = await getSession();

    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          photo: result.data.photo,
          price: result.data.price,
          description: result.data.description,
          user: {
            connect:{
              id: session.id,
            }
          }
        },
        select: {
          id: true,
        },
      });

      redirect(`/products/${product.id}`);
      // redirect(`/home`);
    }
  }
}

export async function getUploadUrl() {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`
    }
  });

  const data = await response.json();
  return data;
}