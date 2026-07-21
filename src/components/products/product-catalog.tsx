"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/form";
import { EmptyState } from "@/components/ui/table";
import { SearchIcon } from "@/components/ui/icons";

export type ProductStat = {
  id: string;
  name: string;
  supplierCount: number;
  bestPrice: number | null;
  currency: string | null;
  quoteCount: number;
  sampleCount: number;
  orderCount: number;
};

export function ProductCatalog({ products }: { products: ProductStat[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, query]);

  return (
    <div>
      <div className="relative mb-4">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          <SearchIcon size={16} />
        </span>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="pl-10"
        />
      </div>

      {!filtered.length ? (
        <EmptyState message="No products match your search." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {filtered.map((product) => (
            <div key={product.id} className="border border-ink bg-paper-card p-4">
              <Link
                href={`/dashboard/products/${product.id}`}
                className="font-display text-lg font-bold uppercase tracking-tight hover:text-rust"
              >
                {product.name}
              </Link>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[0.6875rem] uppercase tracking-widest text-muted">
                    Suppliers
                  </p>
                  <p className="font-display text-2xl font-bold text-ink">{product.supplierCount}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-widest text-muted">
                    Best Price
                  </p>
                  <p className="font-display text-2xl font-bold text-ink">
                    {product.bestPrice !== null
                      ? `${product.currency ?? ""} ${product.bestPrice.toFixed(2)}`
                      : "—"}
                  </p>
                </div>
              </div>
              <p className="mt-3 font-mono text-xs text-muted">
                {product.quoteCount} quotes · {product.sampleCount} samples · {product.orderCount} orders
              </p>
              <div className="mt-3 flex items-center gap-4 border-t border-ink/20 pt-3">
                <Link
                  href={`/dashboard/quotes?product=${encodeURIComponent(product.name)}`}
                  className="font-mono text-xs font-semibold uppercase tracking-wider text-steel hover:text-rust"
                >
                  Quotes →
                </Link>
                <Link
                  href={`/dashboard/samples?product=${encodeURIComponent(product.name)}`}
                  className="font-mono text-xs font-semibold uppercase tracking-wider text-steel hover:text-rust"
                >
                  Samples →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
