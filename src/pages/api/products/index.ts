// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { GET, POST } from "@/service/supabase/products";
import ProductsType from "@/types/products";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: string;
  statusCode: number;
  error: null | true;
  message?: string;
  data?: ProductsType[] | ProductsType;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const { category, stock, price } = req.query;

    if (
      (category && typeof category !== "string") ||
      (stock && typeof stock !== "string") ||
      (price && typeof price !== "string")
    ) {
      res.status(400).json({
        status: "error",
        statusCode: 400,
        error: true,
        message: "Invalid query parameters",
      });
      return;
    }

    const { data, error, status } = await GET(category, stock, price);

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
    const { name, price, category, stock, desc, image } = req.body;

    if (!(name && price && category && stock && desc && image)) {
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
      price,
      category,
      stock,
      desc,
      image,
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
      res.status(201).json({
        status: "success",
        statusCode: 201,
        error: null,
        message: "Product inserted successfully",
        data,
      });
      return;
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
