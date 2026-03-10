const { analyzeProduct } = require('./src/lib/rules/engine');

const testProduct = {
    code: "8901063015135",
    product: {
        product_name: "Good Day Cashew Cookies",
        brands: "Britannia",
        ingredients_text: "Wheat Flour (Gluten) (57%), Palm Oil, Sugar, Cashew Bits (Nuts) (4.5%), Invert Sugar, Whole Milk Powder (Milk) (1%), Butter (Milk) (0.6%), Raising Agents: (Ammonium Bicarbonate & Sodium Bicarbonate), Salt, Emulsifier (Soya Lecithin E322), Mono & Diglycerides of Fatty Acids (Palm), Diacetyl Tartaric Acid."
    },
    status: 1,
    status_verbose: "product found locally"
};

const userProfile = {
    hasCompletedOnboarding: true,
    isDiabetic: true,
    allergies: []
};

console.log(analyzeProduct(testProduct, userProfile));
