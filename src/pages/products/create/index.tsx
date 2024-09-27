import AlertMessage from "@/components/AlertMessage";
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
  image: string;
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
    const { name, value } = event.target;
    setFormProduct({
      ...formProduct,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formProduct),
    });

    const { status } = await response.json();

    if (status === "success") {
      setStatus("success");
    }
  };

  const onConfirm = () => {
    setStatus("");
    router.push("/suppliers");
  };

  return (
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
  );
}
