"use client";

import ListProduct from "@/components/list-product";
import {InitialProducts} from "@/app/(tabs)/home/page";
import {useEffect, useRef, useState} from "react";
import {getMoreProducts} from "@/app/(tabs)/home/actions";

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({initialProducts}: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        const element = entries[0];

        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);

          setIsLoading(true);

          const newProducts = await getMoreProducts(page + 1);

          if (newProducts.length !== 0) {
            setPage(prev => prev + 1);
            setProducts(prev => [...prev, ...newProducts]);
            setIsLoading(false);
          } else {
            setIsLastPage(true);
          }
        }
    }, {
        threshold: 1.0, // 1.0: 100%. trigger가 100% 표시될 때까지 기다림
        // rootMargin: "0px 0px -100px 0px", // IntersectionObserver가 보고 있는 컨테이너에 마진을 설정
      });

    if (trigger.current) {
      observer.observe(trigger.current);
    }

    // clean up function
    // 사용자가 페이지를 떠날 때 실행됨
    // 즉 이 컴포넌트가 unmount될 때, 컴포넌트가 제거될 때
    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className="p-5 flex flex-col gap-5">
      {
        products.map(product => (
          <ListProduct key={product.id} {...product} />
        ))
      }
      {/*{*/}
      {/*  !isLastPage ?*/}
      {/*    <span*/}
      {/*      ref={trigger}*/}
      {/*      style={{*/}
      {/*        marginTop: `${(page + 1) * 300}vh`,*/}
      {/*      }}*/}
      {/*      className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md*/}
      {/*        hover:opacity-90 active:scale-95*/}
      {/*        mb-96">*/}
      {/*      { isLoading ? "로딩중" : "Load more" }*/}
      {/*    </span>*/}
      {/*    :*/}
      {/*    null*/}
      {/*}*/}
    </div>
  );
}