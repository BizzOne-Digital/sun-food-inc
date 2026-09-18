"use client";

import { useEffect, useState, useCallback } from "react";
import ProductCard, { ProductCardData } from "./ProductCard";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function ProductsBrowser({ initialCategory }: { initialCategory?: string }) {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState(initialCategory || "");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    params.set("sort", sort);
    params.set("page", String(page));
    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setPages(data.pages || 1);
    } finally {
      setLoading(false);
    }
  }, [category, search, sort, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [category, search, sort]);

  return (
    <div className="container-page py-12">
      <h1 className="font-heading text-4xl font-bold text-brown mb-2">Our Products</h1>
      <p className="text-brown/70 mb-8">Plant-based protein bars, sunnundalu, and kids bars.</p>

      <div className="flex items-center justify-between mb-6 md:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="border border-beige rounded-full px-4 py-2 text-sm font-semibold"
        >
          Filters
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-beige rounded-full px-4 py-2 text-sm flex-1 ml-3"
        />
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden md:block">
          <FilterPanel
            categories={categories}
            category={category}
            setCategory={setCategory}
            sort={sort}
            setSort={setSort}
            search={search}
            setSearch={setSearch}
          />
        </aside>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setDrawerOpen(false)}>
            <div
              className="absolute right-0 top-0 h-full w-72 bg-white p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="mb-4 text-sm font-semibold" onClick={() => setDrawerOpen(false)}>
                Close
              </button>
              <FilterPanel
                categories={categories}
                category={category}
                setCategory={setCategory}
                sort={sort}
                setSort={setSort}
                search={search}
                setSearch={setSearch}
              />
            </div>
          </div>
        )}

        <div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-soft-bg rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-brown/70">No products found.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-full text-sm font-semibold ${
                        page === i + 1 ? "bg-orange text-white" : "bg-white border border-beige"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  categories,
  category,
  setCategory,
  sort,
  setSort,
  search,
  setSearch,
}: {
  categories: Category[];
  category: string;
  setCategory: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="hidden md:block">
        <label className="text-sm font-semibold text-brown mb-2 block">Search</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-beige rounded-full px-4 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-brown mb-2 block">Category</label>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setCategory("")}
            className={`text-left text-sm px-3 py-2 rounded-lg ${!category ? "bg-orange text-white" : "hover:bg-soft-bg"}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setCategory(c.slug)}
              className={`text-left text-sm px-3 py-2 rounded-lg ${
                category === c.slug ? "bg-orange text-white" : "hover:bg-soft-bg"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-brown mb-2 block">Sort By</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full border border-beige rounded-lg px-3 py-2 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
