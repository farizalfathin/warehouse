import { clientSupabase } from "@/config/supabase";

export async function GET() {
    const { data, error, status } = await clientSupabase
        .from("tbl_suppliers")
        .select("*")
        .order("id", { ascending: false });

    return { data, error, status };
}

type POST = {
    name: string;
    number_phone: string;
    address: string;
    email: string;
    logo: string;
}

export async function POST({ name, number_phone, address, email, logo } : POST) {
    const { data, status, error } = await clientSupabase
        .from("tbl_suppliers")
        .insert({ name, number_phone, address, email, logo })
        .select("*")
        .single()

    return { data, status, error };
}