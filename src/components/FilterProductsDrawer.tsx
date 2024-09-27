import { Select, SelectItem, Tooltip } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { IoClose } from "react-icons/io5";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    x: "100%",
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function FilterProductsDrawer({
  setFilter,
  resetFilter,
}: {
  setFilter: (key: string, value: string) => void;
  resetFilter: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<string>("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (category) {
      setFilter("category", category);
    }
    setIsOpen(!isOpen);
  };

  const onReset = () => {
    resetFilter();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <span
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs font-medium bg-sky-500 text-white p-2 rounded hover:bg-sky-600 cursor-pointer">
        Filter Products
      </span>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(!isOpen)}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.5 }}></motion.div>
        )}
      </AnimatePresence>

      {/* Drawer with Enhanced Animation */}
      <motion.div
        className="fixed inset-y-0 right-0 w-80 bg-white z-50 font-montserrat"
        variants={drawerVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        exit="exit">
        <div className="w-full flex justify-between items-center px-4 py-2 shadow-md">
          <h2 className="text-black text-lg">Filter Products</h2>
          <Tooltip placement="right" content="Close">
            <span
              onClick={() => setIsOpen(!isOpen)}
              className="text-xl p-2 rounded-full hover:bg-gray-200 cursor-pointer">
              <IoClose />
            </span>
          </Tooltip>
        </div>
        <form onSubmit={onSubmit}>
          <motion.ul
            className="px-4 py-6 flex flex-col gap-3"
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}>
            <motion.li variants={itemVariants}>
              <Select
                items={[
                  { key: "Makanan", value: "Makanan" },
                  { key: "Minuman", value: "Minuman" },
                ]}
                label="Category"
                placeholder="Select a category"
                labelPlacement="outside"
                onChange={(e) => setCategory(e.target.value)}
                className="max-w-xs">
                {(item) => (
                  <SelectItem key={item.key} value={item.key}>
                    {item.value}
                  </SelectItem>
                )}
              </Select>
            </motion.li>
            <motion.li variants={itemVariants}>
              <div className="w-full flex gap-2 justify-end text-white font-medium">
                <button
                  type="submit"
                  className="bg-green-500 px-2 py-1 rounded hover:bg-green-600">
                  Apply
                </button>
                <button
                  type="button"
                  onClick={onReset}
                  className="bg-red-500 px-2 py-1 rounded hover:bg-red-600">
                  Reset
                </button>
              </div>
            </motion.li>
          </motion.ul>
        </form>
      </motion.div>
    </div>
  );
}

export default FilterProductsDrawer;
