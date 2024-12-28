const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    await prisma.menu_Item.deleteMany();
    await prisma.menu.deleteMany();
    await prisma.food_Translations.deleteMany();
    await prisma.food.deleteMany();  // Clear existing data

    const foodItems = [
        {
            food_name: "Paneer Tikka Masala",
            food_description: "Grilled paneer in spiced tomato gravy",
            food_price: 350,
            food_ingredients: "Paneer, Tomatoes, Spices",
            food_type: "Appetizer",
            food_image_url: "images/paneer_tikka.jpg",
        },
        {
            food_name: "Chicken Biryani",
            food_description: "Aromatic rice with marinated chicken",
            food_price: 400,
            food_ingredients: "Chicken, Rice, Spices",
            food_type: "Main Course",
            food_image_url: "images/chicken_biryani.jpg",
        },
        {
            food_name: "Gulab Jamun",
            food_description: "Sweet deep-fried dumplings soaked in syrup",
            food_price: 150,
            food_ingredients: "Milk, Sugar, Cardamom",
            food_type: "Dessert",
            food_image_url: "images/gulab_jamun.jpg",
        },
    ];

    const menus = [
        {
            menu_name: "Breakfast",
            active_from: new Date("2024-01-01T06:00:00Z"),
            active_until: new Date("2024-01-01T11:00:00Z"),
        },
        {
            menu_name: "Lunch",
            active_from: new Date("2024-01-01T12:00:00Z"),
            active_until: new Date("2024-01-01T15:00:00Z"),
        },
        {
            menu_name: "Dinner",
            active_from: new Date("2024-01-01T18:00:00Z"),
            active_until: new Date("2024-01-01T22:00:00Z"),
        },
    ];

    // Create Food Items and Translations
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
                        language_code: "hi",
                        food_name_tl: item.food_name,
                        food_description_tl: item.food_description,
                        food_price_tl: item.food_price,
                    },
                },
            },
        });
        console.log(`Created food item: ${food.food_name}`);
    }

    // Create Menus and Link Food Items
    for (const menuData of menus) {
        const menu = await prisma.menu.create({
            data: {
                menu_name: menuData.menu_name,
                active_from: menuData.active_from,
                active_until: menuData.active_until,
                is_active: true,
            },
        });
        console.log(`Created menu: ${menu.menu_name}`);

        const allFood = await prisma.food.findMany();
        for (const [index, food] of allFood.entries()) {
            await prisma.menu_Item.create({
                data: {
                    menu_id: menu.menu_id,
                    food_id: food.food_id,
                    display_order: index + 1,
                },
            });
            console.log(`Added ${food.food_name} to ${menu.menu_name}`);
        }
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


    // How This Works:
    // Food Items: Created first, ensuring food exists before associating them with menus.
    // Menus: Breakfast, Lunch, and Dinner menus are seeded with time configurations.
    // Menu_Item: Links each food item to all menus with a display_order