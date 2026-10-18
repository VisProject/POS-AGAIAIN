import type { Order, MenuCategory, Product, InventoryItem } from '../types';

export const initialInventory: InventoryItem[] = [
    {
        id: 'inv_1',
        name: 'House Blend Beans',
        category: 'Raw Materials',
        purchaseQuantity: 5,
        purchaseUnit: 'kg',
        purchasePrice: 1000000,
        smallestUnit: 'gram',
        totalSmallestUnits: 5000,
        costPerUnit: 200, // 1000000 / 5000
        stockQuantity: 4500
    },
    {
        id: 'inv_2',
        name: 'Fresh Milk',
        category: 'Dairy',
        purchaseQuantity: 10,
        purchaseUnit: 'liter',
        purchasePrice: 200000,
        smallestUnit: 'ml',
        totalSmallestUnits: 10000,
        costPerUnit: 20, // 200000 / 10000
        stockQuantity: 8000
    },
    {
        id: 'inv_3',
        name: 'Plastic Cup 12oz',
        category: 'Packaging',
        purchaseQuantity: 1000,
        purchaseUnit: 'pcs',
        purchasePrice: 500000,
        smallestUnit: 'pcs',
        totalSmallestUnits: 1000,
        costPerUnit: 500,
        stockQuantity: 850
    }
];

const mockRecipe = [
    { inventoryItemId: 'inv_1', quantityUsed: 18 }, // 18g beans = 3600
    { inventoryItemId: 'inv_3', quantityUsed: 1 }   // 1 pcs cup = 500
];
const mockCogs = 4100;

const createProduct = (p: Partial<Product> & { id: string; name: string; categoryId: string; categoryName: string; price: number; image: string }): Product => {
    const price = p.price;
    const cogs = p.cogs ?? mockCogs;
    const profit = p.profit ?? (price - cogs);
    const margin = p.margin ?? (profit / (price || 1));
    return {
        ...p,
        recipe: p.recipe ?? [...mockRecipe],
        cogs,
        profit,
        margin,
        isPublished: p.isPublished ?? true,
    };
};

export const products: Product[] = [
    createProduct({ id: 'p1', name: 'Montblanc', categoryId: 'signature', categoryName: 'Signature', price: 79000, image: '/Assets image & logo/montblanc 1.png' }),
    createProduct({ id: 'p2', name: 'Magic', categoryId: 'signature', categoryName: 'Signature', price: 85000, image: '/Assets image & logo/magic 1.png' }),
    createProduct({ id: 'p3', name: 'Butterscotch', categoryId: 'signature', categoryName: 'Signature', price: 71000, image: '/Assets image & logo/Butterscotch.png' }),
    createProduct({ id: 'p4', name: 'Dark Chocolate', categoryId: 'non_coffee', categoryName: 'Non-Coffee', price: 71000, image: '/Assets image & logo/dark chocolate 1.png' }),
    createProduct({ id: 'p5', name: 'Black', categoryId: 'coffee', categoryName: 'Coffee', price: 51000, image: '/Assets image & logo/black 1.png' }),
    createProduct({ id: 'p6', name: 'Butter Spark', categoryId: 'non_coffee', categoryName: 'Non-Coffee', price: 65000, image: '/Assets image & logo/butter spark 1.png' }),
    createProduct({ id: 'p7', name: 'Espresso', categoryId: 'coffee', categoryName: 'Coffee', price: 36000, image: '/Assets image & logo/espresso 1.png' }),
    createProduct({ id: 'p8', name: 'White', categoryId: 'coffee', categoryName: 'Coffee', price: 58000, image: '/Assets image & logo/white 1.png' }),
    createProduct({ id: 'p9', name: 'Geisha Blossom', categoryId: 'twg_tea', categoryName: 'TWG Tea', price: 76000, image: '/Assets image & logo/geisha blossom 1.png' }),
    createProduct({ id: 'p10', name: 'Osmanthus Bloom', categoryId: 'twg_tea', categoryName: 'TWG Tea', price: 101000, image: '/Assets image & logo/osmanthus bloom 1.png' }),
    createProduct({ id: 'p11', name: 'Hojicha', categoryId: 'matcha', categoryName: 'Matcha', price: 99000, image: '/Assets image & logo/hojicha 1.png' }),
    createProduct({ id: 'p12', name: 'Hokoaru', categoryId: 'matcha', categoryName: 'Matcha', price: 110000, image: '/Assets image & logo/hokoaru 1.png' }),
    createProduct({ id: 'p13', name: 'London Fog', categoryId: 'artisan_matcha', categoryName: 'Artisan Matcha', price: 103000, image: '/Assets image & logo/london fog 1.png' }),
    createProduct({ id: 'p14', name: 'Saikono', categoryId: 'matcha', categoryName: 'Matcha', price: 127000, image: '/Assets image & logo/saikono 1.png' }),
    createProduct({ id: 'p15', name: 'Matcha Berry', categoryId: 'artisan_matcha', categoryName: 'Artisan Matcha', price: 93000, image: '/Assets image & logo/matcha berry 1.png' }),
    createProduct({ id: 'p16', name: 'Choco Sea Salt - Kouign Amann', categoryId: 'pastry', categoryName: 'Pastry', price: 79000, image: '/Assets image & logo/Choco Sea Salt - Kouign Amann 1.png' }),
    createProduct({ id: 'p17', name: 'Caramel - Kouign Amann', categoryId: 'pastry', categoryName: 'Pastry', price: 71000, image: '/Assets image & logo/Caramel - Kouign Amann 1.png' }),
];

const mockItemsTrx1 = [
    { id: '1', productId: 'p5', name: 'Butter Spark', quantity: 1, price: 65000, recordedCogs: 4100 },
    { id: '2', productId: 'p1', name: 'Montblanc', quantity: 2, price: 79000, recordedCogs: 4100 },
    { id: '3', productId: 'p7', name: 'Geisha Blossom', quantity: 1, price: 76000, recordedCogs: 4100 }
];

export const initialOrders: Order[] = [
    {
        id: '1',
        trxId: '#TRX-0022',
        customerName: 'Avita Desi',
        items: mockItemsTrx1,
        status: 'Being Cooked',
        createdAt: new Date(),
        totalCogs: 4100 * 4,
        totalRevenue: 65000 + (79000 * 2) + 76000,
        totalProfit: (65000 + (79000 * 2) + 76000) - (4100 * 4)
    },
    {
        id: '2',
        trxId: '#TRX-0020',
        customerName: 'Icad',
        items: [
            { id: '1', productId: 'p5', name: 'Butter Spark', quantity: 1, price: 65000, recordedCogs: 4100 },
            { id: '2', productId: 'p1', name: 'Montblanc', quantity: 2, price: 79000, recordedCogs: 4100 }
        ],
        status: 'Delivered',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        totalCogs: 4100 * 3,
        totalRevenue: 65000 + (79000 * 2),
        totalProfit: (65000 + (79000 * 2)) - (4100 * 3)
    },
    {
        id: '3',
        trxId: '#TRX-0021',
        customerName: 'Avita Desi',
        items: mockItemsTrx1,
        status: 'Delivered',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        totalCogs: 4100 * 4,
        totalRevenue: 65000 + (79000 * 2) + 76000,
        totalProfit: (65000 + (79000 * 2) + 76000) - (4100 * 4)
    }
];

export const menuCategories: MenuCategory[] = [
    { id: 'coffee', name: 'Coffee', itemCount: 3, icon: 'Coffee' },
    { id: 'signature', name: 'Signature', itemCount: 3, icon: 'Star' },
    { id: 'matcha', name: 'Matcha', itemCount: 3, icon: 'Leaf' },
    { id: 'artisan_matcha', name: 'Artisan Matcha', itemCount: 2, icon: 'Leaf' },
    { id: 'non_coffee', name: 'Non-Coffee', itemCount: 2, icon: 'CupSoda' },
    { id: 'twg_tea', name: 'TWG Tea', itemCount: 2, icon: 'CupSoda' },
    { id: 'pastry', name: 'Pastry', itemCount: 4, icon: 'Croissant' },
];
