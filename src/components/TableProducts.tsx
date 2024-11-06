import { useEffect, useMemo, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { useRouter } from "next/router";
import Link from "next/link";
import { formatCurrency, formatTextSlice } from "@/utils/format";
import {
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import useProductsStore from "@/store/useProductsStore";
import { useShallow } from "zustand/react/shallow";
import FilterProductsDrawer from "./FilterProductsDrawer";
import AlertConfirm from "./AlertConfirm";
import Image from "next/image";

const columns = [
  { key: "image", label: "Image" },
  { key: "name", label: "Name" },
  { key: "price", label: "Price" },
  { key: "category", label: "Category" },
  { key: "stock", label: "Stock" },
  { key: "desc", label: "Description" },
  { key: "action", label: "Action" },
];

function TableProducts() {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(
    null
  );
  const { products, isLoading, fetchProducts, deleteProduct } =
    useProductsStore(
      useShallow((state) => ({
        products: state.products,
        isLoading: state.isLoading,
        fetchProducts: state.fetchProducts,
        deleteProduct: state.deleteProduct,
      }))
    );
  const [search, setSearch] = useState<string>("");

  const filterProductsByQueryParams = useMemo(() => {
    let query = "";

    if (router.query.category) {
      query += query
        ? `&category=${router.query.category}`
        : `?category=${router.query.category}`;
    }

    return query;
  }, [router.query.category]);

  useEffect(() => {
    fetchProducts(filterProductsByQueryParams);
  }, [fetchProducts, filterProductsByQueryParams]);

  useEffect(() => {
    if (router.query.page) {
      setPage(Number(router.query.page));
    }
  }, [router.query.page]);

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
  };

  const filteredItem = useMemo(() => {
    return products.filter((product) => {
      product.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [products, search]);

  const rowsPerPage = 8;
  const pages = Math.ceil(filteredItem?.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItem?.slice(start, end);
  }, [page, filteredItem]);

  const setQueryParams = (key: string, value: string | number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, [key]: value },
    });

    if (key === "page" && typeof value === "number") {
      setPage(value);
    }
  };

  const removeAllQueryParams = () => {
    router.push(
      {
        pathname: router.pathname,
        query: {}, // Kosongkan query
      },
      undefined,
      { shallow: true }
    );
  };

  const onOpenDeleteConfirm = (id: number) => {
    setProductIdToDelete(id);
    onOpen();
  };

  const onConfirmDelete = async () => {
    if (productIdToDelete !== null) {
      deleteProduct(productIdToDelete);
    }
    onOpenChange();
    setProductIdToDelete(null);
  };

  const onCancelDelete = () => {
    onOpenChange();
    setProductIdToDelete(null);
  };

  return (
    <>
      <div className="w-full py-4 px-6 bg-white shadow-lg rounded-md">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Products Table</h2>
          <div className="w-full h-[1.5px] bg-slate-300 mt-3 mb-4" />
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg"
              onChange={handleSearch}
            />
            <FilterProductsDrawer
              setFilter={setQueryParams}
              resetFilter={removeAllQueryParams}
            />
            <Link href="/products/create">
              <span className="text-xs font-medium bg-green-500 text-white p-2 rounded  hover:bg-green-600">
                Insert Product
              </span>
            </Link>
          </div>
        </div>
        {isLoading ? (
          <div className="w-full h-64 flex items-center justify-center">
            <Spinner label="Loading..." color="primary" />
          </div>
        ) : (
          <Table
            className="flex flex-col items-center text-sm font-medium"
            classNames={{ wrapper: "min-h-[222px]" }}
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={(page) => setQueryParams("page", page)}
                />
              </div>
            }>
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={items}>
              {(item) => (
                <TableRow key={item?.id}>
                  <TableCell className="w-1/12">
                    <Image
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="w-full"
                      src={item?.image}
                      alt={item?.name}
                    />
                  </TableCell>
                  <TableCell className="w-2/12">
                    <span className="w-full">
                      {formatTextSlice(item?.name, 40)}
                    </span>
                  </TableCell>
                  <TableCell className="w-1/12">
                    <span className="w-full">
                      {formatCurrency(item?.price)}
                    </span>
                  </TableCell>
                  <TableCell className="w-1/12">
                    <span className="w-full">{item?.category}</span>
                  </TableCell>
                  <TableCell className="w-1/12">
                    <span className="w-full">{item?.stock}</span>
                  </TableCell>
                  <TableCell className="w-4/12 pe-2">
                    <span className="w-full">
                      {formatTextSlice(item?.desc, 40)}
                    </span>
                  </TableCell>
                  <TableCell className="w-2/12">
                    <div className="flex items-start gap-2 text-lg text-black">
                      <Tooltip content="Detail">
                        <Link href={`/products/${item.id}`}>
                          <AiOutlineEye />
                        </Link>
                      </Tooltip>
                      <Tooltip content="Edit">
                        <Link href={`/products/${item.id}/update`}>
                          <RiEdit2Fill />
                        </Link>
                      </Tooltip>
                      <Tooltip color="danger" content="Delete">
                        <span
                          onClick={() => onOpenDeleteConfirm(item.id)}
                          className="cursor-pointer text-red-500">
                          <MdDelete />
                        </span>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <AlertConfirm
        isOpen={isOpen}
        title="Confirm Delete"
        text="Are you sure to want to delete this product ?"
        onClose={onCancelDelete}
        onConfirm={onConfirmDelete}
      />
    </>
  );
}

export default TableProducts;
