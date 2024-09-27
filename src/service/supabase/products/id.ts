import { clientSupabase } from "@/config/supabase";

export async function GET(id: string) {
  const { data, error, status } = await clientSupabase
    .from("tbl_products")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error, status };
}

type PUT = {
  id: string;
  name: string;
  price: string;
  category: string;
  stock: string;
  desc: string;
  image: string;
};

export async function PUT({
  id,
  name,
  price,
  category,
  stock,
  desc,
  image,
}: PUT) {
  const { data, error, status } = await clientSupabase
    .from("tbl_products")
    .update({ name, price, category, stock, desc, image })
    .eq("id", id)
    .select("*")
    .single();

  return { data, error, status };
}

export async function DELETE(id: string) {
  const { data, error, status } = await clientSupabase
    .from("tbl_products")
    .delete()
    .eq("id", id)
    .select("*")
    .single();

  return { data, error, status };
}
