// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { DELETE, GET, PUT } from "@/service/supabase/suppliers/id";
import SuppliersType from "@/types/suppliers";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: string;
  statusCode: number;
  error: null | true;
  message?: string;
  data?: SuppliersType;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;

  if (!(id && Number(id))) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      error: true,
      message: "Invalid required parameter",
    });
    return;
  }

  const stringId = String(id);

  if (req.method === "GET") {
    const { data, error, status } = await GET(stringId);

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

  if (req.method === "PUT") {
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

    const { data, error, status } = await PUT({
      id: stringId,
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
      res.status(200).json({
        status: "success",
        statusCode: 200,
        error: null,
        message: "Supplier updated successfully",
        data,
      });
      return;
    }
  }

  if (req.method === "DELETE") {
    const { data, error, status } = await DELETE(stringId);

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
        message: "Supplier delected successfully",
      });
      return;
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).json({
    status: "error",
    statusCode: 405,
    error: true,
    message: `Method ${req.method} Not Allowed`,
  });
}
