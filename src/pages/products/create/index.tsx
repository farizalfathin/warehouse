import AlertMessage from "@/components/AlertMessage";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { clientSupabase } from "@/config/supabase";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

type formProductType = {
  name: string;
  price: number;
  category: string;
  stock: number;
  desc: string;
  image: any;
};

export default function CreateProduct() {
  const router = useRouter();
  const [formProduct, setFormProduct] = useState<formProductType>({
    name: "",
    price: 0,
    category: "",
    stock: 0,
    desc: "",
    image: "",
  });
  const [status, setStatus] = useState<string>("");

  const handleChange = (event: any) => {
    const { name, value, files } = event.target;
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
      const { data: uploadImage, error: uploadError } =
        await clientSupabase.storage
          .from("imageCatalog")
          .upload(`products/${formProduct.image.name}`, formProduct.image, {
            cacheControl: "3600",
            upsert: true,
          });

      if (uploadError) {
        throw uploadError;
      }

      if (uploadImage) {
        const imageURL = clientSupabase.storage
          .from("imageCatalog")
          .getPublicUrl(`products/${formProduct.image.name}`).data.publicUrl;

        const updatedForm = {
          ...formProduct,
          image: imageURL,
        };

        const { data, error } = await clientSupabase
          .from("tbl_products")
          .insert(updatedForm)
          .select();

        if (data) {
          setStatus("success");
        }
      }
    } catch (e: any) {
      throw new Error(e);
    }
  };

  const onConfirm = () => {
    setStatus("");
    router.push("/suppliers");
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
          <div className="w-full py-4 px-6 bg-white shadow-md rounded-md md:w-2/3 md:mx-auto">
            <form onSubmit={(e) => handleSubmit(e)}>
              <h1>Insert Product</h1>
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
                  type="file"
                  label="Image URL"
                  name="image"
                  labelPlacement="outside"
                  onChange={handleChange}
                />
                <div className="flex gap-2">
                  <Button className="bg-sky-500 text-white" type="submit">
                    Insert
                  </Button>
                  <Button className="bg-red-500 text-white" type="reset">
                    Reset
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
            text="Inserted new Product successfully"
            onAction={onConfirm}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
