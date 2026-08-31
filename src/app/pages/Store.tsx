import React, { useState, useEffect } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  ShoppingCart, Search, Filter, Star, ArrowRight, Fish, Package,
  Truck, Shield, Plus, Minus, X, Phone, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle
} from "lucide-react";
import { fetchProducts } from "../services/api";
import api from "../../utils/api";

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

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  unit: string;
  stock: number;
}

export function Store() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "payment">("cart");

  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Customer Checkout Form
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutFeedback, setCheckoutFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts();
      const mapped = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category?.toLowerCase() as Category,
        price: p.price,
        unit: p.unit || "per kg",
        stock: p.stock,
        rating: 4.9,
        reviews: Math.floor(Math.random() * 40) + 15,
        desc: p.description || "Farm-fresh aquaculture product directly from Aquafarm Fisheries.",
        image: p.imageUrl || "https://images.unsplash.com/photo-1649347173558-a305d7b8ff98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxhcGlhJTIwZmlzaCUyMHdhdGVyJTIwYXF1YWN1bHR1cmV8ZW58MXx8fHwxNzc0NTQ0MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
        status: p.status,
      }));
      setAllProducts(mapped);
    } catch (error) {
      console.error("Failed to fetch store products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = allProducts.filter((p) => {
    const matchesCategory =
      activeCategory === "all" ||
      p.category === activeCategory ||
      (activeCategory === "fish" && (p.category === "tilapia" || p.category === "catfish" || p.category === "trout"));
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.desc?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: Math.min(product.stock, i.qty + 1) } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          unit: product.unit,
          stock: product.stock,
        },
      ];
    });

    setAddedItemId(product.id);
    setTimeout(() => {
      setAddedItemId(null);
    }, 1800);
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const nextQty = i.qty + delta;
            return { ...i, qty: Math.min(i.stock, Math.max(0, nextQty)) };
          }
          return i;
        })
        .filter((i) => i.qty > 0)
    );
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const handleMpesaCheckout = async () => {
    let cleanPhone = phoneNumber.trim().replace(/\s+/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = `254${cleanPhone.slice(1)}`;
    } else if (cleanPhone.startsWith("+")) {
      cleanPhone = cleanPhone.slice(1);
    }

    if (!cleanPhone.startsWith("254") || cleanPhone.length < 12) {
      setCheckoutFeedback({
        type: "error",
        message: "Please enter a valid Safaricom phone number (e.g. 0712345678 or 254712345678)",
      });
      return;
    }

    setIsCheckingOut(true);
    setCheckoutFeedback(null);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.id,
        quantity: item.qty,
      }));

      // 1. Create Order in Database
      const orderRes = await api.post("/orders", {
        orderType: "RETAIL",
        deliveryAddress: deliveryAddress || "Store Pickup",
        customerName: customerName || "Online Customer",
        customerEmail: customerEmail || null,
        customerPhone: cleanPhone,
        items: orderItems,
      });

      const orderData = orderRes.data;

      // 2. Trigger M-Pesa STK Push
      await api.post("/payments/checkout", {
        orderId: orderData.id,
        phoneNumber: cleanPhone,
      });

      setCheckoutFeedback({
        type: "success",
        message: `Order #${orderData.orderNumber} placed! Please check your phone for the M-Pesa PIN prompt to finalize payment.`,
      });

      setTimeout(() => {
        setCart([]);
        setShowCart(false);
        setCheckoutStep("cart");
        setCustomerName("");
        setCustomerEmail("");
        setDeliveryAddress("");
        setPhoneNumber("");
        setCheckoutFeedback(null);
        loadProducts(); // refresh available stock
      }, 4000);
    } catch (error: any) {
      console.error("[Checkout] Error processing order:", error);
      const errMsg = error.response?.data?.error || error.message || "Failed to process checkout. Please try again.";
      setCheckoutFeedback({ type: "error", message: errMsg });
    } finally {
      setIsCheckingOut(false);
    }
  };

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
            Fresh fish, certified fingerlings, quality feeds, and professional fishing equipment — live from our farm.
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
              placeholder="Search live products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadProducts}
              title="Refresh Catalog"
              className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => { setCheckoutStep("cart"); setShowCart(true); }}
              className="relative flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm"
            >
              <ShoppingCart size={16} />
              View Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((cat) => (
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

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse space-y-3">
                <div className="bg-gray-200 h-44 rounded-xl" />
                <div className="bg-gray-200 h-4 rounded w-3/4" />
                <div className="bg-gray-200 h-3 rounded w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <div className="bg-gray-200 h-5 rounded w-1/3" />
                  <div className="bg-gray-200 h-8 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => {
              const isOutOfStock = product.stock <= 0;
              return (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                        isOutOfStock
                          ? "bg-red-600 text-white"
                          : product.stock < 20
                          ? "bg-amber-600 text-white"
                          : "bg-green-600 text-white"
                      }`}>
                        {isOutOfStock ? "Out of Stock" : `${product.stock} ${product.unit} Available`}
                      </span>
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
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-teal-700 font-bold">KES {product.price.toLocaleString()}</span>
                        <span className="text-gray-400 text-xs ml-1">{product.unit}</span>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        disabled={isOutOfStock}
                        className={`${
                          isOutOfStock
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : addedItemId === product.id
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-teal-700 hover:bg-teal-600 text-white"
                        } text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 w-24 justify-center shadow-sm`}
                      >
                        {isOutOfStock ? (
                          "Unavailable"
                        ) : addedItemId === product.id ? (
                          "Added!"
                        ) : (
                          <>
                            <ShoppingCart size={12} /> Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100 mt-4">
            <Fish size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-700">No products found in this category.</p>
            <p className="text-xs text-gray-400 mt-1">Try switching categories or searching for another term.</p>
          </div>
        )}
      </div>

      {/* Cart Drawer / Step View */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowCart(false)} />
          <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-2">
                {checkoutStep === "payment" && (
                  <button onClick={() => setCheckoutStep("cart")} className="text-gray-500 hover:text-gray-800 mr-1">
                    <ArrowLeft size={18} />
                  </button>
                )}
                <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <ShoppingCart size={18} className="text-teal-700" /> 
                  {checkoutStep === "cart" ? `Shopping Cart (${cartCount})` : "Checkout & M-Pesa"}
                </h2>
              </div>
              <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Drawer Body - Step 1: Cart Review */}
            {checkoutStep === "cart" && (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <ShoppingCart size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="font-medium text-gray-600">Your cart is empty</p>
                      <p className="text-xs text-gray-400 mt-1">Add live products from the store to begin</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium text-sm">{item.name}</p>
                          <p className="text-teal-700 text-sm font-semibold">KES {item.price.toLocaleString()} {item.unit}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
                            <Minus size={13} />
                          </button>
                          <span className="text-gray-900 font-semibold w-6 text-center text-sm">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-5 border-t bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-700 font-semibold">Subtotal:</span>
                      <span className="text-teal-700 font-bold text-xl">KES {cartTotal.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => setCheckoutStep("payment")}
                      className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
                    >
                      Proceed to Checkout <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Drawer Body - Step 2: Payment & Details Form */}
            {checkoutStep === "payment" && (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {/* Order summary mini snippet */}
                  <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 text-sm text-teal-900 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{cartCount} items in order</p>
                      <p className="text-xs text-teal-700">Total: KES {cartTotal.toLocaleString()}</p>
                    </div>
                    <button onClick={() => setCheckoutStep("cart")} className="text-xs font-bold text-teal-700 underline hover:text-teal-900">
                      Modify Cart
                    </button>
                  </div>

                  {checkoutFeedback && (
                    <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                      checkoutFeedback.type === "success" ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"
                    }`}>
                      {checkoutFeedback.type === "success" ? <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" /> : <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />}
                      <span>{checkoutFeedback.message}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. John Mwangi" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Email (For Automated PDF Receipt)</label>
                      <input 
                        type="email" 
                        placeholder="e.g. customer@example.com" 
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Location</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Nakuru CBD or 'Store Pickup'" 
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Safaricom M-Pesa Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="0712345678 or 254712345678" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                      />
                      <p className="text-[11px] text-gray-500 mt-1">An instant STK Push prompt will appear on your phone.</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t bg-gray-50 space-y-3">
                  <button
                    onClick={handleMpesaCheckout}
                    disabled={isCheckingOut || cart.length === 0}
                    className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 disabled:bg-teal-300 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
                  >
                    {isCheckingOut ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" /> Processing STK Push...
                      </>
                    ) : (
                      `Pay KES ${cartTotal.toLocaleString()} with M-Pesa`
                    )}
                  </button>

                  {/* WhatsApp Order Fallback */}
                  <a
                    href={`https://wa.me/254712345678?text=Hello Aquafarm! I would like to order: ${cart.map((i) => `${i.qty}x ${i.name}`).join(", ")}. Total: KES ${cartTotal.toLocaleString()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm shadow-sm"
                  >
                    <Phone size={15} />
                    Order via WhatsApp
                  </a>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}