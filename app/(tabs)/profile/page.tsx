import db from "@/lib/db";
import getSession from "@/lib/session";
import {notFound, redirect} from "next/navigation";
import {Suspense} from "react";

async function getUser() {
  const session = await getSession();

  if (session.id) {
    const user = db.user.findUnique({
      where: {
        id: session.id,
      },
    });

    if (user) {
      return user;
    }
  }

  notFound();
}

async function Username() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const user = await getUser();

  return <h1>welcome! {user?.username}</h1>;
}

export default async function Profile() {
  const user = await getUser();

  const logOut = async () => {
    "use server";

    const session = await getSession();
    session.destroy();
    redirect("/");
  };

  return (
    <div>
      <Suspense fallback={"Welcome!"}>
        <Username />
      </Suspense>
      <form action={logOut}>
        <button>Log out</button>
      </form>
    </div>
  );
}