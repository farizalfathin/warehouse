// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { clientSupabase } from "@/config/supabase";
import ProductsType from "@/types/products";
import type { NextApiRequest, NextApiResponse } from "next";

type SosmedDeveloperType = {
    website: string;
    github: string;
    linkedin: string;
    instagram: string;
}

type Data = {
    title: string;
    developer: string;
    message: string;
    sosmed: SosmedDeveloperType;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
    res.status(200).json({ 
        title: 'Warehouse API',
        developer: 'Fariz Alfathin Fayi',
        message: 'Selamat Datang di Warehouse API, Silahkan berlatih fetching API dengan API Public kami',
        sosmed: {
            website: '',
            github: '',
            linkedin: '',
            instagram: '',
        }
    });
}
