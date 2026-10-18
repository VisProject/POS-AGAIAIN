import { useState } from 'react';
import styles from './MenuGrid.module.css';
import type { MenuCategory, Product } from '../../types';
import { cn } from '../../lib/utils';
import { LayoutGrid, Coffee, Star, Droplets, Leaf, CupSoda, CakeSlice } from 'lucide-react';

interface MenuGridProps {
    categories: MenuCategory[];
    products: Product[];
    onProductClick?: (product: Product) => void;
}

// Map category icons generically
const getCategoryIcon = (name: string, isActive: boolean) => {
    const props = { size: 18, className: cn(styles.catIcon, isActive && styles.catIconActive) };
    if (name.includes('All')) return <LayoutGrid {...props} />;
    if (name.includes('Coffee')) return <Coffee {...props} />;
    if (name.includes('Signature')) return <Star {...props} />;
    if (name.includes('Matcha')) return <Leaf {...props} />;
    if (name.includes('Pastry')) return <CakeSlice {...props} />;
    if (name.includes('Tea')) return <Droplets {...props} />;
    return <CupSoda {...props} />;
};

export function MenuGrid({ categories, products, onProductClick }: MenuGridProps) {
    const [activeCategory, setActiveCategory] = useState<string>('All');

    const publishedProducts = products.filter(p => p.isPublished !== false);
    
    // Filter products based on active category
    const filteredProducts = activeCategory === 'All'
        ? publishedProducts
        : publishedProducts.filter(p => p.categoryId === activeCategory);

    return (
        <div className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Menu</h2>
                <span className={styles.count}>({products.length} Items)</span>
            </div>

            {/* Category Pills */}
            <div className={styles.categoryScroll}>
                <button
                    className={cn(styles.categoryPill, activeCategory === 'All' && styles.categoryPillActive)}
                    onClick={() => setActiveCategory('All')}
                >
                    {getCategoryIcon('All Menu', activeCategory === 'All')}
                    <div className={styles.catTextGroup}>
                        <span className={styles.catName}>All Menu</span>
                        <span className={styles.catCount}>({products.length} Items)</span>
                    </div>
                </button>

                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={cn(styles.categoryPill, activeCategory === cat.id && styles.categoryPillActive)}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        {getCategoryIcon(cat.name, activeCategory === cat.id)}
                        <div className={styles.catTextGroup}>
                            <span className={styles.catName}>{cat.name}</span>
                            <span className={styles.catCount}>({cat.itemCount} Items)</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className={styles.grid}>
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className={styles.productCard}
                        onClick={() => onProductClick?.(product)}
                    >
                        <div className={styles.imageContainer}>
                            <img src={product.image} alt={product.name} className={styles.productImage} />
                        </div>

                        <div className={styles.productInfo}>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <div className={styles.productMeta}>
                                <span className={styles.categoryBadge}>{product.categoryName}</span>
                                <span className={styles.productPrice}>
                                    {product.price.toLocaleString('id-ID', { minimumFractionDigits: 3 })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
