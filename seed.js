const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    await prisma.food.deleteMany();  // Clear existing data
    await prisma.food_Translations.deleteMany();

    const foodItems = [
        {
            food_name: "Paneer Tikka Masala",
            food_description: "Grilled paneer in spiced tomato gravy",
            food_price: 350,
            food_ingredients: "Paneer, Tomatoes, Spices",
            food_type: "Appetizer",
            food_image_url: "images/paneer_tikka.jpg",
            translations: {
                language_code: "hi",
                food_name_tl: "पनीर टिक्का मसाला",
                food_description_tl: "मसालेदार टमाटर ग्रेवी में ग्रिल्ड पनीर",
                food_price_tl: 350
            }
        },
        {
            food_name: "Chicken Biryani",
            food_description: "Aromatic rice with marinated chicken",
            food_price: 400,
            food_ingredients: "Chicken, Rice, Spices",
            food_type: "Main Course",
            food_image_url: "images/chicken_biryani.jpg",
            translations: {
                language_code: "hi",
                food_name_tl: "चिकन बिरयानी",
                food_description_tl: "मसालेदार चावल और चिकन",
                food_price_tl: 400
            }
        },
        {
            food_name: "Gulab Jamun",
            food_description: "Sweet deep-fried dumplings soaked in syrup",
            food_price: 150,
            food_ingredients: "Milk, Sugar, Cardamom",
            food_type: "Dessert",
            food_image_url: "images/gulab_jamun.jpg",
            translations: {
                language_code: "hi",
                food_name_tl: "गुलाब जामुन",
                food_description_tl: "चीनी सिरप में डूबी मीठी गेंदें",
                food_price_tl: 150
            }
        },
        {
            food_name: "Veg Manchurian",
            food_description: "Vegetable balls in tangy sauce",
            food_price: 300,
            food_ingredients: "Cabbage, Carrot, Flour",
            food_type: "Starter",
            food_image_url: "images/veg_manchurian.jpg",
            translations: {
                language_code: "hi",
                food_name_tl: "वेज मंचूरियन",
                food_description_tl: "खट्टे सॉस में सब्जियों की गेंदें",
                food_price_tl: 300
            }
        },
        {
            food_name: "Butter Naan",
            food_description: "Soft Indian bread with butter",
            food_price: 80,
            food_ingredients: "Flour, Butter",
            food_type: "Bread",
            food_image_url: "images/butter_naan.jpg",
            translations: {
                language_code: "hi",
                food_name_tl: "बटर नान",
                food_description_tl: "मुलायम भारतीय रोटी",
                food_price_tl: 80
            }
        }
    ];

    for (const item of foodItems) {
        const food = await prisma.food.create({
            data: {
                food_name: item.food_name,
                food_description: item.food_description,
                food_price: item.food_price,
                food_ingredients: item.food_ingredients,
                food_type: item.food_type,
                food_image_url: item.food_image_url,
                translations: {
                    create: {
                        language_code: item.translations.language_code,
                        food_name_tl: item.translations.food_name_tl,
                        food_description_tl: item.translations.food_description_tl,
                        food_price_tl: item.translations.food_price_tl
                    }
                }
            }
        });
        console.log(`Created food item: ${food.food_name}`);
    }
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
