import { ReactNode, useState } from "react";
import Drawer from "./Drawer";
import Header from "./Header";

export default function Layout({ children }: { children: ReactNode }) {
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(true);

  const openDrawerHandle = () => setIsOpenDrawer(!isOpenDrawer);

  return (
    <main className="w-full h-screen flex overflow-hidden">
      <Drawer open={isOpenDrawer} setOpen={setIsOpenDrawer} />
      <div className="w-full bg-gray-100 overflow-y-auto">
        <Header setOpenDrawer={openDrawerHandle} />
        {children}
      </div>
    </main>
  );
}
