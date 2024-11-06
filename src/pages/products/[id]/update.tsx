import AlertMessage from "@/components/AlertMessage";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { clientSupabase } from "@/config/supabase";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

type formProductType = {
  name: string;
  price: number;
  category: string;
  stock: number;
  desc: string;
  image: string;
};

export default function UpdateProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [formProduct, setFormProduct] = useState<formProductType>({
    name: "",
    price: 0,
    category: "",
    stock: 0,
    desc: "",
    image: "",
  });
  const [newImage, setNewImage] = useState<{ preview: string; set: any }>({
    preview: "",
    set: {},
  });
  const [status, setStatus] = useState<string>("");

  const getDataProduct = async (id: string) => {
    const response = await fetch(`/api/products/${id}`);
    const { data } = await response.json();

    if (data) {
      setFormProduct({
        name: data.name,
        price: data.price,
        category: data.category,
        stock: data.stock,
        desc: data.desc,
        image: data.image,
      });
    }
  };

  useEffect(() => {
    if (Number(id)) {
      getDataProduct(String(id));
    }
  }, [id]);

  const handleChange = (event: any) => {
    const { name, value, files } = event.target;

    if (name === "image") {
      const previewImage = URL.createObjectURL(files[0]);
      setNewImage({ preview: previewImage, set: files[0] });
    }

    setFormProduct({
      ...formProduct,
      [name]:
        name === "price" || name === "stock"
          ? Number(value)
          : name === "image"
          ? files[0]
          : value,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (newImage.preview.length === 0) {
        const { data: updatedProduct } = await clientSupabase
          .from("tbl_products")
          .update(formProduct)
          .eq("id", id)
          .select();

        if (updatedProduct) {
          setStatus(status);
        } else {
          alert("tidak berhasil");
        }
      } else {
        const removeURLImage = formProduct.image.replace(
          "https://ftiuevfqtgwqzungcrhh.supabase.co/storage/v1/object/public/imageCatalog/products/",
          ""
        );

        const { data: deleteImage } = await clientSupabase.storage
          .from("imageCatalog")
          .remove([`products/${removeURLImage}`]);

        if (deleteImage) {
          const { data: updateImage } = await clientSupabase.storage
            .from("imageCatalog")
            .upload(`products/${newImage.set.name}`, newImage.set, {
              cacheControl: "3600",
              upsert: true,
            });

          if (updateImage) {
            const { data } = await clientSupabase
              .from("tbl_products")
              .update({
                ...formProduct,
                image: `https://ftiuevfqtgwqzungcrhh.supabase.co/storage/v1/object/public/imageCatalog/products/${newImage.set.name}`,
              })
              .eq("id", id)
              .select("*");

            if (data) {
              setStatus(status);
            }
          }
        }
      }
    } catch (e: any) {
      throw new Error(e);
    }
  };

  const onConfirm = () => {
    setStatus("");
    router.push("/products");
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
          <div className="w-full py-4 px-6 bg-white shadow-md rounded-md md:w-2/3 md:mx-auto">
            <form onSubmit={(e) => handleSubmit(e)}>
              <h1>Update Product</h1>
              <div className="mt-4 flex flex-col gap-3">
                <Input
                  isRequired
                  type="text"
                  label="Name"
                  name="name"
                  placeholder="Chunky Bar"
                  labelPlacement="outside"
                  value={formProduct.name}
                  onChange={handleChange}
                />
                <Input
                  isRequired
                  type="number"
                  label="Price"
                  name="price"
                  placeholder="0.00"
                  labelPlacement="outside"
                  value={String(formProduct.price)}
                  onChange={handleChange}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">Rp.</span>
                    </div>
                  }
                />
                <Select
                  isRequired
                  name="category"
                  items={[
                    { key: "Makanan", value: "Makanan" },
                    { key: "Minuman", value: "Minuman" },
                  ]}
                  label="Category"
                  placeholder="Select a category"
                  labelPlacement="outside"
                  className="max-w-xs"
                  onChange={handleChange}>
                  {(item) => (
                    <SelectItem key={item.key} value={item.key}>
                      {item.value}
                    </SelectItem>
                  )}
                </Select>
                <Input
                  isRequired
                  type="number"
                  label="Stock"
                  name="stock"
                  placeholder="00"
                  labelPlacement="outside"
                  value={String(formProduct.stock)}
                  onChange={handleChange}
                />
                <Textarea
                  isRequired
                  type="text"
                  label="Description"
                  name="desc"
                  placeholder="Chunky Bar is more delicious"
                  labelPlacement="outside"
                  value={formProduct.desc}
                  onChange={handleChange}
                />
                <Input
                  isRequired
                  type="text"
                  label="Image URL"
                  name="image"
                  placeholder="https://example.com/ChunkyBar"
                  labelPlacement="outside"
                  value={formProduct.image}
                  onChange={handleChange}
                />
                <div className="flex gap-2">
                  <Button className="bg-sky-500 text-white" type="submit">
                    Update
                  </Button>
                  <Link href="/products">
                    <Button className="bg-green-500 text-white" type="button">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </div>
            </form>
          </div>

          <AlertMessage
            isOpen={status ? true : false}
            title="Success"
            text="Updated Product successfully"
            onAction={onConfirm}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
