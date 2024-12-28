import { ScrollArea } from "../components/ui/scroll-area";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { useEffect } from 'react';

// eslint-disable-next-line react/prop-types
const MenuDrawer = ({ isOpen, onClose, foodItems, selectedFoods, setSelectedFoods, newMenuName, setNewMenuName, handleCreateMenu }) => {
    const handleSelectFood = (foodId) => {
        setSelectedFoods((prev) =>
            prev.includes(foodId) ? prev.filter(id => id !== foodId) : [...prev, foodId]
        );
    };

    // Close drawer when isOpen changes
    useEffect(() => {
        if (!isOpen) {
            document.body.classList.remove('overflow-hidden');
        } else {
            document.body.classList.add('overflow-hidden');
        }
        return () => document.body.classList.remove('overflow-hidden');
    }, [isOpen]);

    return (
        <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div
                className={`fixed top-0 right-0 w-96 h-full bg-white shadow-lg transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Create New Menu</h2>
                        <Button onClick={onClose} variant="outline">Close</Button>
                    </div>
                    
                    <Input
                        placeholder="Menu Name"
                        value={newMenuName}
                        onChange={(e) => setNewMenuName(e.target.value)}
                    />
                    
                    <ScrollArea className="h-72 mt-4 flex-grow">
                        {foodItems.map(food => (
                            <div key={food.food_id} className="flex items-center justify-between py-2 border-b">
                                <span>{food.food_name}</span>
                                <Switch
                                    checked={selectedFoods.includes(food.food_id)}
                                    onCheckedChange={() => handleSelectFood(food.food_id)}
                                />
                            </div>
                        ))}
                    </ScrollArea>

                    <Button 
                        onClick={handleCreateMenu} 
                        className="mt-6 self-end"
                        disabled={!newMenuName || selectedFoods.length === 0}
                    >
                        Create Menu
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MenuDrawer;
