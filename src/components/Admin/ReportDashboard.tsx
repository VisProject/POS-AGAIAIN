import React, { useState, useMemo } from 'react';
import styles from './AdminLayout.module.css';
import { usePOS } from '../../context/POSContext';
import { TrendingUp, Users, Coffee } from 'lucide-react';
import { PrintableReport } from './PrintableReport';

export function ReportDashboard() {
    const { orders, categories, products } = usePOS();
    const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');

    // Time filter logic
    const { filteredOrders, startDate, endDate } = useMemo(() => {
        const now = new Date();
        now.setHours(23, 59, 59, 999);
        const end = new Date(now);
        const start = new Date(now);

        if (period === 'day') {
            start.setHours(0, 0, 0, 0);
        } else if (period === 'week') {
            start.setDate(start.getDate() - 7);
            start.setHours(0, 0, 0, 0);
        } else if (period === 'month') {
            start.setDate(start.getDate() - 30);
            start.setHours(0, 0, 0, 0);
        }

        const filtered = orders.filter(o => {
            const d = new Date(o.createdAt);
            return d >= start && d <= end;
        });

        // Ensure chronological order for graphing
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        return { filteredOrders: filtered, startDate: start, endDate: end };
    }, [orders, period]);

    const totalRevenue = filteredOrders.reduce((acc, o) => acc + o.totalRevenue, 0);
    const totalCogs = filteredOrders.reduce((acc, o) => acc + o.totalCogs, 0);
    const totalProfit = filteredOrders.reduce((acc, o) => acc + o.totalProfit, 0);
    const margin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : '0.00';

    const totalMenuSold = filteredOrders.reduce((acc, o) => acc + o.items.reduce((sum, item) => sum + item.quantity, 0), 0);
    const customerCount = filteredOrders.length;

    // Graph plotting logic
    const buildPolylines = () => {
        if (filteredOrders.length === 0) return '0,100 500,100'; // flat line

        let cumulative = 0;
        const width = 500;
        const height = 100;
        const totalGrowth = totalRevenue === 0 ? 1 : totalRevenue; // normalize

        const points = filteredOrders.map((o, idx) => {
            cumulative += o.totalRevenue;
            const x = (idx / Math.max(1, filteredOrders.length - 1)) * width;
            // mapping cumulative growth visually from bottom (100) to top (0)
            const y = height - ((cumulative / totalGrowth) * height * 0.8);
            return `${x},${y}`;
        });

        return `0,100 ${points.join(' ')}`;
    };

    const handleDownloadExcel = () => {
        // Construct CSV
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Trx-ID,Date,Customer,Total Revenue,Total COGS,Total Profit\n";

        filteredOrders.forEach(o => {
            const dateStr = new Date(o.createdAt).toLocaleDateString();
            csvContent += `${o.trxId},${dateStr},${o.customerName},${o.totalRevenue},${o.totalCogs},${o.totalProfit}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `AGAIN_SalesReport_${period}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <React.Fragment>
            <div className={styles.pageContent}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                    <div>
                        <h2 className={styles.pageTitle} style={{ marginBottom: '4px' }}>Report Overview</h2>
                        <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>List of transactions recorded over operational timelines.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => window.print()} className={styles.primaryBtn} style={{ background: '#f5f5f5', color: '#d32f2f', border: '1px solid #d32f2f' }}>Download PDF</button>
                        <button onClick={handleDownloadExcel} className={styles.primaryBtn} style={{ background: '#2e7d32' }}>Download Excel</button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    {/* Main Graph Area */}
                    <div className={styles.card} style={{ flex: 2, minWidth: '500px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>Transaction Statistics</h3>
                                <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '4px' }}>Revenue growth representation</p>
                            </div>
                            <select value={period} onChange={e => setPeriod(e.target.value as any)} className={styles.inputField} style={{ width: 'auto', height: '36px' }}>
                                <option value="day">Day</option>
                                <option value="week">Week</option>
                                <option value="month">Month</option>
                            </select>
                        </div>

                        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', background: 'linear-gradient(to top, #fcfcfc, #fff)', border: '1px dashed #eee', borderRadius: '8px', marginTop: '1rem', padding: '1rem', position: 'relative' }}>
                            <div style={{ width: '100%', height: '100px', borderBottom: '2px solid #1a4f36', position: 'relative' }}>
                                <svg width="100%" height="100px" viewBox="-10 0 520 100" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0 }}>
                                    <polyline fill="none" stroke="#1a4f36" strokeWidth="3" strokeLinejoin="round" points={buildPolylines()} />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Key Metrics */}
                    <div className={styles.card} style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                                <TrendingUp size={14} /> Tracking Active
                            </div>
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>for selected period</span>
                        </div>
                        <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>Total Revenue Gained</p>
                        <h2 style={{ color: '#2e7d32', fontSize: '2rem', margin: '4px 0' }}>Rp {totalRevenue.toLocaleString()}</h2>

                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #eee', marginTop: '1rem', paddingTop: '1rem' }}>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>Total Profit</span>
                                <span style={{ fontWeight: 'bold' }}>Rp {totalProfit.toLocaleString()}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>COGS / HPP</span>
                                <span style={{ fontWeight: 'bold', color: '#d32f2f' }}>Rp {totalCogs.toLocaleString()}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>Avg Margin</span>
                                <span style={{ fontWeight: 'bold', color: '#1a4f36' }}>{margin}%</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                            <div style={{ flex: 1, padding: '1rem', background: '#fcfcfc', border: '1px solid #eee', borderRadius: '8px' }}>
                                <Coffee size={20} color="#1976d2" />
                                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '8px' }}>Total Menu Sold</p>
                                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{totalMenuSold.toLocaleString()}</h3>
                            </div>
                            <div style={{ flex: 1, padding: '1rem', background: '#fcfcfc', border: '1px solid #eee', borderRadius: '8px' }}>
                                <Users size={20} color="#f57c00" />
                                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '8px' }}>Customers Walk-in</p>
                                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{customerCount.toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction Ledger */}
                <div className={styles.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <input type="date" disabled value={startDate.toISOString().split('T')[0]} className={styles.inputField} style={{ width: 'auto' }} />
                        <input type="text" placeholder="Search and sort by TRX..." className={styles.inputField} style={{ width: '300px' }} />
                    </div>

                    {filteredOrders.length === 0 ? (
                        <p style={{ color: '#888', textAlign: 'center', margin: '2rem 0' }}>No records found for this period.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #eee', color: '#666', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                        <th style={{ padding: '1rem 0' }}>Trx-ID</th>
                                        <th>Date</th>
                                        <th>Customer</th>
                                        <th>Menu Details</th>
                                        <th style={{ textAlign: 'right' }}>COGS Data</th>
                                        <th style={{ textAlign: 'right' }}>Revenue</th>
                                        <th style={{ textAlign: 'right' }}>Profit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order, idx) => (
                                        <tr key={order.id} style={{ borderBottom: '1px solid #f5f5f5', background: idx % 2 === 0 ? '#fff' : '#fcfcfc' }}>
                                            <td style={{ padding: '1rem 0', fontWeight: 'bold' }}>{order.trxId}</td>
                                            <td style={{ color: '#888' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>{order.customerName}</td>
                                            <td>
                                                {order.items.map((item, i) => (
                                                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                                                        <span style={{ fontWeight: 500 }}>{item.quantity}x</span>
                                                        <span>{item.name}</span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td style={{ textAlign: 'right', color: '#d32f2f' }}>Rp {order.totalCogs.toLocaleString()}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 600 }}>Rp {order.totalRevenue.toLocaleString()}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 600, color: '#2e7d32' }}>Rp {order.totalProfit.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <PrintableReport
                orders={filteredOrders}
                categories={categories}
                products={products}
                period={period}
                startDate={startDate}
                endDate={endDate}
            />
        </React.Fragment>
    );
}
