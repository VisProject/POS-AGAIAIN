import React, { useState } from 'react';
import styles from './AdminLayout.module.css';
import { usePOS } from '../../context/POSContext';
import { Plus, Trash2 } from 'lucide-react';
import type { RecipeIngredient } from '../../types';

export function MenuManager() {
    const { categories, products, inventory, addProduct } = usePOS();
    
    // Core details
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    
    // Recipe Builder
    const [recipe, setRecipe] = useState<RecipeIngredient[]>([]);
    
    // Pricing
    const [sellingPrice, setSellingPrice] = useState('');

    // Dynamic State UI hooks
    const [selectedInvItem, setSelectedInvItem] = useState('');
    const [invUsage, setInvUsage] = useState('');

    // Computation
    const calculatedCogs = recipe.reduce((total, rItem) => {
        const inv = inventory.find(i => i.id === rItem.inventoryItemId);
        if(!inv) return total;
        return total + (inv.costPerUnit * rItem.quantityUsed);
    }, 0);

    const priceNum = parseInt(sellingPrice, 10) || 0;
    const profit = Math.max(0, priceNum - calculatedCogs);
    const margin = priceNum > 0 ? ((profit / priceNum) * 100).toFixed(1) : '0.0';

    const handleAddIngredient = () => {
        if (!selectedInvItem || !invUsage) return;
        setRecipe([...recipe, {
            inventoryItemId: selectedInvItem,
            quantityUsed: parseFloat(invUsage)
        }]);
        setInvUsage('');
        setSelectedInvItem('');
    };

    const handleRemoveIngredient = (invId: string) => {
        setRecipe(recipe.filter(r => r.inventoryItemId !== invId));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const activeCatId = categoryId || categories[0]?.id;
        if (!name || !sellingPrice || !activeCatId) return;

        const cat = categories.find(c => c.id === activeCatId);
        
        addProduct({
            name,
            price: priceNum,
            categoryId: activeCatId,
            categoryName: cat?.name || 'Unknown',
            image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&q=80',
            recipe,
            cogs: calculatedCogs,
            profit,
            margin: parseFloat(margin),
            isPublished: true
        });

        setName('');
        setSellingPrice('');
        setRecipe([]);
        alert('Menu Item successfully published to POS!');
    };

    return (
        <div className={styles.pageContent}>
            <h2 className={styles.pageTitle}>Menu Builder & Pricing</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Left Side: Creation Form */}
                <div className={styles.card}>
                    <h3>Create Menu Logic</h3>
                    <form onSubmit={handleSubmit} className={styles.formGroup}>
                        <div className={styles.inputRow}>
                            <label>Menu Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} required className={styles.inputField} placeholder="e.g. Signature Iced Latte" />
                        </div>
                        <div className={styles.inputRow}>
                            <label>Category</label>
                            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={styles.inputField}>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <hr style={{ margin: '1.5rem 0', borderColor: '#eee' }} />
                        
                        <h4>Recipe COGS Builder</h4>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', alignItems: 'flex-end' }}>
                            <div style={{ flex: 2 }}>
                                <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '4px' }}>Inventory Item</label>
                                <select value={selectedInvItem} onChange={e => setSelectedInvItem(e.target.value)} className={styles.inputField}>
                                    <option value="">Select ingredient...</option>
                                    {inventory.map(inv => <option key={inv.id} value={inv.id}>{inv.name} (Rp {inv.costPerUnit.toLocaleString(undefined, {minimumFractionDigits: 1})}/{inv.smallestUnit})</option>)}
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '4px' }}>
                                    Usage Count ({selectedInvItem ? inventory.find(i=>i.id===selectedInvItem)?.smallestUnit : 'unit'})
                                </label>
                                <input type="number" step="0.1" value={invUsage} onChange={e => setInvUsage(e.target.value)} className={styles.inputField} placeholder="e.g. 15" />
                            </div>
                            <button type="button" onClick={handleAddIngredient} className={styles.primaryBtn} style={{ padding: '0.5rem', width: 'auto' }}>
                                <Plus size={20} />
                            </button>
                        </div>

                        <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            {recipe.length === 0 ? <p style={{ fontSize: '0.85rem', color: '#888', margin: 0, textAlign: 'center' }}>No ingredients attached.</p> : (
                                <table style={{width: '100%', fontSize: '0.85rem'}}>
                                    <tbody>
                                        {recipe.map(rItem => {
                                            const inv = inventory.find(i => i.id === rItem.inventoryItemId);
                                            if(!inv) return null;
                                            const cost = inv.costPerUnit * rItem.quantityUsed;
                                            return (
                                                <tr key={rItem.inventoryItemId}>
                                                    <td style={{padding: '4px 0'}}>{inv.name}</td>
                                                    <td style={{padding: '4px 0'}}>{rItem.quantityUsed} {inv.smallestUnit}</td>
                                                    <td style={{padding: '4px 0', textAlign: 'right'}}>Rp {cost.toLocaleString()}</td>
                                                    <td style={{padding: '4px 0', textAlign: 'right'}}>
                                                        <button type="button" onClick={() => handleRemoveIngredient(rItem.inventoryItemId)} style={{ background: 'transparent', border: 'none', color: '#d32f2f', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr style={{borderTop: '1px solid #ccc', fontWeight: 'bold'}}>
                                            <td colSpan={2} style={{paddingTop: '8px'}}>Total COGS (HPP):</td>
                                            <td style={{paddingTop: '8px', textAlign: 'right', color: '#d32f2f'}}>Rp {calculatedCogs.toLocaleString()}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            )}
                        </div>

                        <hr style={{ margin: '1.5rem 0', borderColor: '#eee' }} />

                        <h4>Pricing Strategy</h4>
                        <div className={styles.inputRow}>
                            <label>Target Selling Price (Rp)</label>
                            <input type="number" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} required className={styles.inputField} style={{ fontSize: '1.2rem', padding: '0.75rem' }} placeholder="0" />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
                            <div style={{ flex: 1 }}>
                                <span style={{ display: 'block', fontSize: '0.8rem', color: '#2e7d32' }}>Estimated Profit</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a4f36' }}>Rp {profit.toLocaleString()}</span>
                            </div>
                            <div style={{ flex: 1, borderLeft: '1px solid #a5d6a7', paddingLeft: '1rem' }}>
                                <span style={{ display: 'block', fontSize: '0.8rem', color: '#2e7d32' }}>Gross Margin</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a4f36' }}>{margin}%</span>
                            </div>
                        </div>

                        <button type="submit" className={styles.primaryBtn} style={{ marginTop: '2rem', width: '100%', padding: '1rem' }}>Finalize & Publish to POS</button>
                    </form>
                </div>

                {/* Right Side: Published Menus Preview */}
                <div className={styles.card}>
                    <h3>Live Published Modules ({products.length})</h3>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>These menus are active via the POS screen.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '700px', overflowY: 'auto' }}>
                        {products.slice().reverse().map(p => (
                            <div key={p.id} style={{ border: '1px solid #eaeaea', borderRadius: '8px', padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <div>
                                        <h4 style={{ margin: 0 }}>{p.name}</h4>
                                        <span style={{ fontSize: '0.75rem', background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>{p.categoryName}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontWeight: 'bold', display: 'block' }}>Rp {p.price.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', borderTop: '1px dashed #eee', paddingTop: '0.5rem' }}>
                                    <span style={{ color: '#d32f2f' }}>COGS: Rp {p.cogs.toLocaleString()}</span>
                                    <span style={{ color: '#2e7d32' }}>Margin: {(p.margin * 100).toFixed(1)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
