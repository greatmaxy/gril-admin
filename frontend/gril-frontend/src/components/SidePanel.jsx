import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

function SidePanel({ isOpen, onClose, onFoodCreated }) {
    const [formData, setFormData] = useState({
        food_name_en: '',
        food_name_hi: '',
        food_name_tlg: '',
        food_description_en: '',
        food_description_hi: '',
        food_description_tlg: '',
        food_price: '',
        food_type: 'Appetizer',
        food_ingredients_en: '',
        food_ingredients_hi: '',
        food_ingredients_tlg: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.food_name_en || formData.food_price === '') {
            setError('All fields are required!');
            return;
        }

        if (formData.food_price < 0) {
            setError('Price cannot be negative.');
            return;
        }

        // Prepare data for API submission
        const foodData = {
            food_name:formData.food_name_en,
            food_description:formData.food_description_en,
            food_price: formData.food_price,
            food_type: formData.food_type,
            food_ingredients: formData.food_ingredients_en
        };

        try {
            const response = await axios.post('http://localhost:5000/api/foods', foodData);
            onFoodCreated(response.data);
            onClose();
        } catch (error) {
            console.error('Error creating food:', error);
            setError('Failed to create food item.');
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                right: isOpen ? 0 : '-600px',
                top: 0,
                width: '800px',
                height: '100%',
                backgroundColor: '#fff',
                transition: '0.3s',
                boxShadow: '-3px 0 5px rgba(0,0,0,0.2)',
                padding: '20px',
                display: isOpen ? 'block' : 'none',
            }}
            className="overflow-auto z-50"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Create Food Item</h2>
                <button
                    onClick={onClose}
                    className="text-xl text-gray-600 hover:text-gray-800"
                    aria-label="Close Panel"
                >
                    &#10005;
                </button>
            </div>
            {error && (
                <div className="bg-red-100 text-red-700 border border-red-500 rounded p-2 mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Food Name (English):</label>
                    <input
                        type="text"
                        name="food_name_en"
                        value={formData.food_name_en}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block font-medium">Food Name (Hindi):</label>
                    <input
                        type="text"
                        name="food_name_hi"
                        value={formData.food_name_hi}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block font-medium">Food Name (Telugu):</label>
                    <input
                        type="text"
                        name="food_name_tlg"
                        value={formData.food_name_tlg}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block font-medium">Description (English):</label>
                    <textarea
                        name="food_description_en"
                        value={formData.food_description_en}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                <div>
                    <label className="block font-medium">Description (Hindi):</label>
                    <textarea
                        name="food_description_hi"
                        value={formData.food_description_hi}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                <div>
                    <label className="block font-medium">Description (Telugu):</label>
                    <textarea
                        name="food_description_tlg"
                        value={formData.food_description_tlg}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                <div>
                    <label className="block font-medium">Price:</label>
                    <input
                        type="number"
                        name="food_price"
                        value={formData.food_price}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block font-medium">Type:</label>
                    <select
                        name="food_type"
                        value={formData.food_type}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option>Appetizer</option>
                        <option>Main Course</option>
                        <option>Dessert</option>
                        <option>Starter</option>
                        <option>Bread</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Ingredients (English):</label>
                    <input
                        type="text"
                        name="food_ingredients_en"
                        value={formData.food_ingredients_en}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block font-medium">Ingredients (Hindi):</label>
                    <input
                        type="text"
                        name="food_ingredients_hi"
                        value={formData.food_ingredients_hi}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block font-medium">Ingredients (Telugu):</label>
                    <input
                        type="text"
                        name="food_ingredients_tlg"
                        value={formData.food_ingredients_tlg}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Create
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-200 text-gray-600 p-2 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

SidePanel.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onFoodCreated: PropTypes.func.isRequired,
};

export default SidePanel;
