import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Skeleton } from "../components/ui/skeleton";
import { Switch } from "../components/ui/switch";
import { Edit, Save, FileText, Plus, Trash2 } from 'lucide-react';
import { Calendar, Clock, Utensils } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MenuDrawer from "../pages/MenuDrawer";

const MenuManager = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);
    const [foodItems, setFoodItems] = useState([]);
    const [newMenuName, setNewMenuName] = useState('');
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [menuToDelete, setMenuToDelete] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/menus')
            .then(response => response.json())
            .then(data => {
                setMenus(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching menus:', error);
                setLoading(false);
            });
    }, []);

    const handleCreateMenu = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/menus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    menu_name: newMenuName,
                    food_ids: selectedFoods
                }),
            });
            const newMenu = await response.json();
            setMenus((prevMenus) => [...prevMenus, newMenu]);
            setDrawerOpen(false);
            setSelectedFoods([]);
            setNewMenuName('');
        } catch (error) {
            console.error('Error creating menu:', error);
        }
    };

    const handleDeleteClick = (menu) => {
        setMenuToDelete(menu);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!menuToDelete) return;

        try {
            await fetch(`http://localhost:5000/api/menus/${menuToDelete.menu_id}`, {
                method: 'DELETE',
            });

            setMenus((prevMenus) => prevMenus.filter(menu => menu.menu_id !== menuToDelete.menu_id));
            setDeleteDialogOpen(false);
            setMenuToDelete(null);
        } catch (error) {
            console.error('Error deleting menu:', error);
        }
    };

    const toggleAvailability = async (menuItemId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/menu-items/${menuItemId}/toggle`, {
                method: 'PUT',
            });
            const updatedItem = await response.json();

            setMenus((prevMenus) => prevMenus.map(menu => ({
                ...menu,
                menu_items: menu.menu_items.map(item =>
                    item.menu_item_id === updatedItem.menu_item_id ? updatedItem : item
                )
            })));
        } catch (error) {
            console.error('Error toggling availability:', error);
        }
    };

    const handleEdit = (menu) => {
        setEditingMenu(menu);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/menus/${editingMenu.menu_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingMenu),
            });
            const updatedMenu = await response.json();

            setMenus((prevMenus) =>
                prevMenus.map(menu => (menu.menu_id === updatedMenu.menu_id ? updatedMenu : menu))
            );
            setEditingMenu(null);
        } catch (error) {
            console.error('Error updating menu:', error);
        }
    };

    const formatPrice = (price) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-4">
                <Skeleton className="h-8 w-64" />
                <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2].map(i => (
                        <Skeleton key={i} className="h-[400px]" />
                    ))}
                </div>
            </div>
        );
    }

    const fetchFoodItems = () => {
        fetch('http://localhost:5000/api/foods')
            .then(response => response.json())
            .then(data => setFoodItems(data))
            .catch(error => console.error('Error fetching foods:', error));
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <FileText className="h-8 w-8" />
                Menu Manager
            </h1>

            <div className='margin'>
            <Button onClick={() => { setDrawerOpen(true); fetchFoodItems(); }}
                className="mb-4" >
                <Plus className="h-5 w-5" /> Add Menu
            </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {menus.map(menu => (
                    <Card key={menu.menu_id} className="shadow-lg">
                        <CardHeader>
                            {editingMenu && editingMenu.menu_id === menu.menu_id ? (
                                <div className="flex items-center gap-4">
                                    <Input
                                        value={editingMenu.menu_name}
                                        onChange={(e) =>
                                            setEditingMenu({ ...editingMenu, menu_name: e.target.value })
                                        }
                                        className="flex-grow"
                                    />
                                    <Button 
                                        onClick={handleSave}
                                        className="flex items-center gap-2"
                                    >
                                        <Save className="h-4 w-4" />
                                        Save
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Utensils className="h-5 w-5" />
                                        {menu.menu_name}
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handleEdit(menu)}
                                            className="flex items-center gap-2"
                                        >
                                            <Edit className="h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteClick(menu)}
                                            className="flex items-center gap-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold mb-3">Menu Items</h3>
                            <ScrollArea className="h-[250px]">
                                <div className="space-y-2">
                                    {menu.menu_items.map(item => (
                                        <div 
                                            key={item.menu_item_id}
                                            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
                                        >
                                            <span className="font-medium">{item.food.food_name}</span>
                                            <span className="text-green-600 font-semibold">
                                                ₹{formatPrice(item.food.food_price)}
                                            </span>
                                            <Switch
                                                checked={item.is_available}
                                                onCheckedChange={() => toggleAvailability(item.menu_item_id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Menu</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{menuToDelete?.menu_name}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <MenuDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                foodItems={foodItems}
                selectedFoods={selectedFoods}
                setSelectedFoods={setSelectedFoods}
                newMenuName={newMenuName}
                setNewMenuName={setNewMenuName}
                handleCreateMenu={handleCreateMenu}
            />
        </div>
    );
};

export default MenuManager;