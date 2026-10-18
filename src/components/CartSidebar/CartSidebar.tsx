import { useState } from 'react';
import styles from './CartSidebar.module.css';
import { ShoppingCart, Edit3, Plus, Minus, CheckCircle } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { cn } from '../../lib/utils';

export function CartSidebar() {
    const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, products, checkout } = usePOS();

    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'Qris' | 'Card'>('Qris');

    if (!isCartOpen) return null;

    // Calculate totals
    const amount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Basic promo discount calculation if promos exist in items (for visual mock)
    const hasPromo = cartItems.some(i => i.promo);
    const promoTitle = cartItems.find(i => i.promo)?.promo || '';
    const discount = hasPromo ? amount * 0.15 : 0; // assuming 15% discount for mockup

    const subTotal = amount - discount;
    const tax = subTotal * 0.11;
    const total = subTotal + tax;

    return (
        <div className={styles.overlay} onClick={() => setIsCartOpen(false)}>
            <div className={styles.sidebar} onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className={styles.header}>
                    <button className={styles.cartIconBtn} onClick={() => setIsCartOpen(false)}>
                        <ShoppingCart size={18} />
                    </button>

                    <div className={styles.headerTitles}>
                        <input
                            type="text"
                            placeholder="Write Costumer Name"
                            className={styles.customerInput}
                            value={customerName}
                            onChange={e => setCustomerName(e.target.value)}
                        />
                        <span className={styles.trxId}>#TRX-0023</span>
                    </div>

                    <button className={styles.editIconBtn}>
                        <Edit3 size={16} />
                    </button>
                </div>

                {/* Item List */}
                <div className={styles.itemList}>
                    {cartItems.length === 0 ? (
                        <div className={styles.emptyState}>No items in cart</div>
                    ) : (
                        cartItems.map(item => {
                            const product = products.find(p => p.id === item.productId);
                            return (
                                <div key={item.id} className={styles.cartItem}>
                                    <div className={styles.itemMainRow}>
                                        <img
                                            src={product?.image || 'https://via.placeholder.com/60'}
                                            alt={item.name}
                                            className={styles.itemImage}
                                        />

                                        <div className={styles.itemDetails}>
                                            <div className={styles.titleRow}>
                                                <div className={styles.titleStack}>
                                                    <span className={styles.orderType}>{item.orderType || 'Dine in'}</span>
                                                    <span className={styles.itemName}>{item.name}</span>
                                                    <span className={styles.categoryBadge}>{product?.categoryName || 'Unknown'}</span>
                                                </div>
                                                <span className={styles.itemPrice}>
                                                    {(item.price * item.quantity).toLocaleString('id-ID', { minimumFractionDigits: 3 })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.notesSection}>
                                        <span className={styles.notesLabel}>Order notes</span>
                                        <ul className={styles.notesList}>
                                            {item.variation && <li>• {item.variation}</li>}
                                            {item.addOns?.map(a => <li key={a.name}>• {a.name}</li>)}
                                            {item.notes && <li>• {item.notes}</li>}
                                        </ul>
                                    </div>

                                    <div className={styles.itemFooter}>
                                        <button className={styles.itemEditBtn}>
                                            <Edit3 size={14} />
                                        </button>

                                        <div className={styles.quantityControl}>
                                            <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                                <Minus size={14} />
                                            </button>
                                            <span className={styles.qtyValue}>{item.quantity}</span>
                                            <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer actions */}
                <div className={styles.footer}>

                    {hasPromo && (
                        <div className={styles.promoBanner}>
                            <CheckCircle size={14} className={styles.promoIcon} />
                            <span>{promoTitle}</span>
                        </div>
                    )}

                    <div className={styles.breakdown}>
                        <div className={styles.bRow}>
                            <span>Amount</span>
                            <span className={styles.bValue}>IDR {amount.toLocaleString('id-ID')}</span>
                        </div>
                        <div className={styles.bRow}>
                            <span>Discount / Promo</span>
                            <span className={styles.bValue}>IDR -{discount.toLocaleString('id-ID')}</span>
                        </div>
                        <div className={styles.bRow}>
                            <span>Sub Total</span>
                            <span className={styles.bValue}>IDR {subTotal.toLocaleString('id-ID')}</span>
                        </div>
                        <div className={styles.bRow}>
                            <span>Tax (11%)</span>
                            <span className={styles.bValue}>IDR +{tax.toLocaleString('id-ID')}</span>
                        </div>
                        <div className={cn(styles.bRow, styles.totalRow)}>
                            <span>Total</span>
                            <span className={styles.bValue}>IDR {total.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <div className={styles.paymentSection}>
                        <span className={styles.paymentTitle}>Payment Method</span>
                        <div className={styles.paymentMethods}>
                            <button
                                className={cn(styles.payMethodBtn, paymentMethod === 'Qris' && styles.payMethodActive)}
                                onClick={() => setPaymentMethod('Qris')}
                            >
                                {/* QRIS logo mock */}
                                <div className={styles.qrisLogo}>QRIS</div>
                                <span className={styles.payLabel}>Qris</span>
                            </button>

                            <button
                                className={cn(styles.payMethodBtn, paymentMethod === 'Card' && styles.payMethodActive)}
                                onClick={() => setPaymentMethod('Card')}
                            >
                                {/* Mastercard logo mock */}
                                <div className={styles.mcLogos}>
                                    <div className={styles.mcCircleRed} />
                                    <div className={styles.mcCircleOrange} />
                                </div>
                                <span className={styles.payLabel}>Debit / Credit Card</span>
                            </button>
                        </div>
                    </div>

                    <button
                        className={styles.placeOrderBtn}
                        disabled={cartItems.length === 0}
                        onClick={() => checkout(customerName)}
                    >
                        Place Order
                    </button>
                </div>

            </div>
        </div>
    );
}
