import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import TableProducts from "@/components/TableProducts";

export default function Products() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
          <TableProducts />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
