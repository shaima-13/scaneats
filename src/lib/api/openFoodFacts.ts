import localProductsData from '@/data/localProducts.json';

export interface ProductData {
    code: string;
    product: {
        product_name?: string;
        brands?: string;
        image_url?: string;
        ingredients_text?: string;
        nutriments?: {
            carbohydrates_100g?: number;
            sugars_100g?: number;
            [key: string]: any;
        };
        allergens_tags?: string[];
    };
    status: number;
    status_verbose: string;
}

function checkLocalFallback(barcode: string): ProductData | null {
    const localProduct: any = localProductsData.find((p: any) => String(p.barcode) === barcode);
    if (localProduct) {
        return {
            code: barcode,
            product: {
                product_name: localProduct.product_name,
                brands: localProduct.brand,
                ingredients_text: localProduct.ingredients,
                nutriments: {
                    carbohydrates_100g: localProduct.nutrition_per_100g?.total_carbohydrates_g,
                    sugars_100g: localProduct.nutrition_per_100g?.total_sugars_g
                }
            },
            status: 1,
            status_verbose: "product found locally"
        };
    }
    return null;
}

export async function fetchProductByBarcode(barcode: string): Promise<ProductData | null> {
    try {
        const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'ScanEats - Web Application - v1.0'
            },
            next: { revalidate: 3600 } // Cache for 1 hour in Next.js app router if used server-side
        });

        if (!res.ok) {
            console.error('Failed to fetch product data:', res.statusText);
            return checkLocalFallback(barcode);
        }

        const data: ProductData = await res.json();

        // Status 1 means product found in global API database. 
        // However, it could be an empty user-submitted stub without a name.
        if (data.status === 1 && data.product && data.product.product_name) {
            return data;
        }

        return checkLocalFallback(barcode);
    } catch (err) {
        console.error('Error fetching barcode:', err);
        return checkLocalFallback(barcode);
    }
}
