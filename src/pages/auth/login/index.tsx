import { clientSupabase } from "@/config/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Input,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { IoMail } from "react-icons/io5";

type Login = {
  email: string;
  password: string;
};

export default function Login() {
  const { isAuth } = useAuth();
  const { push } = useRouter();
  const [loginData, setLoginData] = useState<Login>({
    email: "",
    password: "",
  });
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    if (isAuth) {
      push("/");
    }
  }, [isAuth, push]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const { data } = await clientSupabase.auth.signInWithPassword({
        ...loginData,
      });

      if (data) {
        alert("Berhasil terkirim");
        push("/");
      }
    } catch (e: any) {
      throw new Error(e);
    }
  };

  return (
    <main className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-screen-sm py-6 px-4 sm:px-6 lg:px-8">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader className="flex flex-col gap-1">Log in</CardHeader>
            <CardBody>
              <Input
                autoFocus
                endContent={
                  <IoMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                variant="bordered"
              />
              <Input
                name="password"
                value={loginData.password}
                onChange={handleChange}
                variant="bordered"
                placeholder="Enter your password"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility">
                    {isVisible ? (
                      <span className="text-2xl text-default-400 pointer-events-none">
                        <IoMdEyeOff />
                      </span>
                    ) : (
                      <span className="text-2xl text-default-400 pointer-events-none">
                        <IoMdEye />
                      </span>
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
              />
              <div className="flex py-2 px-1 justify-between">
                <Checkbox
                  classNames={{
                    label: "text-small",
                  }}>
                  Remember me
                </Checkbox>
              </div>
            </CardBody>
            <CardFooter>
              <Button color="primary" type="submit">
                Sign Up
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
