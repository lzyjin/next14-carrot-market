import db from "@/lib/db";
import ProductList from "@/components/product-list";
import {Prisma} from "@prisma/client";
import Link from "next/link";
import {PlusIcon} from "@heroicons/react/16/solid";
import {revalidatePath, unstable_cache as nextCache} from "next/cache";

export const metadata = {
  title: "home",
};

// export const dynamic = "force-dynamic";
export const revalidate = 60;

const getCachedProducts = nextCache(getInitialProducts, ["home-products"]);

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      photo: true,
      created_at: true,
      id: true,
    },
    // take: 1,
    orderBy: {
      created_at: "desc",
    }
  });

  console.log("hit!");

  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<typeof getInitialProducts>;

export default async function Products() {
  // const initialProducts = await getCachedProducts();
  const initialProducts = await getInitialProducts();

  const revalidate = async () => {
    "use server";

    revalidatePath("/home");
  };

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <form action={revalidate}>
        <button>Revalidate</button>
      </form>
      <Link
        href="/products/add"
        className="bg-orange-500 text-white flex justify-center items-center rounded-full
          size-16 fixed right-8 bottom-24 transition-colors hover:bg-orange-400
        ">
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}