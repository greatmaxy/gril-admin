import { useState, useEffect } from 'react';
import axios from 'axios';
import FoodItem from '../components/FoodItem';
import SidePanel from '../components/SidePanel';

function Home() {
    const [foods, setFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchFoods();
    }, []);

    useEffect(() => {
        if (searchQuery === '') {
            setFilteredFoods(foods);
        } else {
            setFilteredFoods(
                foods.filter(food =>
                    food.food_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    food.food_description.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [searchQuery, foods]);

    const fetchFoods = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/foods');
            setFoods(response.data);
            setFilteredFoods(response.data); // Initialize with all foods
        } catch (error) {
            console.error("Error fetching food data:", error);
        }
    };

    const handleFoodCreated = (newFood) => {
        setFoods([...foods, newFood]);
    };

    const handleFoodDelete = (deletedFoodId) => {
        // Update both foods and filteredFoods states
        setFoods(prevFoods => prevFoods.filter(food => food.food_id !== deletedFoodId));
        setFilteredFoods(prevFiltered => prevFiltered.filter(food => food.food_id !== deletedFoodId));
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Food Items</h1>

            {/* Search Input */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search for food..."
                    className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <button
                onClick={() => setIsPanelOpen(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            >
                + Add New Food
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFoods.length > 0 ? (
                    filteredFoods.map(food => (

                        <FoodItem 
                            key={food.food_id} 
                            food={food} 
                            onDelete={handleFoodDelete}  // Pass the delete handler
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">No food items found.</p>
                )}
            </div>

            

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                onFoodCreated={handleFoodCreated}
            />
        </div>
    );
}

export default Home;