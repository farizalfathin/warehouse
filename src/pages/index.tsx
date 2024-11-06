import DashCards from "@/components/DashCards";
import DashTitle from "@/components/DashTitle";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-7xl h-full dark:bg-slate-500 mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Dashboard Title */}
          <DashTitle />
          <DashCards />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
