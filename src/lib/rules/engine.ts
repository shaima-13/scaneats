import { ProductData } from '../api/openFoodFacts';
import { Allergen, UserState } from '../store/userStore';

export type StatusLevel = 'Safe' | 'Caution' | 'Danger';

export interface AnalysisResult {
    status: StatusLevel;
    warnings: string[];
    sugarPer100g: number;
    carbsPer100g: number;
}

const SUGAR_ALIASES = ['sugar', 'dextrose', 'maltodextrin', 'corn syrup', 'fructose', 'sucrose', 'glucose', 'jaggery', 'honey', 'syrup'];

export function analyzeProduct(productData: ProductData, userProfile: UserState): AnalysisResult {
    const result: AnalysisResult = {
        status: 'Safe',
        warnings: [],
        sugarPer100g: 0,
        carbsPer100g: 0,
    };

    const product = productData.product;
    const nutriments = product.nutriments || {};
    const ingredientsText = (product.ingredients_text || '').toLowerCase();
    const allergensTags = (product.allergens_tags || []).map(a => a.toLowerCase());

    result.sugarPer100g = nutriments.sugars_100g || 0;
    result.carbsPer100g = nutriments.carbohydrates_100g || 0;

    // 1. Allergen Check
    if (userProfile.allergies.length > 0) {
        const detectedAllergens: string[] = [];
        userProfile.allergies.forEach(allergen => {
            const allergenKey = allergen.toLowerCase();
            // Check both explicit tags and ingredient list
            const inTags = allergensTags.some(tag => tag.includes(allergenKey) || tag.includes(`en:${allergenKey}`));
            const inIngredients = ingredientsText.includes(allergenKey);

            if (inTags || inIngredients) {
                detectedAllergens.push(allergen);
            }
        });

        if (detectedAllergens.length > 0) {
            result.status = 'Danger';
            result.warnings.push(`Contains Allergens: ${detectedAllergens.join(', ')}`);
        }
    }

    // 2. Diabetic Suitability Check
    if (userProfile.isDiabetic) {
        // Check sweetners and sugars in ingredients
        const foundSugars = SUGAR_ALIASES.filter(sugar => ingredientsText.includes(sugar));
        if (foundSugars.length > 0) {
            // Elevate status if not already Danger
            if (result.status !== 'Danger') result.status = 'Caution';
            // Only add warning if sugar numbers are missing or very low, otherwise the nutrient check will handle it
            if (result.sugarPer100g === 0) {
                result.warnings.push(`Contains sugar/sweeteners in ingredients: ${foundSugars.join(', ')} (Exact amounts unknown)`);
            } else {
                result.warnings.push(`Contains added sugar sources: ${foundSugars.join(', ')}`);
            }
        }

        // Evaluate Sugar Limits (per 100g)
        // Rules: > 10g Caution, > 22.5g Danger
        if (result.sugarPer100g > 22.5) {
            result.status = 'Danger';
            result.warnings.push(`High Sugar Content (${result.sugarPer100g}g/100g) - Dangerous for Diabetics`);
        } else if (result.sugarPer100g > 10) {
            if (result.status !== 'Danger') result.status = 'Caution';
            result.warnings.push(`Moderate Sugar Content (${result.sugarPer100g}g/100g) - Consume with caution`);
        }

        // Evaluate Carbs Limit (per 100g)
        if (result.carbsPer100g > 50) {
            if (result.status !== 'Danger') result.status = 'Caution';
            result.warnings.push(`High Carbohydrate Content (${result.carbsPer100g}g/100g)`);
        }
    }

    return result;
}
