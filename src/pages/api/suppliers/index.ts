// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { GET, POST } from "@/service/supabase/suppliers";
import SuppliersType from "@/types/suppliers";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: string;
  statusCode: number;
  error: null | true;
  message?: string;
  data?: SuppliersType[] | SuppliersType;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const { data, error, status } = await GET();

    if (error) {
      res.status(status || 500).json({
        status: "error",
        statusCode: status || 500,
        error: true,
        message: error.message,
      });
      return;
    }

    if (data) {
      res.status(200).json({
        status: "success",
        statusCode: 200,
        error: null,
        data,
      });
      return;
    }
  }

  if (req.method === "POST") {
    const { name, number_phone, address, email, logo } = req.body;

    if (!(name && number_phone && address && email && logo)) {
      res.status(400).json({
        status: "error",
        statusCode: 400,
        error: true,
        message: "Invalid request body",
      });
      return;
    }

    const { data, status, error } = await POST({
      name,
      number_phone,
      address,
      email,
      logo,
    });

    if (error) {
      res.status(status || 500).json({
        status: "error",
        statusCode: status || 500,
        error: true,
        message: error.message,
      });
      return;
    }

    if (data) {
      if (data) {
        res.status(201).json({
          status: "success",
          statusCode: 201,
          error: null,
          message: "Suppliers inserted successfully",
          data,
        });
        return;
      }
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).json({
    status: "error",
    statusCode: 405,
    error: true,
    message: `Method ${req.method} Not Allowed`,
  });
}
