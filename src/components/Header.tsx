import { IoMdLogOut } from "react-icons/io";
import { PiListBold } from "react-icons/pi";
import { FiEdit, FiChevronDown, FiShare, FiPlusSquare } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";
import { IconType } from "react-icons";
import Image from "next/image";

export default function Header({
  setOpenDrawer,
}: {
  setOpenDrawer: () => void;
}) {
  return (
    <header className="w-full shadow-md">
      <div className="flex justify-between items-center px-4 py-2">
        <div>
          <button
            type="button"
            className="text-2xl p-1 rounded hover:bg-gray-200"
            onClick={setOpenDrawer}>
            <PiListBold />
          </button>
        </div>
        <div className="flex justify-center items-center gap-1">
          <ButtonDropDown />
          <Image
            src="https://static.dc.com/sites/default/files/imce/2021/06-JUN/LGN412a_0273b_60ca6ed15ea545.23852660.jpg"
            alt="John Constantine"
            className="w-8 h-8 object-cover object-top rounded-full"
          />
        </div>
      </div>
    </header>
  );
}

const ButtonDropDown = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex items-center justify-center">
      <motion.div animate={open ? "open" : "closed"} className="relative">
        <button
          onClick={() => setOpen((pv) => !pv)}
          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors">
          <span className="font-medium text-sm">John Constantine</span>
          <motion.span variants={iconVariants}>
            <FiChevronDown />
          </motion.span>
        </button>

        <motion.ul
          initial={wrapperVariants.closed}
          variants={wrapperVariants}
          style={{ originY: "top", translateX: "-60%" }}
          className="flex flex-col gap-2 p-2 rounded-lg bg-white shadow-xl absolute z-[1] top-[130%] left-[50%] w-48 overflow-hidden">
          <Option Icon={FiEdit} text="Edit" />
          <Option Icon={FiPlusSquare} text="Duplicate" />
          <Option Icon={FiShare} text="Share" />
          <Option Icon={IoMdLogOut} text="Logout" />
        </motion.ul>
      </motion.div>
    </div>
  );
};

type optionType = {
  text: string;
  Icon: IconType;
};

const Option = ({ text, Icon }: optionType) => {
  return (
    <motion.li
      variants={itemVariants}
      className={`flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md text-slate-700 ${
        text === "Logout"
          ? "hover:bg-red-100 hover:text-red-500"
          : "hover:bg-sky-100 hover:text-sky-500"
      } transition-colors cursor-pointer`}>
      <motion.span variants={actionIconVariants}>
        <Icon />
      </motion.span>
      <span>{text}</span>
    </motion.li>
  );
};

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
};

const actionIconVariants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};
