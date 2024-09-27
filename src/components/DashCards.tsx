import useCountProducts from "@/hooks/useCountProducts";
import { Card, CardBody, CardFooter, Skeleton } from "@nextui-org/react";
import Link from "next/link";
import { ElementType, ReactNode } from "react";
import { FaSitemap, FaUsers } from "react-icons/fa";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { RxComponent1 } from "react-icons/rx";

export default function DashCards() {
  const {
    totalCount: { foods, drinks, products },
    status,
  } = useCountProducts();

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {foods > 0 && drinks > 0 && products > 0 ? (
        <>
          <CardItem
            bgColor="bg-green-500"
            Icon={FaSitemap}
            count={products}
            title="Total All Products">
            View All Products
          </CardItem>
          <CardItem
            bgColor="bg-red-500"
            Icon={FaSitemap}
            count={foods}
            title="Total Products Food">
            View Products Food
          </CardItem>
          <CardItem
            bgColor="bg-yellow-500"
            Icon={RxComponent1}
            count={drinks}
            title="Total Products Drink">
            View Products Drink
          </CardItem>
        </>
      ) : (
        <>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </>
      )}
    </div>
  );
}

type CardType = {
  bgColor: string;
  Icon: ElementType;
  title: string;
  count: number;
  children: ReactNode;
};

function CardItem({ bgColor, Icon, title, count, children }: CardType) {
  return (
    <Card
      className={`relative ${bgColor} text-white flex flex-col justify-end pt-10 rounded-lg shadow-lg`}>
      <div className="absolute top-0 right-1 opacity-25 text-8xl">
        <Icon />
      </div>
      <CardBody className="py-2 px-4">
        <h4 className="text-3xl font-bold">{count}</h4>
        <p className="text-lg">{title}</p>
      </CardBody>
      <CardFooter className="px-1 py-2 bg-black bg-opacity-10 rounded-b-lg group">
        <Link
          href="#"
          className="w-full flex justify-center items-center gap-2">
          <span className="text-sm gap-2 group-hover:italic group-hover:font-semibold">
            {children}
          </span>
          <span className="text-lg">
            <IoIosArrowDroprightCircle />
          </span>
        </Link>
      </CardFooter>
    </Card>
  );
}

function CardSkeleton() {
  return (
    <Card className="w-full h-[9.5rem] bg-slate-100 border shadow-none rounded-lg flex justify-end">
      <Skeleton className="w-16 mb-2 mx-2 rounded-full">
        <div className="w-full h-7 bg-slate-300" />
      </Skeleton>
      <Skeleton className="w-36 mb-2 mx-2 rounded-full">
        <div className="w-full h-6 bg-slate-300" />
      </Skeleton>
      <Skeleton>
        <div className="w-full h-9 bg-slate-300 rounded-b-lg" />
      </Skeleton>
    </Card>
  );
}
