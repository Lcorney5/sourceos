export function ProductNameDatalist({ products }: { products: { name: string }[] }) {
  return (
    <datalist id="product-names">
      {products.map((p) => (
        <option key={p.name} value={p.name} />
      ))}
    </datalist>
  );
}
