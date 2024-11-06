import AlertMessage from "@/components/AlertMessage";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { clientSupabase } from "@/config/supabase";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/user";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function EditUser() {
  const { user } = useAuth();
  const router = useRouter();
  const [formProfile, setFormProfile] = useState<Omit<User, "id">>({
    username: user?.username || "",
    full_name: user?.full_name || "",
    avatar_url: user?.avatar_url || "",
    email: user?.email || "",
    role: user?.role || "",
    number_phone: user?.number_phone || "",
  });
  const [newImage, setNewImage] = useState<{ preview: string; set: any }>({
    preview: "",
    set: {},
  });
  const [status, setStatus] = useState<string>("");

  const handleChange = (event: any) => {
    const { name, value, files } = event.target;

    if (name === "image") {
      const previewImage = URL.createObjectURL(files[0]);
      setNewImage({ preview: previewImage, set: files[0] });
    } else {
      setFormProfile({
        ...formProfile,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (newImage.preview.length === 0) {
        const { data: updatedProduct } = await clientSupabase
          .from("profiles")
          .update(formProfile)
          .eq("id", user?.id)
          .select();

        if (updatedProduct) {
          setStatus("success");
        } else {
          alert("tidak berhasil");
        }
      } else {
        const removeURLImage = formProfile.avatar_url?.replace(
          "https://ftiuevfqtgwqzungcrhh.supabase.co/storage/v1/object/public/imageCatalog/avatars/",
          ""
        );

        const { data: deleteImage } = await clientSupabase.storage
          .from("imageCatalog")
          .remove([`avatars/${removeURLImage}`]);

        if (deleteImage) {
          const { data: updateImage } = await clientSupabase.storage
            .from("imageCatalog")
            .upload(`avatars/${newImage.set.name}`, newImage.set, {
              cacheControl: "3600",
              upsert: true,
            });

          if (updateImage) {
            const { data } = await clientSupabase
              .from("profiles")
              .update({
                ...formProfile,
                avatar_url: `https://ftiuevfqtgwqzungcrhh.supabase.co/storage/v1/object/public/imageCatalog/avatars/${newImage.set.name}`,
              })
              .eq("id", user?.id)
              .select("*");

            if (data) {
              setStatus("success");
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
    router.push("/user");
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
          <div className="w-full py-4 px-6 bg-white shadow-md rounded-md md:w-2/3 md:mx-auto">
            <form onSubmit={(e) => handleSubmit(e)}>
              <h1>Update profile</h1>
              <div className="mt-4 flex flex-col gap-3">
                <Input
                  isRequired
                  type="text"
                  label="Username"
                  name="username"
                  placeholder="john_doe"
                  labelPlacement="outside"
                  value={formProfile.username || ""}
                  onChange={handleChange}
                />
                <Input
                  isRequired
                  type="text"
                  label="Fullname"
                  name="full_name"
                  placeholder="John Doe"
                  labelPlacement="outside"
                  value={formProfile.full_name || ""}
                  onChange={handleChange}
                />
                <Input
                  isRequired
                  type="text"
                  label="Email"
                  name="email"
                  placeholder="johndoe@gmail.com"
                  labelPlacement="outside"
                  value={formProfile.email || ""}
                  onChange={handleChange}
                />
                <Input
                  isRequired
                  type="number"
                  label="No Telp"
                  name="number_phone"
                  labelPlacement="outside"
                  value={formProfile.number_phone || ""}
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
                <Image
                  src={newImage.preview || formProfile.avatar_url || ""}
                  width={0}
                  height={0}
                  sizes="100vw"
                  alt="Image Preview"
                  className="mt-2 w-12"
                />
                <div className="flex gap-2">
                  <Button className="bg-sky-500 text-white" type="submit">
                    Update
                  </Button>
                  <Link href="/user">
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
            text="Updated User Profile successfully"
            onAction={onConfirm}
          />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
