import styles from './OrderList.module.css';
import { Volume2 } from 'lucide-react';
import type { Order, OrderStatus } from '../../types';
import { cn } from '../../lib/utils';

interface OrderListProps {
    orders: Order[];
    onOrderClick?: (orderId: string) => void;
}

const getStatusClass = (status: OrderStatus) => {
    if (status === 'Being Cooked') return styles.statusCooked;
    if (status === 'Delivered') return styles.statusDelivered;
    return styles.statusDefault;
};

export function OrderList({ orders, onOrderClick }: OrderListProps) {
    return (
        <div className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Order List</h2>
                <span className={styles.count}>({orders.length} Orders)</span>
            </div>

            <div className={styles.scrollContainer}>
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className={styles.card}
                        onClick={() => onOrderClick?.(order.id)}
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.customerInfo}>
                                <div className={styles.customerAvatar}>🗒️</div>
                                <span className={styles.customerName}>{order.customerName}</span>
                            </div>
                            <span className={styles.trxId}>{order.trxId}</span>
                        </div>

                        <div className={styles.orderDetails}>
                            <span className={styles.orderLabel}>Order :</span>
                            <div className={styles.itemsGrid}>
                                {order.items.slice(0, 4).map((item, idx) => (
                                    <div key={idx} className={styles.itemRow}>
                                        - {item.quantity}x {item.name}
                                    </div>
                                ))}
                                {order.items.length > 4 && (
                                    <div className={styles.itemRow}>- More ...</div>
                                )}
                            </div>
                        </div>

                        <div className={styles.cardFooter}>
                            <span className={cn(styles.statusBadge, getStatusClass(order.status))}>
                                {order.status}
                            </span>
                            <button
                                className={styles.audioBtn}
                                aria-label="Announce status"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Volume2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
