import { useEffect, useMemo, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { useRouter } from "next/router";
import Link from "next/link";
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
import { useShallow } from "zustand/react/shallow";
import useSuppliersStore from "@/store/useSuppliersStore";
import AlertConfirm from "./AlertConfirm";
import Image from "next/image";
import { formatTextSlice } from "@/utils/format";

const columns = [
  { key: "logo", label: "Logo" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "number_phone", label: "Number Phone" },
  { key: "address", label: "Address" },
  { key: "action", label: "Action" },
];

function TableSuppliers() {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [supplierIdToDelete, setSupplierIdToDelete] = useState<number | null>(
    null
  );
  const { suppliers, isLoading, fetchSuppliers, deleteSupplier } =
    useSuppliersStore(
      useShallow((state) => ({
        suppliers: state.suppliers,
        isLoading: state.isLoading,
        fetchSuppliers: state.fetchSuppliers,
        deleteSupplier: state.deleteSupplier,
      }))
    );

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  useEffect(() => {
    if (router.query.page) {
      setPage(Number(router.query.page));
    }
  }, [router.query.page]);

  const rowsPerPage = 8;
  const pages = Math.ceil(suppliers.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return suppliers.slice(start, end);
  }, [page, suppliers]);

  const setQueryParams = (key: string, value: number | string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, [key]: value },
    });

    if (key === "page" && typeof value === "number") {
      setPage(value);
    }
  };

  const openDeleteConfirm = (id: number) => {
    setSupplierIdToDelete(id);
    onOpen();
  };

  const confirmDelete = async () => {
    if (supplierIdToDelete !== null) {
      deleteSupplier(supplierIdToDelete);
    }
    onOpenChange();
    setSupplierIdToDelete(null);
  };

  const cancelDelete = () => {
    onOpenChange();
    setSupplierIdToDelete(null);
  };

  return (
    <>
      <div className="w-full py-4 px-6 bg-white shadow-lg rounded-md">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Suppliers Table</h2>
          <div className="w-full h-[1.5px] bg-slate-300 mt-3 mb-4" />
          <div className="flex justify-end">
            <Link href="/suppliers/create">
              <span className="text-xs font-medium bg-sky-500 text-white p-2 rounded  hover:bg-sky-600">
                Insert Supplier
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
                <TableRow key={item.id}>
                  <TableCell className="w-1/12">
                    <Image className="w-full" src={item.logo} alt={item.name} />
                  </TableCell>
                  <TableCell className="w-2/12">
                    <span className="w-full">
                      {formatTextSlice(item.name, 40)}
                    </span>
                  </TableCell>
                  <TableCell className="w-2/12">
                    <span className="w-full">
                      {formatTextSlice(item.email, 40)}
                    </span>
                  </TableCell>
                  <TableCell className="w-2/12">
                    <span className="w-full">{item.number_phone}</span>
                  </TableCell>
                  <TableCell className="w-3/12">
                    <span className="w-full">
                      {formatTextSlice(item.address, 40)}
                    </span>
                  </TableCell>
                  <TableCell className="w-2/12">
                    <div className="flex items-start gap-2 text-lg text-black">
                      <Tooltip content="Detail">
                        <Link href={`/suppliers/${item.id}`}>
                          <AiOutlineEye />
                        </Link>
                      </Tooltip>
                      <Tooltip content="Edit">
                        <Link href={`/suppliers/${item.id}/update`}>
                          <RiEdit2Fill />
                        </Link>
                      </Tooltip>
                      <Tooltip color="danger" content="Delete">
                        <span
                          onClick={() => openDeleteConfirm(item.id)}
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
        text="Are you sure to want to delete this Supplier ?"
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
}

export default TableSuppliers;
