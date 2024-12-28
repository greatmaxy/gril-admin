const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');


const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());


// Fetch all food items with translations
app.get('/api/foods', async (req, res) => {
    try {
        const foods = await prisma.food.findMany({
            include: {
                translations: true,
            },
            orderBy: {
                food_name: 'asc'  // Use 'desc' for descending order
            },
        });
        res.json(foods);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching food data' });
    }
});

// Api call to create a new food item
app.post('/api/foods', async (req, res) => {
    const { food_name, food_description, food_price, food_type, food_ingredients } = req.body;

    if (food_price < 0) {
        return res.status(400).json({ error: "Price cannot be negative." });
    }

    try {
        const newFood = await prisma.food.create({
            data: {
                food_name,
                food_description,
                food_price,
                food_type,
                food_ingredients,
            }
        });
        res.json(newFood);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error creating food item.' });
    }
});


app.delete('/api/foods/:id', async (req, res) => {
    const { id } = req.params;
    console.log("Received ID:", id);

    // Ensure the id is a valid number
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid food ID' });
    }

    try {
        // Delete the food item, cascading deletes its associated translations
        const deletedFood = await prisma.food.delete({
            where: { food_id: parseInt(id) },
            include: {
                translations: true,  // To get the translations for confirmation
            },
        });

        if (deletedFood) {
            res.status(200).json({
                message: 'Food item and translations deleted successfully',
                deletedFood: deletedFood,
                deletedTranslationsCount: deletedFood.translations.length,
            });
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        console.error('Error deleting food:', error);
        res.status(500).json({
            message: 'Failed to delete food item and translations',
            error: error.message,
        });
    }
});


// Fetch all menus with food items
app.get('/api/menus', async (req, res) => {
    try {
        const menus = await prisma.menu.findMany({
            include: {
                menu_items: {
                    include: {
                        food: true
                    }
                }
            },
            orderBy: {
                menu_name: 'asc'  // Sort menus alphabetically
            }
        });
        res.json(menus);
    } catch (error) {
        console.error('Error fetching menus:', error);
        res.status(500).json({ error: 'Error fetching menus' });
    }
});

// Fetch a single menu by ID with food items
app.get('/api/menus/:id', async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid menu ID' });
    }

    try {
        const menu = await prisma.menu.findUnique({
            where: { menu_id: parseInt(id) },
            include: {
                menu_items: {
                    include: {
                        food: true
                    }
                }
            }
        });

        if (menu) {
            res.json(menu);
        } else {
            res.status(404).json({ error: 'Menu not found' });
        }
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ error: 'Error fetching menu' });
    }
});

// Create a new menu with food items

const now = new Date();
const oneWeekLater = new Date();
oneWeekLater.setDate(now.getDate() + 7);


app.post('/api/menus', async (req, res) => {
    const { menu_name, active_from, active_until, food_ids } = req.body;

    if (!menu_name || !Array.isArray(food_ids) || food_ids.length === 0) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        const newMenu = await prisma.menu.create({
            data: {
                menu_name,
                active_from: active_from || now,
                active_until: active_until || oneWeekLater,
                is_active: true,
                menu_items: {
                    create: food_ids.map(food_id => ({
                        food_id: food_id 
                    }))
                }
            },
            include: {
                menu_items: {
                    include: {
                        food: true
                    }
                }
            }
        });

        res.json(newMenu);
    } catch (error) {
        console.error('Error creating menu:', error);
        res.status(500).json({ error: 'Failed to create menu' });
    }
});

//Deleting a menu 

app.delete('/api/menus/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMenu = await prisma.menu.delete({
            where: {
                menu_id: parseInt(id)
            }
        });

        res.json({ message: 'Menu deleted successfully', deletedMenu });
    } catch (error) {
        console.error('Error deleting menu:', error);

        // Handle specific errors
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Menu not found' });
        }

        res.status(500).json({ error: 'Failed to delete menu' });
    }
});


// GET /api/menus – Fetches all menus with associated food items.
// GET /api/menus/:id – Fetches a specific menu by menu_id.
// POST /api/menus – Creates a new menu and links existing food items by their IDs.

//Example - Requesting for creating a menu 
// {
//     "menu_name": "Winter Special",
//     "active_from": "2024-12-01T08:00:00Z",
//     "active_until": "2024-12-31T22:00:00Z",
//     "food_ids": [1, 2, 3]  // Food item IDs to link
//  }
  

// Update menu details
app.put('/api/menus/:id', async (req, res) => {
    const { id } = req.params;
    const { menu_name, active_from, active_until, is_active } = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid menu ID' });
    }

    try {
        const updatedMenu = await prisma.menu.update({
            where: { menu_id: parseInt(id) },
            data: {
                menu_name,
                active_from: active_from ? new Date(active_from) : undefined,
                active_until: active_until ? new Date(active_until) : undefined,
                is_active
            },
            include: {
                menu_items: {
                    include: {
                        food: true
                    }
                }
            }
        });

        res.json(updatedMenu);
    } catch (error) {
        console.error('Error updating menu:', error);
        res.status(500).json({ error: 'Failed to update menu' });
    }
});

// include: { menu_items: { include: { food: true } } } –
// This ensures the menu_items and their food details are returned along with the updated menu.

// Optional Date Handling –
// If active_from or active_until is null or undefined, the date won't be updated. This prevents errors when passing empty values.

// Consistent Response –
// The frontend now receives the full updated menu structure, preventing undefined errors when mapping over menu_items.


// Toggle food availability in a menu
app.put('/api/menu-items/:id/toggle', async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Invalid menu item ID' });
    }

    try {
        const menuItem = await prisma.menu_Item.findUnique({
            where: { menu_item_id: parseInt(id) },
            include: { food: true }  // Include food relationship initially
        });

        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }

        const updatedItem = await prisma.menu_Item.update({
            where: { menu_item_id: parseInt(id) },
            data: {
                is_available: !menuItem.is_available
            },
            include: {
                food: true  // Ensure the updated item includes the food relationship
            }
        });

        res.json(updatedItem);
    } catch (error) {
        console.error('Error toggling food availability:', error);
        res.status(500).json({ error: 'Failed to toggle availability' });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
