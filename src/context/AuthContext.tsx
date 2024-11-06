import { User } from "@/types/user";
import { createContext, useContext } from "react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { clientSupabase } from "@/config/supabase";

type authContext = {
  user: User | null;
  isAuth: boolean;
  onLogin: ({ email, password }: { email: string; password: string }) => void;
  onLogout: () => void;
};

const AuthContext = createContext<authContext | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean>(false);

  const verifyUserToken = useCallback(async () => {
    try {
      const { data } = await clientSupabase.auth.getUser();
      const { user: currentUser } = data;

      if (currentUser?.id) {
        verifyUserId(currentUser.id);
        setIsAuth(true);
      }
    } catch (error: any) {
      console.error("Failed to verify user token:", error);
      setIsAuth(false);
      setUser(null);
      throw new Error(error);
    }
  }, []);

  const verifyUserId = async (id: string) => {
    try {
      const { data, error } = await clientSupabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Failed to fetch user profile:", error);
        setUser(null);
      } else {
        setUser(data);
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      throw new Error(error);
    }
  };

  const verifyAuthStatus = useCallback(() => {
    const { data: authListener } = clientSupabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          setIsAuth(true);
          if (session?.user?.id) verifyUserId(session.user.id);
        }

        if (event === "SIGNED_OUT") {
          setIsAuth(false);
          setUser(null);
        }
      }
    );

    return authListener;
  }, []);

  const onLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const { error } = await clientSupabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setIsAuth(true);
      await verifyUserToken(); // Verifikasi ulang pengguna setelah login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const onLogout = async () => {
    try {
      await clientSupabase.auth.signOut();
      setIsAuth(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const authListener = verifyAuthStatus();

    verifyUserToken();

    return () => authListener.subscription.unsubscribe();
  }, [verifyUserToken, verifyAuthStatus]);

  return (
    <AuthContext.Provider value={{ user, isAuth, onLogin, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
