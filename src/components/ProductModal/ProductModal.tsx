import { useState, useEffect } from 'react';
import styles from './ProductModal.module.css';
import { X, Plus, Minus } from 'lucide-react';
import type { Product, OrderItem } from '../../types';
import { cn } from '../../lib/utils';
import { usePOS } from '../../context/POSContext';

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    const { addToCart, isCartOpen, setIsCartOpen } = usePOS();

    const [customerName, setCustomerName] = useState('');
    const [isMembership, setIsMembership] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [orderType, setOrderType] = useState<'Dine in' | 'Take Away'>('Dine in');
    const [variation, setVariation] = useState<'Hot' | 'Ice'>('Hot');
    const [addOns, setAddOns] = useState<{ name: string, price: number }[]>([]);
    const [promo, setPromo] = useState<string>('');
    const [notes, setNotes] = useState('');

    // Reset state when product changes
    useEffect(() => {
        if (product) {
            setQuantity(1);
            setOrderType('Dine in');
            setVariation('Hot');
            setAddOns([]);
            setPromo('');
            setNotes('');
            // Keep customer name across modals for convenience if needed, but let's assume it can be reset or kept.
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const handleAddOnToggle = (name: string, price: number) => {
        const exists = addOns.find(a => a.name === name);
        if (exists) {
            setAddOns(addOns.filter(a => a.name !== name));
        } else {
            setAddOns([...addOns, { name, price }]);
        }
    };

    const addOnTotal = addOns.reduce((acc, curr) => acc + curr.price, 0);
    let discountMod = 1;
    if (promo.includes('15%')) discountMod = 0.85;
    else if (promo.includes('17%')) discountMod = 0.83;

    const currentPrice = (product.price + addOnTotal) * discountMod;

    const handlePlaceOrder = () => {
        const newItem: OrderItem = {
            id: `item_${Math.random().toString(36).substr(2, 9)}`,
            productId: product.id,
            name: product.name,
            quantity,
            price: currentPrice,
            orderType,
            variation,
            addOns: [...addOns],
            promo,
            notes,
            recordedCogs: product.cogs,
        };

        addToCart(newItem);
        onClose();
        if (!isCartOpen) setIsCartOpen(true);
    };

    const AVAILABLE_ADDONS = [
        { name: 'Extra Single Espresso', price: 7000 },
        { name: 'Extra Double Espresso', price: 14000 },
        { name: 'Extra Sugar', price: 3000 },
        { name: 'Extra Caramel Syrup', price: 15000 },
        { name: 'Add Hazelnut Syrup', price: 15000 },
        { name: 'Extra Ice', price: 2000 },
        { name: 'Less Ice', price: 0 },
        { name: 'Less Sweet', price: 0 },
    ];

    const PROMOS = [
        { name: 'Opening Promo 15%', value: 'Opening Promo 15%' },
        { name: 'Special CNY 17%', value: 'Special CNY 17%' },
        { name: 'Paket Bukber B1G1', value: 'Paket Bukber B1G1' },
    ];

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Order</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                </div>

                <div className={styles.scrollContent}>
                    {/* Customer Name */}
                    <div className={styles.section}>
                        <label className={styles.sectionLabel}>Customer Name</label>
                        <div className={styles.customerRow}>
                            <input
                                type="text"
                                className={styles.inputField}
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                            <button
                                className={cn(styles.membershipBtn, isMembership && styles.activeBtn)}
                                onClick={() => setIsMembership(!isMembership)}
                            >
                                <div className={cn(styles.checkbox, isMembership && styles.checked)} />
                                Membership Customer
                            </button>
                        </div>
                    </div>

                    {/* Product Header inside modal */}
                    <div className={styles.productHeaderRow}>
                        <div className={styles.productInfoRow}>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <span className={styles.productPrice}>{currentPrice.toLocaleString('id-ID')}</span>
                        </div>
                        <span className={styles.categoryBadge}>{product.categoryName}</span>
                    </div>

                    {/* Quantity */}
                    <div className={styles.quantityRow}>
                        <button className={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
                        <span className={styles.qtyValue}>{quantity}</span>
                        <button className={styles.qtyBtn} onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
                    </div>

                    {/* Type & Variation */}
                    <div className={styles.splitSection}>
                        <div className={styles.halfSection}>
                            <label className={styles.sectionLabel}>Order Type</label>
                            <div className={styles.btnGrid2}>
                                <button className={cn(styles.optionBtn, orderType === 'Dine in' && styles.activeBtn)} onClick={() => setOrderType('Dine in')}>Dine in</button>
                                <button className={cn(styles.optionBtn, orderType === 'Take Away' && styles.activeBtn)} onClick={() => setOrderType('Take Away')}>Take Away</button>
                            </div>
                        </div>
                        <div className={styles.halfSection}>
                            <label className={styles.sectionLabel}>Variation</label>
                            <div className={styles.btnGrid2}>
                                <button className={cn(styles.optionBtn, variation === 'Hot' && styles.activeBtn)} onClick={() => setVariation('Hot')}>Hot</button>
                                <button className={cn(styles.optionBtn, variation === 'Ice' && styles.activeBtn)} onClick={() => setVariation('Ice')}>Ice</button>
                            </div>
                        </div>
                    </div>

                    {/* Add On & Additional */}
                    <div className={styles.section}>
                        <label className={styles.sectionLabel}>Add On & Additional</label>
                        <div className={styles.btnGrid4}>
                            {AVAILABLE_ADDONS.map(addon => {
                                const isActive = addOns.some(a => a.name === addon.name);
                                return (
                                    <button
                                        key={addon.name}
                                        className={cn(styles.addonBtn, isActive && styles.activeBtn)}
                                        onClick={() => handleAddOnToggle(addon.name, addon.price)}
                                    >
                                        <span className={styles.addonPrice}>{addon.price > 0 ? `+ ${addon.price.toLocaleString('id-ID')}` : '-'}</span>
                                        <span className={styles.addonName}>{addon.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Discount / Promo */}
                    <div className={styles.section}>
                        <label className={styles.sectionLabel}>Discount / Promo</label>
                        <div className={styles.btnGrid3}>
                            {PROMOS.map(p => (
                                <button
                                    key={p.value}
                                    className={cn(styles.promoBtn, promo === p.value && styles.activeBtn)}
                                    onClick={() => setPromo(promo === p.value ? '' : p.value)}
                                >
                                    <div className={cn(styles.checkbox, promo === p.value && styles.checked)} />
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className={styles.section}>
                        <label className={styles.sectionLabel}>Notes</label>
                        <textarea
                            className={styles.textArea}
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.backBtn} onClick={onClose}>Back</button>
                    <button className={styles.placeOrderBtn} onClick={handlePlaceOrder}>Place Order</button>
                </div>
            </div>
        </div>
    );
}
