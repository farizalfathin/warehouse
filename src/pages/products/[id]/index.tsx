import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProductsType from "@/types/products";
import { formatCurrency } from "@/utils/format";
import { Card, CardBody, Skeleton } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DetailProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<ProductsType>();

  const getDataProduct = async (id: string) => {
    const response = await fetch(`/api/products/${id}`);
    const { data } = await response.json();

    if (data) {
      setProduct(data);
    }
  };

  useEffect(() => {
    if (Number(id)) {
      getDataProduct(String(id));
    }
  }, [id]);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
          {product ? (
            <Card className="w-full max-w-screen-md mx-auto bg-white shadow-md rounded-md">
              <CardBody className="flex flex-col sm:flex-row gap-6 p-4">
                <div className="w-full sm:w-1/3 flex justify-center">
                  <div className="w-full rounded-md bg-gray-100 shadow-md sm:shadow-lg">
                    <Image
                      src={product?.image}
                      alt={product?.name}
                      className="w-full rounded-md"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-2/3">
                  <div className="flex flex-col items-start py-4">
                    <h1 className="text-2xl text-black font-semibold">
                      {product?.name}
                      <span className="text-slate-500 text-sm">
                        {" "}
                        ( {product?.category} )
                      </span>
                    </h1>
                    <p className="font-medium text-slate-500">
                      Stock {product?.stock}
                    </p>
                    <h2 className="text-4xl text-black font-bold">
                      {formatCurrency(Number(product?.price))}
                    </h2>
                    <div className="w-full h-[1.5px] bg-slate-300 my-3" />
                    <p>{product?.desc}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ) : (
            <SkeletonProduct />
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

function SkeletonProduct() {
  return (
    <Card className="w-full max-w-screen-md mx-auto bg-gray-100 shadow-lg rounded-md">
      <CardBody className="flex flex-col sm:flex-row gap-6 p-4">
        <div className="w-full flex justify-center sm:w-1/3">
          <Skeleton className="w-full rounded-md">
            <div className="w-full h-60" />
          </Skeleton>
        </div>
        <div className="w-full sm:w-2/3">
          <div className="flex flex-col items-start py-4">
            <Skeleton className="rounded-full mb-2">
              <div className="w-32 h-6" />
            </Skeleton>
            <Skeleton className="rounded-full mb-2">
              <div className="w-20 h-4" />
            </Skeleton>
            <Skeleton className="rounded-full mb-6">
              <div className="w-40 h-10" />
            </Skeleton>
            <Skeleton className="rounded-full mb-2">
              <div className="w-72 h-4" />
            </Skeleton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
