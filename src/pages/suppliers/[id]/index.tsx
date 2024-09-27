import SuppliersType from "@/types/suppliers";
import { Card, CardBody, Skeleton } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DetailSupplier() {
  const router = useRouter();
  const { id } = router.query;
  const [supplier, setSupplier] = useState<SuppliersType>();

  const getDataSupplier = async (id: string) => {
    const response = await fetch(`/api/suppliers/${id}`);
    const { data } = await response.json();

    if (data) {
      setSupplier(data);
    }
  };

  useEffect(() => {
    if (Number(id)) {
      getDataSupplier(String(id));
    }
  }, [id]);

  return (
    <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
      {supplier ? (
        <Card className="w-full max-w-screen-md mx-auto bg-white shadow-md rounded-md">
          <CardBody className="flex flex-col sm:flex-row gap-6 p-4">
            <div className="w-full sm:w-1/3 flex justify-center">
              <div className="w-full rounded-md bg-gray-100 shadow-md sm:shadow-lg">
                <Image
                  src={supplier?.logo}
                  alt={supplier?.name}
                  className="w-full rounded-md"
                />
              </div>
            </div>
            <div className="w-full sm:w-2/3">
              <div className="flex flex-col items-start py-4">
                <h1 className="text-2xl text-black font-semibold">
                  {supplier?.name}
                </h1>
                <p className="text-lg font-medium text-slate-700">
                  Number Phone : {supplier?.number_phone}
                </p>
                <p className="text-lg text-slate-700">
                  Email : {supplier?.email}
                </p>
                <p className="text-lg text-slate-700">
                  Alamat : {supplier?.address}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <SkeletonSupplier />
      )}
    </div>
  );
}

function SkeletonSupplier() {
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
