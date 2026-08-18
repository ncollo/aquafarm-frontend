import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ShoppingCart, Search, Filter, Star, ArrowRight, Fish, Package, Truck, Shield, Plus, Minus, X, Phone } from "lucide-react";

type Category = "all" | "fish" | "rods" | "tackle" | "accessories" | "feed" | "fingerlings";

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All Products" },
  { id: "fish", label: "Fresh Fish" },
  { id: "fingerlings", label: "Fingerlings" },
  { id: "rods", label: "Rods & Reels" },
  { id: "tackle", label: "Tackle & Bait" },
  { id: "feed", label: "Fish Feed" },
  { id: "accessories", label: "Accessories" },
];

const products = [
  // Fresh Fish
  { id: 1, name: "Fresh Nile Tilapia (Whole)", category: "fish" as Category, price: 350, unit: "per kg", rating: 4.9, reviews: 120, stock: "In Stock", desc: "Farm-fresh whole tilapia, cleaned and ready. Average fish weight 400–600g.", image: "https://images.unsplash.com/photo-1649347173558-a305d7b8ff98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxhcGlhJTIwZmlzaCUyMHdhdGVyJTIwYXF1YWN1bHR1cmV8ZW58MXx8fHwxNzc0NTQ0MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080", tag: "Bestseller" },
  { id: 2, name: "Fresh African Catfish", category: "fish" as Category, price: 400, unit: "per kg", rating: 4.8, reviews: 84, stock: "In Stock", desc: "Whole catfish, farm-fresh. Available in sizes 500g–2kg per fish.", image: "https://images.unsplash.com/photo-1607629194620-a9726803827c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMGhhcnZlc3QlMjBmcmVzaCUyMGZpc2glMjB3b3JrZXJzfGVufDF8fHx8MTc3NDU0NDM4MXww&ixlib=rb-4.1.0&q=80&w=1080", tag: "Popular" },
  { id: 3, name: "Premium Rainbow Trout", category: "fish" as Category, price: 650, unit: "per kg", rating: 4.9, reviews: 45, stock: "Limited", desc: "Cold-water premium trout, rich in Omega-3. Restaurant and hotel grade.", image: "https://images.unsplash.com/photo-1770529882297-d60092c0c834?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaHdhdGVyJTIwZmlzaCUyMGNhcnAlMjBwb25kJTIwc3VyZmFjZXxlbnwxfHx8fDE3NzQ1NDQzODR8MA&ixlib=rb-4.1.0&q=80&w=1080", tag: "Premium" },
  // Fingerlings
  { id: 4, name: "Tilapia Fingerlings (100 pcs)", category: "fingerlings" as Category, price: 1500, unit: "per 100", rating: 4.8, reviews: 62, stock: "In Stock", desc: "Certified Grade-A Nile Tilapia fingerlings, 3–5cm. Disease-free, vaccinated.", image: "https://images.unsplash.com/photo-1738508041350-03453c14811c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMHBvbmQlMjBhZXJpYWwlMjBLZW55YXxlbnwxfHx8fDE3NzQ1NDQzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080", tag: "Certified" },
  { id: 5, name: "Catfish Fingerlings (50 pcs)", category: "fingerlings" as Category, price: 1200, unit: "per 50", rating: 4.7, reviews: 38, stock: "In Stock", desc: "African Catfish fingerlings, 4–6cm. Ready for pond stocking.", image: "https://images.unsplash.com/photo-1758854486625-2ef3d73853fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhcG9uaWNzJTIwd2F0ZXIlMjB0ZWNobm9sb2d5JTIwZmlzaCUyMHRhbmt8ZW58MXx8fHwxNzc0NTQ0Mzg0fDA&ixlib=rb-4.1.0&q=80&w=1080", tag: "In Stock" },
  // Rods & Reels
  { id: 6, name: "Beginner Fishing Rod Set", category: "rods" as Category, price: 2500, unit: "per set", rating: 4.5, reviews: 29, stock: "In Stock", desc: "Complete starter kit — 1.8m fiberglass rod, spinning reel, line, and basic tackle box.", image: "https://images.unsplash.com/photo-1695035711091-0658605fe1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwZXF1aXBtZW50JTIwc3RvcmUlMjB0YWNrbGUlMjByb2RzfGVufDF8fHx8MTc3NDU0NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080", tag: "Starter" },
  { id: 7, name: "Pro Angler Carbon Fiber Rod", category: "rods" as Category, price: 8500, unit: "per piece", rating: 4.9, reviews: 17, stock: "Limited", desc: "2.4m ultra-light carbon fiber rod. Professional grade for competitive sport fishing.", image: "https://images.unsplash.com/photo-1695035711091-0658605fe1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwZXF1aXBtZW50JTIwc3RvcmUlMjB0YWNrbGUlMjByb2RzfGVufDF8fHx8MTc3NDU0NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080", tag: "Pro" },
  // Tackle & Bait
  { id: 8, name: "Assorted Hooks Pack (50 pcs)", category: "tackle" as Category, price: 350, unit: "per pack", rating: 4.7, reviews: 55, stock: "In Stock", desc: "Mixed sizes 4–12 barbless hooks. Suitable for tilapia and catfish.", image: "https://images.unsplash.com/photo-1695035711091-0658605fe1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwZXF1aXBtZW50JTIwc3RvcmUlMjB0YWNrbGUlMjByb2RzfGVufDF8fHx8MTc3NDU0NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080", tag: "Value Pack" },
  { id: 9, name: "Artificial Lure Collection (10 pcs)", category: "tackle" as Category, price: 1200, unit: "per set", rating: 4.6, reviews: 22, stock: "In Stock", desc: "10 colorful artificial lures for bass and catfish. Floating and sinking types included.", image: "https://images.unsplash.com/photo-1695035711091-0658605fe1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwZXF1aXBtZW50JTIwc3RvcmUlMjB0YWNrbGUlMjByb2RzfGVufDF8fHx8MTc3NDU0NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080", tag: "In Stock" },
  // Fish Feed
  { id: 10, name: "Premium Floating Pellets (5kg)", category: "feed" as Category, price: 950, unit: "per bag", rating: 4.9, reviews: 73, stock: "In Stock", desc: "High-protein (38%) floating fish pellets for Tilapia and Catfish grow-out stage.", image: "https://images.unsplash.com/photo-1738508041350-03453c14811c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMHBvbmQlMjBhZXJpYWwlMjBLZW55YXxlbnwxfHx8fDE3NzQ1NDQzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080", tag: "Certified Feed" },
  { id: 11, name: "Fingerling Starter Crumbles (1kg)", category: "feed" as Category, price: 450, unit: "per bag", rating: 4.8, reviews: 41, stock: "In Stock", desc: "Ultra-fine 45% protein starter feed crumbles for fingerlings up to 10g.", image: "https://images.unsplash.com/photo-1738508041350-03453c14811c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMHBvbmQlMjBhZXJpYWwlMjBLZW55YXxlbnwxfHx8fDE3NzQ1NDQzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080", tag: "Starter" },
  // Accessories
  { id: 12, name: "Fishing Hat & UV Gloves Set", category: "accessories" as Category, price: 800, unit: "per set", rating: 4.5, reviews: 18, stock: "In Stock", desc: "Wide-brim waterproof fishing hat and UV-protection fingerless gloves. Perfect for outdoor fishing.", image: "https://images.unsplash.com/photo-1695035711091-0658605fe1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwZXF1aXBtZW50JTIwc3RvcmUlMjB0YWNrbGUlMjByb2RzfGVufDF8fHx8MTc3NDU0NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080", tag: "New" },
];

interface CartItem { id: number; name: string; price: number; qty: number; unit: string; }

export function Store() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const filtered = products.filter(p =>
    (activeCategory === "all" || p.category === activeCategory) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: typeof products[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, unit: product.unit }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div>
      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1695035711091-0658605fe1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwZXF1aXBtZW50JTIwc3RvcmUlMjB0YWNrbGUlMjByb2RzfGVufDF8fHx8MTc3NDU0NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Fish Store"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-teal-900/80" />
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Shop</span>
          <h1 className="mt-2 mb-3" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700 }}>
            Aquafarm Fish Store
          </h1>
          <p className="text-teal-200 text-lg max-w-xl mx-auto">
            Fresh fish, certified fingerlings, quality feeds, and professional fishing equipment — all in one place.
          </p>
        </div>
      </section>

      {/* Store Features */}
      <div className="bg-teal-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-center">
          {[
            { icon: Fish, text: "Farm-Fresh Daily" },
            { icon: Truck, text: "Delivery Available — Nakuru & Nairobi" },
            { icon: Shield, text: "Quality Guaranteed" },
            { icon: Package, text: "Bulk Orders Welcome" },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center justify-center gap-2 text-teal-200">
              <Icon size={15} className="text-amber-400" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Search & Cart Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
          >
            <ShoppingCart size={16} />
            View Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-teal-700 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-44 overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                  product.stock === "In Stock" ? "bg-green-600 text-white" :
                  product.stock === "Limited" ? "bg-amber-600 text-white" : "bg-red-600 text-white"
                }`}>
                  {product.stock}
                </span>
                {product.tag && (
                  <span className="absolute top-2 left-2 bg-teal-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {product.tag}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-gray-900 font-semibold text-sm leading-tight">{product.name}</h3>
                <div className="flex items-center gap-1 my-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={11} className={j < Math.round(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                  ))}
                  <span className="text-gray-400 text-xs">({product.reviews})</span>
                </div>
                <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.desc}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-teal-700 font-bold">KES {product.price.toLocaleString()}</span>
                    <span className="text-gray-400 text-xs ml-1">{product.unit}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <ShoppingCart size={12} /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Fish size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No products found. Try a different search or category.</p>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCart(false)} />
          <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <ShoppingCart size={18} className="text-teal-700" /> Shopping Cart ({cartCount})
              </h2>
              <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ShoppingCart size={40} className="mx-auto mb-3" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl p-3">
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium text-sm">{item.name}</p>
                      <p className="text-teal-700 text-sm font-semibold">KES {item.price.toLocaleString()} {item.unit}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <Minus size={13} />
                      </button>
                      <span className="text-gray-900 font-semibold w-6 text-center text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-5 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-700 font-semibold">Total:</span>
                  <span className="text-teal-700 font-bold text-xl">KES {cartTotal.toLocaleString()}</span>
                </div>
                <a
                  href={`https://wa.me/254700000000?text=Hello Aquafarm! I'd like to order: ${cart.map(i => `${i.qty}x ${i.name}`).join(", ")}. Total: KES ${cartTotal.toLocaleString()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  <Phone size={16} />
                  Order via WhatsApp
                </a>
                <p className="text-center text-gray-400 text-xs mt-2">Or call +254 700 000 000 for bulk orders</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
