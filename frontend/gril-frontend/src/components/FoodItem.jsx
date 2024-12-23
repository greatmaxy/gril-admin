import PropTypes from 'prop-types';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { useState } from 'react';

function FoodItem({ food, onDelete }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null); // For handling errors during deletion

    const handleDelete = async () => {
        console.log('Food ID:', food.food_id); 
        setError(null); // Reset error before attempting delete
        try {
            setIsDeleting(true);
            await axios.delete(`http://localhost:5000/api/foods/${food.food_id}`);
            onDelete(food.food_id);
            setIsDeleteDialogOpen(false);
        } catch (error) {
            console.error('Error deleting food:', error);
            setError('Failed to delete food item. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full max-w-md mx-auto relative">
            {/* Delete icon in the top right corner */}
            <button 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Delete food item"
            >
                <Trash2 size={20} />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">{food.food_name}</h2>
            <p className="text-gray-600 mt-2">{food.food_description}</p>
            <p className="text-lg font-medium text-gray-800 mt-4">
                <strong>Price:</strong> ₹{food.food_price}
            </p>
            <p className="text-sm font-medium text-gray-600 mt-2">
                <strong>Type:</strong> {food.food_type}
            </p>
            <p className="text-sm font-medium text-gray-600 mt-2">
                <strong>Ingredients:</strong> {food.food_ingredients}
            </p>

            {/* Error Message */}
            {error && (
                <div className="text-red-500 text-sm mt-4">
                    <p>{error}</p>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Food Item</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{food.food_name}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

FoodItem.propTypes = {
    food: PropTypes.shape({
        food_id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        food_name: PropTypes.string.isRequired,
        food_description: PropTypes.string.isRequired,
        food_price: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        food_type: PropTypes.string.isRequired,
        food_ingredients: PropTypes.string.isRequired
    }).isRequired,
    onDelete: PropTypes.func.isRequired
};

export default FoodItem;
