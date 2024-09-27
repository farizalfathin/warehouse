import { clientSupabase } from "@/config/supabase";
import parseQueryParamWithOperator from "@/service/handleRequestAPI/parseQueryParams";

export async function GET(category?: string, stock?: string, price?: string) {
  let query = clientSupabase
    .from("tbl_products")
    .select("*")
    .order("id", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  if (price) {
    const { operator, value } = parseQueryParamWithOperator(price);
    switch (operator) {
      case "<":
        query = query.lt("price", value);
        break;
      case "<=":
        query = query.lte("price", value);
        break;
      case ">":
        query = query.gt("price", value);
        break;
      case ">=":
        query = query.gte("price", value);
        break;
      default:
        query = query.eq("price", value);
        break;
    }
  }

  if (stock) {
    const { operator, value } = parseQueryParamWithOperator(stock);
    switch (operator) {
      case "<":
        query = query.lt("stock", value);
        break;
      case "<=":
        query = query.lte("stock", value);
        break;
      case ">":
        query = query.gt("stock", value);
        break;
      case ">=":
        query = query.gte("stock", value);
        break;
      default:
        query = query.eq("stock", value);
        break;
    }
  }

  const { data, error, status } = await query;

  return { data, error, status };
}

type POST = {
  name: string;
  price: string;
  category: string;
  stock: string;
  desc: string;
  image: string;
};

export async function POST({
  name,
  price,
  category,
  stock,
  desc,
  image,
}: POST) {
  const { data, status, error } = await clientSupabase
    .from("tbl_products")
    .insert({ name, price, category, stock, desc, image })
    .select("*")
    .single();

  return { data, status, error };
}
