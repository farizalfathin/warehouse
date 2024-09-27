import { Tooltip } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillProduct } from "react-icons/ai";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoClose, IoStatsChart } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { SiPaloaltosoftware } from "react-icons/si";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: { stiffness: 300 },
  },
  exit: {
    x: "-100%",
    transition: { stiffness: 300 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.5,
      ease: "easeOut",
      delay: 0.3,
    },
  },
};

// Variabel untuk animasi buka tutup drawer
const drawerVariantsLarge = {
  open: {
    width: "20%", // Lebar saat drawer terbuka
    transition: { type: "tween", duration: 0.5 }, // Animasi smooth saat buka
  },
  closed: {
    width: "4rem", // Lebar minimal saat drawer tertutup
    transition: { type: "tween", duration: 0.5 }, // Animasi smooth saat tutup
  },
};

export default function Drawer({
  open = true,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const { pathname } = useRouter();
  const [selected, setSelected] = useState<string>(pathname || "/");
  const [widthDevice, setWidthDevice] = useState<number>(0);

  // Mengatur deteksi lebar layar
  useEffect(() => {
    const handleResize = () => {
      setWidthDevice(window.innerWidth);
    };

    handleResize(); // Panggil saat component mount
    window.addEventListener("resize", handleResize); // Panggil saat resize

    if (widthDevice < 1024) {
      setOpen(false);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [widthDevice, setOpen]);

  if (widthDevice < 1024) {
    return (
      <div className="relative">
        {/* Backdrop */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setOpen(!open)}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.5 }}></motion.div>
          )}
        </AnimatePresence>

        {/* Drawer with Enhanced Animation */}
        <motion.div
          className="fixed inset-y-0 left-0 w-80 bg-sky-950 text-white z-50 font-montserrat"
          variants={drawerVariants}
          initial="hidden"
          animate={open ? "visible" : "hidden"}
          exit="exit">
          <div className="w-full flex justify-between py-[0.6rem] px-3 shadow-md">
            <Link href="/">
              <span
                onClick={() => {
                  setSelected("/");
                  setOpen(!open);
                }}
                className="flex justify-center items-center gap-4 text-2xl font-medium">
                <SiPaloaltosoftware /> {open && "Warehouse"}{" "}
                {/* Hanya tampilkan teks saat open */}
              </span>
            </Link>
            <Tooltip placement="right" content="Close">
              <span
                onClick={() => setOpen(!open)}
                className="text-xl p-2 rounded-full hover:bg-gray-200 hover:text-slate-700 cursor-pointer">
                <IoClose />
              </span>
            </Tooltip>
          </div>
          <motion.ul
            className="w-full flex flex-col gap-2 py-4 px-2"
            initial="hidden"
            animate={open ? "visible" : "hidden"}>
            <motion.li variants={itemVariants}>
              <Tooltip content="Dashboard" offset={-10}>
                <Link href="/">
                  <span
                    onClick={() => {
                      setSelected("/");
                      setOpen(!open);
                    }}
                    className={`flex items-center gap-1 text-lg font-medium p-2 rounded-lg ${
                      !open && "justify-center"
                    } ${selected === "/" && "bg-black bg-opacity-15"}`}>
                    <MdDashboard /> {open && "Dashboard"}{" "}
                    {/* Tampilkan teks hanya saat open */}
                  </span>
                </Link>
              </Tooltip>
            </motion.li>
            <motion.li variants={itemVariants}>
              <Tooltip content="Table Products" offset={-10}>
                <Link href="/products">
                  <span
                    onClick={() => {
                      setSelected("/products");
                      setOpen(!open);
                    }}
                    className={`flex items-center gap-1 text-lg font-medium p-2 rounded-lg ${
                      !open && "justify-center"
                    } ${selected === "/products" && "bg-black bg-opacity-15"}`}>
                    <AiFillProduct /> {open && "Table Products"}
                  </span>
                </Link>
              </Tooltip>
            </motion.li>
            <motion.li variants={itemVariants}>
              <Tooltip content="Table Suppliers" offset={-10}>
                <Link href="/suppliers">
                  <span
                    onClick={() => {
                      setSelected("/suppliers");
                      setOpen(!open);
                    }}
                    className={`flex items-center gap-1 text-lg font-medium p-2 rounded-lg ${
                      !open && "justify-center"
                    } ${
                      selected === "/suppliers" && "bg-black bg-opacity-15"
                    }`}>
                    <BsFillPeopleFill /> {open && "Table Suppliers"}
                  </span>
                </Link>
              </Tooltip>
            </motion.li>
            <motion.li variants={itemVariants}>
              <Tooltip content="Visualisasi Data" offset={-10}>
                <Link href="/data">
                  <span
                    onClick={() => {
                      setSelected("/");
                      setOpen(!open);
                    }}
                    className={`flex items-center gap-1 text-lg font-medium p-2 rounded-lg ${
                      !open && "justify-center"
                    } ${selected === "/data" && "bg-black bg-opacity-15"}`}>
                    <IoStatsChart /> {open && "Visualisasi Data"}
                  </span>
                </Link>
              </Tooltip>
            </motion.li>
          </motion.ul>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.nav
      initial={open ? "open" : "closed"} // Status awal berdasarkan props
      animate={open ? "open" : "closed"} // Animasi berubah sesuai props
      variants={drawerVariantsLarge} // Menggunakan variants untuk animasi
      className="bg-sky-950 text-white flex-shrink-0 overflow-hidden" // Mengatur drawer agar tidak mengecilkan teks
    >
      <div className="w-full py-[0.6rem] shadow-md">
        <Link href="/">
          <span
            onClick={() => setSelected("/")}
            className="h-8 flex justify-center items-center gap-4 text-2xl font-medium">
            <SiPaloaltosoftware /> {open && "Warehouse"}{" "}
            {/* Hanya tampilkan teks saat open */}
          </span>
        </Link>
      </div>
      <div className="w-full flex flex-col gap-2 py-4 px-2">
        <Tooltip content="Dashboard" offset={-10}>
          <Link href="/">
            <span
              onClick={() => setSelected("/")}
              className={`flex items-center gap-1 text-lg font-medium p-2 rounded-lg ${
                !open && "justify-center"
              } ${selected === "/" && "bg-black bg-opacity-15"}`}>
              <MdDashboard /> {open && "Dashboard"}{" "}
              {/* Tampilkan teks hanya saat open */}
            </span>
          </Link>
        </Tooltip>
        <Tooltip content="Table Products" offset={-10}>
          <Link href="/products">
            <span
              onClick={() => setSelected("/products")}
              className={`flex items-center gap-1 text-lg font-medium p-2 rounded-lg ${
                !open && "justify-center"
              } ${selected === "/products" && "bg-black bg-opacity-15"}`}>
              <AiFillProduct /> {open && "Table Products"}
            </span>
          </Link>
        </Tooltip>
        <Tooltip content="Table Suppliers" offset={-10}>
          <Link href="/suppliers">
            <span
              onClick={() => setSelected("/suppliers")}
              className={`flex items-center gap-1 text-lg font-medium p-2 rounded-lg ${
                !open && "justify-center"
              } ${selected === "/suppliers" && "bg-black bg-opacity-15"}`}>
              <BsFillPeopleFill /> {open && "Table Suppliers"}
            </span>
          </Link>
        </Tooltip>
        <Tooltip content="Visualisasi Data" offset={-10}>
          <Link href="/data">
            <span
              onClick={() => setSelected("/data")}
              className={`flex items-center gap-1 text-lg font-medium p-2 rounded-lg ${
                !open && "justify-center"
              } ${selected === "/data" && "bg-black bg-opacity-15"}`}>
              <IoStatsChart /> {open && "Visualisasi Data"}
            </span>
          </Link>
        </Tooltip>
      </div>
    </motion.nav>
  );
}
