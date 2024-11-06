import { clientSupabase } from "@/config/supabase";
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
        const { data: getImage } = await clientSupabase
          .from("tbl_products")
          .select("image")
          .eq("id", id)
          .single();

        if (getImage) {
          const removeURLImage = String(getImage.image).replace(
            "https://ftiuevfqtgwqzungcrhh.supabase.co/storage/v1/object/public/imageCatalog/products/",
            ""
          );

          const { data: deleteImage } = await clientSupabase.storage
            .from("imageCatalog")
            .remove([`products/${removeURLImage}`]);

          if (deleteImage) {
            const { data } = await clientSupabase
              .from("tbl_products")
              .delete()
              .eq("id", id)
              .select();

            if (data) {
              set((state) => ({
                products: state.products.filter((product) => product.id !== id),
              }));
            }
          }
        }
      } catch (error: any) {
        console.error("Delete Product Error:", error);
        set({ error: error.message });
      }
    },
  }))
);

export default useProductsStore;
