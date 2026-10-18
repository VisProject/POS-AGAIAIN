import styles from './OrderDetailModal.module.css';
import { X } from 'lucide-react';
import type { Order } from '../../types';
import { usePOS } from '../../context/POSContext';

interface OrderDetailModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
}

export function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
    const { updateOrderStatus } = usePOS();

    if (!isOpen || !order) return null;

    const handleStatusUpdate = (status: Order['status'] | 'Call Beeper') => {
        if (status !== 'Call Beeper') {
            updateOrderStatus(order.id, status as Order['status']);
        } else {
            alert(`Calling Beeper ${order.beeperId || 'N/A'}`);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Order Detail</h2>
                    <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
                </div>

                <div className={styles.content}>
                    <div className={styles.summaryBox}>
                        <h3 className={styles.subTitle}>Order Summary</h3>
                        <div className={styles.summaryRow}>
                            <span className={styles.label}>Order Name</span>
                            <div className={styles.valueStack}>
                                <span className={styles.customerName}>{order.customerName}</span>
                                <span className={styles.trxId}>{order.trxId}</span>
                            </div>
                        </div>
                        <div className={styles.summaryRow}>
                            <span className={styles.label}>Beeper ID</span>
                            <span className={styles.beeperId}>{order.beeperId || '#BP-001'}</span>
                        </div>
                    </div>

                    <div className={styles.itemList}>
                        <div className={styles.listHeader}>
                            <span>Item Name</span>
                            <span>Amount</span>
                        </div>

                        {order.items.map((item, idx) => (
                            <div key={idx} className={styles.itemRow}>
                                <div className={styles.itemDetails}>
                                    <h4 className={styles.itemName}>{item.name}</h4>
                                    <span className={styles.orderNotesLabel}>Order notes</span>
                                    <ul className={styles.notesList}>
                                        {item.variation && <li>• {item.variation}</li>}
                                        {item.addOns?.map(a => <li key={a.name}>• {a.name}</li>)}
                                        {item.notes && <li>• {item.notes}</li>}
                                    </ul>
                                </div>
                                <div className={styles.itemAmount}>{item.quantity}</div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.actionSection}>
                        <span className={styles.actionLabel}>Order Action</span>
                        <div className={styles.actionGrid}>
                            <button
                                className={styles.actionBtn}
                                onClick={() => handleStatusUpdate('Being Cooked')}
                            >
                                Being Cooked
                            </button>
                            <button
                                className={styles.actionBtn}
                                onClick={() => handleStatusUpdate('Call Beeper')}
                            >
                                Call Beeper
                            </button>
                            <button
                                className={styles.actionBtn}
                                onClick={() => handleStatusUpdate('Delivered')}
                            >
                                Delivered
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.backBtn} onClick={onClose}>Back</button>
                    <button className={styles.saveBtn} onClick={onClose}>Save</button>
                </div>
            </div>
        </div>
    );
}
