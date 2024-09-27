/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

type totalCountType = {
    products: number;
    foods: number;
    drinks: number;
}

export default function useCountProducts() {
    const [status, setStatus] = useState('');
    const [totalCount, setTotalCount] = useState<totalCountType>({
        products: 0,
        foods: 0,
        drinks: 0
    });

    const getCounts = async () => {
        try {
            setStatus('loading');

            const [allProductsRes, foodsRes, drinksRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/products?category=Makanan'),
                fetch('/api/products?category=Minuman'),
            ]);

            if (!allProductsRes.ok || !foodsRes.ok || !drinksRes.ok) {
                throw new Error('Failed to fetch data');
            }

            const [allProductsData, foodsData, drinksData] = await Promise.all([
                allProductsRes.json(),
                foodsRes.json(),
                drinksRes.json(),
            ]);

            setTotalCount({
                products: allProductsData.data.length || 0,
                foods: foodsData.data.length || 0,
                drinks: drinksData.data.length || 0,
            });

            setStatus('success')
        } catch (error) {
            setStatus('error');
            console.error('Error fetching product counts:', error);
        }
    }

    useEffect(() => {
        getCounts();
    }, []);

    return { totalCount, status };
}
