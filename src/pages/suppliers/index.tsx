import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import TableSuppliers from "@/components/TableSuppliers";

export default function Suppliers() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
          <TableSuppliers />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
