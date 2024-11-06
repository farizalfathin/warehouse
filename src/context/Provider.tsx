import { ReactNode } from "react";
import AuthContextProvider from "./AuthContext";

export default function Provider({ children }: { children: ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
