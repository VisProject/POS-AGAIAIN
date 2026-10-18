import React, { useState } from 'react';
import styles from './AdminLayout.module.css'; // Re-use the existing admin layout styling
import { usePOS } from '../../context/POSContext';
import type { UnitType } from '../../types';

export function COGSManager() {
    const { inventory, addInventoryItem } = usePOS();

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [purchaseQuantity, setPurchaseQuantity] = useState('');
    const [purchaseUnit, setPurchaseUnit] = useState<UnitType>('kg');
    const [purchasePrice, setPurchasePrice] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !purchaseQuantity || !purchasePrice) return;

        addInventoryItem({
            id: `inv_${Math.random().toString(36).substr(2, 9)}`,
            name,
            category: category || 'Raw Materials',
            purchaseQuantity: parseFloat(purchaseQuantity),
            purchaseUnit,
            purchasePrice: parseInt(purchasePrice, 10)
        });

        setName('');
        setCategory('');
        setPurchaseQuantity('');
        setPurchasePrice('');
    };

    return (
        <div className={styles.pageContent}>
            <h2 className={styles.pageTitle}>Inventory Setup & COGS Validation</h2>

            <div className={styles.card}>
                <h3>Input New Raw Ingredient</h3>
                <form onSubmit={handleSubmit} className={styles.formGroup}>
                    <div className={styles.inputRow}>
                        <label>Item Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} required className={styles.inputField} placeholder="e.g. Arabica Beans" />
                    </div>
                    <div className={styles.inputRow}>
                        <label>Category (Optional)</label>
                        <input value={category} onChange={e => setCategory(e.target.value)} className={styles.inputField} placeholder="e.g. Coffee" />
                    </div>
                    <div className={styles.inputRow}>
                        <label>Purchase Quantity</label>
                        <input type="number" step="0.01" value={purchaseQuantity} onChange={e => setPurchaseQuantity(e.target.value)} required className={styles.inputField} placeholder="e.g. 5" />
                    </div>
                    <div className={styles.inputRow}>
                        <label>Unit Type</label>
                        <select value={purchaseUnit} onChange={e => setPurchaseUnit(e.target.value as UnitType)} className={styles.inputField}>
                            <option value="kg">kg (Auto converted to gram)</option>
                            <option value="gram">gram</option>
                            <option value="liter">liter (Auto converted to ml)</option>
                            <option value="ml">ml</option>
                            <option value="pcs">pcs</option>
                        </select>
                    </div>
                    <div className={styles.inputRow}>
                        <label>Total Purchase Price (Rp)</label>
                        <input type="number" value={purchasePrice} onChange={e => setPurchasePrice(e.target.value)} required className={styles.inputField} placeholder="e.g. 500000" />
                    </div>

                    <button type="submit" className={styles.primaryBtn} style={{ marginTop: '1rem' }}>Add Inventory Item</button>
                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                        * The system will automatically compute Cost Per Smallest Unit for recipe usage.
                    </p>
                </form>
            </div>

            <div className={styles.card}>
                <h3>Current Inventory & Cost Map</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ padding: '0.5rem' }}>Item</th>
                                <th style={{ padding: '0.5rem' }}>Category</th>
                                <th style={{ padding: '0.5rem' }}>Base Purchase</th>
                                <th style={{ padding: '0.5rem' }}>Auto-System Setup</th>
                                <th style={{ padding: '0.5rem' }}>Cost per Unit (Rp)</th>
                                <th style={{ padding: '0.5rem' }}>Live Stock Available</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map(inv => (
                                <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '0.5rem', fontWeight: 600 }}>{inv.name}</td>
                                    <td style={{ padding: '0.5rem', color: '#666' }}>{inv.category}</td>
                                    <td style={{ padding: '0.5rem' }}>{inv.purchaseQuantity} {inv.purchaseUnit}
                                        <div style={{ fontSize: '0.75rem', color: '#888' }}>Rp {inv.purchasePrice.toLocaleString()}</div>
                                    </td>
                                    <td style={{ padding: '0.5rem', color: '#1a4f36' }}>{inv.totalSmallestUnits} {inv.smallestUnit}</td>
                                    <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>Rp {inv.costPerUnit.toLocaleString(undefined, { minimumFractionDigits: 1 })} / {inv.smallestUnit}</td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <span style={{
                                            background: inv.stockQuantity < inv.totalSmallestUnits * 0.1 ? '#ffebee' : '#e8f5e9',
                                            color: inv.stockQuantity < inv.totalSmallestUnits * 0.1 ? '#d32f2f' : '#2e7d32',
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600
                                        }}>
                                            {inv.stockQuantity} {inv.smallestUnit}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
