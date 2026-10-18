export type OrderStatus = 'Being Cooked' | 'Delivered' | 'Completed';

export interface User {
    id: string;
    name: string;
    role: 'Cashier' | 'Admin';
    shift: string;
    pin: string;
}

export type UnitType = 'kg' | 'gram' | 'liter' | 'ml' | 'pcs';

export interface InventoryItem {
    id: string;
    name: string;
    category?: string;
    purchaseQuantity: number;
    purchaseUnit: UnitType;
    purchasePrice: number;
    smallestUnit: UnitType;
    totalSmallestUnits: number;
    costPerUnit: number;
    stockQuantity: number; // Current stock in the smallest unit
}

export interface RecipeIngredient {
    inventoryItemId: string;
    quantityUsed: number; // Count against smallestUnit
}

export interface OrderItem {
    id: string; // instance id in cart
    productId: string;
    name: string;
    quantity: number;
    price: number;
    orderType?: 'Dine in' | 'Take Away';
    variation?: 'Hot' | 'Ice';
    addOns?: { name: string; price: number }[];
    promo?: string;
    notes?: string;
    recordedCogs: number; // Cached at the exact logic time of the cart subtotaling
}

export interface Order {
    id: string;
    trxId: string;
    beeperId?: string; // e.g. #BP-001
    customerName: string;
    items: OrderItem[];
    status: OrderStatus;
    createdAt: Date;
    totalCogs: number;
    totalRevenue: number;
    totalProfit: number;
}

export interface MenuCategory {
    id: string;
    name: string;
    icon?: string;
    itemCount: number;
}

export interface Product {
    id: string;
    name: string;
    categoryId: string;
    categoryName: string;
    price: number; // Selling Price
    image: string;
    recipe: RecipeIngredient[];
    cogs: number; // Calculated dynamic field based on recipe
    profit: number; 
    margin: number; 
    isPublished: boolean; // Must be true to show on POS grid
}
