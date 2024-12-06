"use server";

import db from "@/lib/db";
import {revalidateTag} from "next/cache";
import getSession from "@/lib/session";

export const likePost = async (postId: number) => {
  await new Promise((r) => setTimeout(r, 5000));

  try {
    const session = await getSession();
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });

    revalidateTag(`like-status-${postId}`);

  } catch (e) {
    console.log(e);
  }
};

export const dislikePost = async (postId: number) => {
  await new Promise((r) => setTimeout(r, 5000));

  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });

    revalidateTag(`like-status-${postId}`);

  } catch (e) {
    console.log(e);
  }
};