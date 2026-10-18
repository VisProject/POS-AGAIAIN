import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Order, OrderItem, Product, MenuCategory, User, InventoryItem } from '../types';
import { initialOrders, menuCategories as initialCategories, products as initialProducts, initialInventory } from '../data/mockData';

interface POSContextType {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  cartItems: OrderItem[];
  addToCart: (item: OrderItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  checkout: (customerName: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Inventory State
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'costPerUnit' | 'totalSmallestUnits' | 'stockQuantity' | 'smallestUnit'>) => void;
  updateInventoryStock: (id: string, newStock: number) => void;

  // Product State
  products: Product[];
  categories: MenuCategory[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  addCategory: (category: Omit<MenuCategory, 'id' | 'itemCount'>) => void;

  // Auth State
  currentUser: User | null;
  users: User[];
  login: (pin: string) => boolean;
  logout: () => void;
  setCurrentUser: (user: User) => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

const calculateConversion = (qty: number, unit: string) => {
    if (unit === 'kg') return { val: qty * 1000, smallestUnit: 'gram' as const };
    if (unit === 'liter') return { val: qty * 1000, smallestUnit: 'ml' as const };
    return { val: qty, smallestUnit: unit as any };
};

export function POSProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);

  // Auth
  const [users] = useState<User[]>([
    { id: 'u1', name: 'Johnsondoe', role: 'Cashier', shift: '09:00 - 14:00', pin: '1234' },
    { id: 'u2', name: 'Jane Smith', role: 'Admin', shift: '14:00 - 21:00', pin: '5678' }
  ]);
  const [currentUser, setCurrentUser] = useState<User | null>(users[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setOrders(initialOrders);
    setProducts(initialProducts);
    setCategories(initialCategories);
    setInventory(initialInventory);
  }, []);

  const addInventoryItem = (data: Omit<InventoryItem, 'costPerUnit' | 'totalSmallestUnits' | 'stockQuantity' | 'smallestUnit'>) => {
      const conv = calculateConversion(data.purchaseQuantity, data.purchaseUnit);
      const newInv: InventoryItem = {
          ...data,
          totalSmallestUnits: conv.val,
          smallestUnit: conv.smallestUnit,
          costPerUnit: data.purchasePrice / conv.val,
          stockQuantity: conv.val
      };
      setInventory(prev => [newInv, ...prev]);
  };

  const updateInventoryStock = (id: string, newStock: number) => {
      setInventory(prev => prev.map(inv => inv.id === id ? { ...inv, stockQuantity: newStock } : inv));
  };

  const addToCart = (item: OrderItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => 
        i.productId === item.productId &&
        i.variation === item.variation &&
        i.orderType === item.orderType &&
        JSON.stringify(i.addOns) === JSON.stringify(item.addOns)
      );
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => setCartItems(prev => prev.filter(item => item.id !== itemId));

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(itemId);
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
  };
  const clearCart = () => setCartItems([]);

  const checkout = (customerName: string) => {
    if (cartItems.length === 0) return;

    // Deduct stock & lock COGS
    let transactionTotalCogs = 0;
    let transactionTotalRevenue = 0;

    const lockedItems = cartItems.map(item => {
        const prod = products.find(p => p.id === item.productId);
        const itemCogsOriginal = prod ? prod.cogs : 0;
        
        // Let's deduct from inventory
        if (prod && prod.recipe) {
            prod.recipe.forEach(ri => {
                // we subtract quantityUsed * total ordered quantity
                setInventory(prevInv => prevInv.map(inv => {
                    if (inv.id === ri.inventoryItemId) {
                        return { ...inv, stockQuantity: inv.stockQuantity - (ri.quantityUsed * item.quantity) };
                    }
                    return inv;
                }));
            });
        }

        const itemTotalCogs = itemCogsOriginal * item.quantity;
        const itemTotalRev = item.price * item.quantity;

        transactionTotalCogs += itemTotalCogs;
        transactionTotalRevenue += itemTotalRev;

        return {
            ...item,
            recordedCogs: itemCogsOriginal // Locking the historical COGS individually
        };
    });

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      trxId: `#TRX-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      customerName: customerName || 'Walk-in Customer',
      items: lockedItems,
      status: 'Being Cooked',
      createdAt: new Date(),
      totalCogs: transactionTotalCogs,
      totalRevenue: transactionTotalRevenue,
      totalProfit: transactionTotalRevenue - transactionTotalCogs,
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCartOpen(false);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status } : order));
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct = { ...productData, id: `p_${Math.random().toString(36).substr(2, 9)}` };
    setProducts(prev => [...prev, newProduct]);
    setCategories(prev => prev.map(cat => 
      cat.id === productData.categoryId ? { ...cat, itemCount: cat.itemCount + 1 } : cat
    ));
  };

  const addCategory = (catData: Omit<MenuCategory, 'id' | 'itemCount'>) => {
    const newCat = { 
      ...catData, 
      id: catData.name.toLowerCase().replace(/\s+/g, '_'),
      itemCount: 0 
    };
    setCategories(prev => [...prev, newCat]);
  };

  const login = (pin: string) => {
    if (currentUser?.pin === pin) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const activeUser = isAuthenticated ? currentUser : null;

  return (
    <POSContext.Provider value={{
      orders, setOrders, cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      isCartOpen, setIsCartOpen, checkout, updateOrderStatus,
      inventory, addInventoryItem, updateInventoryStock,
      products, categories, addProduct, addCategory,
      currentUser: activeUser, users, login, logout, 
      setCurrentUser: (u) => { setCurrentUser(u); setIsAuthenticated(false); }
    }}>
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (!context) throw new Error('usePOS must be used within a POSProvider');
  return context;
}
