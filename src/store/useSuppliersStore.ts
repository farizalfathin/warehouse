import SuppliersType from "@/types/suppliers";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type SuppliersState = {
  suppliers: SuppliersType[];
  isLoading: boolean;
  error: string | null;
  fetchSuppliers: () => Promise<void>;
  deleteSupplier: (id: number) => void;
};

const useSuppliersStore = create<SuppliersState>()(
  devtools((set) => ({
    suppliers: [],
    isLoading: false,
    error: null,
    fetchSuppliers: async () => {
      set({ isLoading: true });
      try {
        const response = await fetch("/api/suppliers");
        const { data, status } = await response.json();

        if (status === "success") {
          set({ suppliers: data, isLoading: false });
        }
      } catch (error: any) {
        console.error("Fetch Suppliers Error:", error);
        set({ error: error.message, isLoading: false });
      }
    },
    deleteSupplier: async (id: number) => {
      try {
        const response = await fetch(`/api/suppliers/${id}`, {
          method: "DELETE",
        });
        const { status } = await response.json();

        if (status === "success") {
          set((state) => ({
            suppliers: state.suppliers.filter((supplier) => supplier.id !== id),
          }));
        }
      } catch (error: any) {
        console.error("Delete Supplier Error:", error);
        set({ error: error.message });
      }
    },
  }))
);

export default useSuppliersStore;
