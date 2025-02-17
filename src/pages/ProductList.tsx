import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface ProductListProps {
  username?: string;
}

export default function ProductList({ username }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [showBorder, setShowBorder] = useState(false);

  const displayName = username || 'Fallback Name';

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        const uniqueCategories = ['all', ...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  const toggleBorder = () => {
    setShowBorder((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="text-lg text-gray-600 font-medium">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Fixed Overlay for Border & Shell Name */}
      {showBorder && (
        <div className="fixed inset-0 z-50 pointer-events-none border-4 border-blue-500">
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Shell 2
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm p-6 space-y-4 fixed h-screen">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Store</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome, {displayName}</p>
          </div>

          <nav className="space-y-1">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <Link 
              href="http://localhost:3000"
              className="block text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Logout
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {/* Search Bar */}
          <div className="mb-8 sticky top-0 bg-gray-50 pt-4 pb-4 z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Category Title */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'all' 
                ? 'All Products' 
                : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
            </h2>
            <span className="text-sm text-gray-600">
              {filteredProducts.length} products
            </span>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.slice(0, visibleCount).map((product) => (
              <Link 
                key={product.id} 
                href={`/checkout?productId=${product.id}`}
                className="group bg-white rounded-xl p-6 transition-all duration-200 hover:shadow-lg border border-gray-100"
              >
                <div className="aspect-w-1 aspect-h-1 w-full mb-6 relative">
                  <div className="absolute top-0 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded-full m-2">
                    ★ {product.rating.rate}
                  </div>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-contain object-center group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[40px]">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price}
                    </span>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                      Buy Now
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {product.rating.count} reviews
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* No Results Message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
            </div>
          )}

          {/* Load More Button */}
          {visibleCount < filteredProducts.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Load More
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Toggle Border Button fixed at bottom right */}
      <button
        onClick={toggleBorder}
        className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition shadow-lg z-50"
      >
        {showBorder ? 'Hide Border' : 'Show Border'}
      </button>
    </>
  );
}
