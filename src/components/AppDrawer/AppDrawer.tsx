import { useState } from 'react';
import styles from './AppDrawer.module.css';
import { LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AppDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AppDrawer({ isOpen, onClose }: AppDrawerProps) {
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    if (!isOpen) return null;

    const toggleAcc = (name: string) => {
        setOpenAccordion(openAccordion === name ? null : name);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>

                <div className={styles.header}>
                    <div className={styles.logo}>
                        <img src="/Assets image & logo/logo.png" alt="Logo" className={styles.logoImg} />
                    </div>
                    <button className={styles.closeIconBtn} onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                </div>

                <div className={styles.userCard}>
                    <div className={styles.avatar}>🧑‍💼</div>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>Johnsondoe</span>
                        <span className={styles.userTime}>09:00 - 14:00</span>
                    </div>
                    <div className={styles.swapIcon}>↕</div>
                </div>

                <nav className={styles.navGroup}>
                    <div className={styles.navItemActive}>
                        <span>Cashier</span>
                    </div>

                    <div className={styles.accordionGroup}>
                        <button className={styles.accordionHeader} onClick={() => toggleAcc('report')}>
                            <div className={styles.accLeft}>
                                <span>📊</span>
                                <span>Report</span>
                            </div>
                            {openAccordion === 'report' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {openAccordion === 'report' && (
                            <div className={styles.accordionContent}>
                                <Link to="/admin" className={styles.subItem} onClick={onClose}>Dashboard Overview</Link>
                                <div className={styles.subItem}>Daily Summary</div>
                            </div>
                        )}
                    </div>

                    <div className={styles.accordionGroup}>
                        <button className={styles.accordionHeader} onClick={() => toggleAcc('history')}>
                            <div className={styles.accLeft}>
                                <span>🕒</span>
                                <span>History</span>
                            </div>
                            {openAccordion === 'history' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {openAccordion === 'history' && (
                            <div className={styles.accordionContent}>
                                <div className={styles.subItem}>Transaction History</div>
                                <div className={styles.subItem}>Billing History</div>
                            </div>
                        )}
                    </div>

                    <div className={styles.accordionGroup}>
                        <button className={styles.accordionHeader} onClick={() => toggleAcc('supply')}>
                            <div className={styles.accLeft}>
                                <span>📦</span>
                                <span>Supply</span>
                            </div>
                            {openAccordion === 'supply' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {openAccordion === 'supply' && (
                            <div className={styles.accordionContent}>
                                <Link to="/admin/menu" className={styles.subItem} onClick={onClose}>Admin Menu</Link>
                                <Link to="/admin/cogs" className={styles.subItem} onClick={onClose}>COGS & Ingredients</Link>
                                <div className={styles.subItem}>Inventory per Outlet</div>
                            </div>
                        )}
                    </div>
                </nav>

                <div className={styles.footer}>
                    <button className={styles.logoutBtn}>
                        <LogOut size={18} />
                        <span>Log out</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
