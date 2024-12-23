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


// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
