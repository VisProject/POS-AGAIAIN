import { usePOS } from '../../context/POSContext';
import styles from './Layout.module.css';
import { Search, Layout as LayoutIcon } from 'lucide-react';
import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
    onMenuClick?: () => void;
}

export function Layout({ children, onMenuClick }: LayoutProps) {
    const { isCartOpen, setIsCartOpen } = usePOS();

    return (
        <div className={styles.container}>
            {/* Header Area */}
            <header className={styles.header}>
                <div className={styles.leftGroup}>
                    <button className={styles.iconBtn} aria-label="Menu" onClick={onMenuClick}>
                        <LayoutIcon size={20} />
                    </button>
                    <div className={styles.logo}>
                        <img src="/Assets image & logo/logo.png" alt="Logo" className={styles.logoImg} />
                    </div>
                    <div className={styles.searchBar}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search"
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                <div className={styles.rightGroup}>
                    <button
                        className={styles.cartOrderBtn}
                        onClick={() => setIsCartOpen(!isCartOpen)}
                    >
                        Cart Order
                    </button>
                    <button
                        className={styles.closeOrderBtn}
                        onClick={() => setIsCartOpen(!isCartOpen)}
                    >
                        Close Order
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
