import AlertMessage from "@/components/AlertMessage";
import { Button, Input, Textarea } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

type formSupplierType = {
  name: string;
  number_phone: string;
  address: string;
  email: string;
  logo: string;
};

export default function UpdateSupplier() {
  const router = useRouter();
  const { id } = router.query;
  const [formSupplier, setFormSupplier] = useState<formSupplierType>({
    name: "",
    number_phone: "",
    address: "",
    email: "",
    logo: "",
  });
  const [status, setStatus] = useState<string>("");

  const getDataSupplier = async (id: string) => {
    const response = await fetch(`/api/suppliers/${id}`);
    const { data } = await response.json();

    if (data) {
      setFormSupplier({
        name: data.name,
        number_phone: data.number_phone,
        address: data.address,
        email: data.email,
        logo: data.logo,
      });
    }
  };

  useEffect(() => {
    if (Number(id)) {
      getDataSupplier(String(id));
    }
  }, [id]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormSupplier({
      ...formSupplier,
      [name]: name === "number_phone" ? Number(value) : value,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch(`/api/suppliers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formSupplier),
    });

    const { status } = await response.json();

    if (status === "success") {
      setStatus(status);
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
          <h1>Update Supplier</h1>
          <div className="mt-4 flex flex-col gap-3">
            <Input
              isRequired
              type="text"
              label="Name"
              name="name"
              placeholder="Indofood"
              labelPlacement="outside"
              value={formSupplier.name}
              onChange={handleChange}
            />
            <Input
              isRequired
              type="number"
              label="Number Phone"
              name="number_phone"
              placeholder="08xx"
              labelPlacement="outside"
              value={formSupplier.number_phone}
              onChange={handleChange}
            />
            <Textarea
              isRequired
              type="text"
              label="Address"
              name="address"
              placeholder="Street Oxford, United Kingdom"
              labelPlacement="outside"
              value={formSupplier.address}
              disableAutosize
              onChange={handleChange}
            />
            <Input
              isRequired
              type="email"
              label="Email"
              name="email"
              placeholder="Indofood@gamil.com"
              labelPlacement="outside"
              value={formSupplier.email}
              onChange={handleChange}
            />
            <Input
              isRequired
              type="text"
              label="Logo URL"
              name="logo"
              placeholder="https://example.com/indofood"
              labelPlacement="outside"
              value={formSupplier.logo}
              onChange={handleChange}
            />
            <div className="flex gap-2">
              <Button className="bg-sky-500 text-white" type="submit">
                Update
              </Button>
              <Button className="bg-red-500 text-white" type="reset">
                Reset
              </Button>
              <Link href="/suppliers">
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
        text="Updated Supplier successfully"
        onAction={onConfirm}
      />
    </div>
  );
}
