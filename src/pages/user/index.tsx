import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

export default function User() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="w-full px-4 py-6">
          <div className="w-full max-w-[480px] flex flex-col items-center p-4 mx-auto shadow-md rounded-md bg-gradient-to-r from-sky-600 to-sky-300">
            <Image
              className="size-32 object-cover object-center rounded-full"
              width={0}
              height={0}
              sizes="100vw"
              src={user?.avatar_url || ""}
              alt={user?.full_name + " avatar"}
            />
            <h1 className="text-2xl font-medium text-white mt-2">
              {user?.username}
            </h1>
            <p className="text-sm text-slate-100">
              fullname: {user?.full_name}
            </p>
            <p className="text-sm text-slate-100">email: {user?.email}</p>
            <p className="text-sm text-slate-100">role: {user?.role}</p>
            <p className="text-sm text-slate-100">
              no.telp:{user?.number_phone}
            </p>
            <Link
              href="/user/edit"
              className="bg-green-400 text-slate-100 px-3 py-1 rounded-full mt-4 shadow">
              Edit
            </Link>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
