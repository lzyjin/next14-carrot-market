"use server";

import {z} from "zod";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import {redirect} from "next/navigation";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    }
  });

  return user;
};

const formSchema = z.object({
  email: z.string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "An account with this email does not exist."),
  password: z.string({
    required_error: "Password is required"
  })
    // .min(PASSWORD_MIN_LENGTH)
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
});

export async function login(_: never, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = await formSchema.spa(data);

  if(!result.success) {
    return result.error.flatten();
  } else {
    // 1. find a user with the email - done
    // 2. if the user is found, check the password hash - done
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        password: true,
        id: true,
      },
    });

    const ok = await bcrypt.compare(result.data.password, user!.password ?? "xxxx");

    if (ok) {
      // 3. log the user in
      const session = await getSession();

      session.id = user!.id;

      await session.save();

      // 4. redirect "/profile"
      redirect("/profile");

    } else {
      return {
        fieldErrors: {
          password: ["Wrong password"],
          email: [],
        },
      };
    }
  }
}
