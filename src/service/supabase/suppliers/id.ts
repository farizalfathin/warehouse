import { clientSupabase } from "@/config/supabase";

export async function GET(id: string) {
  const { data, status, error } = await clientSupabase
    .from("tbl_suppliers")
    .select("*")
    .eq("id", id)
    .single();

  return { data, status, error };
}

type PUT = {
  id: string;
  name: string;
  number_phone: string;
  address: string;
  email: string;
  logo: string;
};

export async function PUT({
  id,
  name,
  number_phone,
  address,
  email,
  logo,
}: PUT) {
  const { data, status, error } = await clientSupabase
    .from("tbl_suppliers")
    .update({ name, number_phone, address, email, logo })
    .eq("id", id)
    .select("*")
    .single();

  return { data, status, error };
}

export async function DELETE(id: string) {
  const { data, status, error } = await clientSupabase
    .from("tbl_suppliers")
    .delete()
    .eq("id", id)
    .select("*")
    .single();

  return { data, status, error };
}
