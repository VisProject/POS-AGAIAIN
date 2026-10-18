import { Routes, Route, Link, useLocation } from 'react-router-dom';
import styles from './AdminLayout.module.css';
import { LayoutDashboard, Coffee, Archive, ChevronLeft } from 'lucide-react';

import { MenuManager } from './MenuManager';
import { COGSManager } from './COGSManager';
import { ReportDashboard } from './ReportDashboard';

export function AdminLayout() {
    const location = useLocation();

    const getLinkClass = (path: string) => {
        return location.pathname === path
            ? `${styles.navLink} ${styles.navLinkActive}`
            : styles.navLink;
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>
                        <img src="/Assets image & logo/logo.png" alt="Admin Logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
                        Admin
                    </div>
                </div>

                <nav className={styles.nav}>
                    <Link to="/admin" className={getLinkClass('/admin')}>
                        <LayoutDashboard size={18} /> Overview
                    </Link>
                    <Link to="/admin/menu" className={getLinkClass('/admin/menu')}>
                        <Coffee size={18} /> Menu Management
                    </Link>
                    <Link to="/admin/cogs" className={getLinkClass('/admin/cogs')}>
                        <Archive size={18} /> COGS Management
                    </Link>

                    <div className={styles.spacer} />
                    <Link to="/" className={styles.navLink}>
                        <ChevronLeft size={18} /> Back to POS
                    </Link>
                </nav>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.topbar}>
                    <div className={styles.topbarLeft}>
                        <h1>Admin Dashboard</h1>
                    </div>
                </header>

                <div className={styles.contentArea}>
                    <Routes>
                        <Route path="/" element={<ReportDashboard />} />
                        <Route path="/menu" element={<MenuManager />} />
                        <Route path="/cogs" element={<COGSManager />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}
