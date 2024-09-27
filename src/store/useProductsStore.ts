import ProductsType from "@/types/products";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type ProductsState = {
  products: ProductsType[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: (query: string) => Promise<void>;
  deleteProduct: (id: number) => void;
};

const useProductsStore = create<ProductsState>()(
  devtools((set) => ({
    products: [],
    isLoading: false,
    error: null,
    fetchProducts: async (query: string) => {
      set({ isLoading: true });
      try {
        const response = await fetch("/api/products" + query);
        const { data, status } = await response.json();

        if (status === "success") {
          set({ products: data, isLoading: false });
        }
      } catch (error: any) {
        console.error("Fetch Products Error:", error);
        set({ error: error.message, isLoading: false });
      }
    },
    deleteProduct: async (id: number) => {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });
        const { status } = await response.json();

        if (status === "success") {
          set((state) => ({
            products: state.products.filter((product) => product.id !== id),
          }));
        }
      } catch (error: any) {
        console.error("Delete Product Error:", error);
        set({ error: error.message });
      }
    },
  }))
);

export default useProductsStore;
