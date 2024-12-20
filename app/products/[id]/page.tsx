import {notFound} from "next/navigation";
import db from "@/lib/db";
import Link from "next/link";
import {formatToWon} from "@/lib/utils";
import {UserIcon} from "@heroicons/react/16/solid";
import Image from "next/image";
import {revalidateTag, unstable_cache as nextCache} from "next/cache";

export async function generateMetadata({params}: { params: {id: string} }) {
  const product = await getCachedProductTitle(Number(params.id));

  return {
    title: product?.title,
  }
}

async function getIsOwner(userId: number) {
  console.log(userId);
  // const session = await getSession();
  //
  // if (session.id) {
  //   return session.id === userId;
  // }

  return false;
}

async function getProduct(id: number) {
  console.log("product");

  const product = db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return product;
}

const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail", "xxx"]
});

async function getProductTitle(id: number) {
  console.log("title");

  const product = db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });

  return product;
}

const getCachedProductTitle = nextCache(getProductTitle, ["product-title"], {
  tags: ["product-title", "xxx"]
});

export default async function ProductDetail({params}: { params: {id: string} }) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return notFound();
  }

  const product = await getCachedProduct(id);

  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

  const revalidate = async () => {
    "use server";

    revalidateTag("xxx");
  };

  return (
    <div>
      <div className="relative aspect-square overflow-hidden">
        <Image src={`${product.photo}/width=500,height=500`} alt={product.title} className="object-cover" fill  />
      </div>

      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 rounded-full overflow-hidden">
          {
            product.user.avatar !== null ?
            <Image src={product.user.avatar} alt={product.user.username} width={40} height={40} /> :
            <UserIcon className="size-10" />
          }
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>

      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>

      <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">{formatToWon(product.price)}원</span>
        {/*<div>*/}
        <div className="flex items-center gap-2">
          {
            isOwner
            ?
            // <Link href={``} className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold mr-3">Delete product</Link>
            <form action={revalidate}>
              <button
                className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold mr-3">
                Revalidate title cache
              </button>
            </form>
            :
            null
          }
          <Link href={``} className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">채팅하기</Link>
        </div>
      </div>
    </div>
  );
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: {
      id: true,
    },
  });

  return products.map(product => ( {id: product.id + ""} ));
}