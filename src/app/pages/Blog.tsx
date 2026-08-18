import { useState } from "react";
import { BookOpen, Search, Calendar, Tag, ArrowRight, Clock, User } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const posts = [
  { id: 1, title: "Sustainable Aquaculture: How Aquafarm is Leading the Way", category: "Sustainability", date: "March 20, 2026", author: "Dr. Sarah Otieno", readTime: "5 min", excerpt: "Learn how Aquafarm Fisheries has implemented zero-waste water management, solar energy, and organic feeds to become Kenya's most sustainable fish farm.", tag: "Featured", color: "bg-green-100 text-green-700", image: "https://images.unsplash.com/photo-1623745494461-c5afa6f6e507?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZpc2glMjBmYXJtaW5nJTIwS2VueWElMjBBZnJpY2F8ZW58MXx8fHwxNzc0Nzc4Nzc1fDA&ixlib=rb-4.1.0&q=80&w=800" },
  { id: 2, title: "Nile Tilapia: Kenya's Favourite Farm Fish — A Complete Guide", category: "Fish Guide", date: "March 15, 2026", author: "Moses Kiprotich", readTime: "7 min", excerpt: "Everything you need to know about Nile Tilapia — nutrition facts, farming tips, feeding schedules, market value, and why it's our bestselling fish species.", tag: "Guide", color: "bg-blue-100 text-blue-700", image: "https://images.unsplash.com/photo-1756364897965-6e294ceff269?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwZnJlc2glMjB0aWxhcGlhJTIwZmlzaCUyMHdhdGVyJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NzQ3Nzg3ODB8MA&ixlib=rb-4.1.0&q=80&w=800" },
  { id: 3, title: "New Batch of Certified Fingerlings Available — April 2026", category: "News", date: "March 10, 2026", author: "Grace Njeri", readTime: "2 min", excerpt: "We're happy to announce a fresh batch of Grade-A Tilapia and Catfish fingerlings ready for sale. Early orders receive 10% discount — contact us today.", tag: "News", color: "bg-amber-100 text-amber-700", image: "https://images.unsplash.com/photo-1751568928581-874900ec53f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMHdvcmtlcnMlMjBoYXJ2ZXN0aW5nJTIwbmV0cyUyMEtlbnlhfGVufDF8fHx8MTc3NDc3ODc3NHww&ixlib=rb-4.1.0&q=80&w=800" },
  { id: 4, title: "5 Common Mistakes Beginner Fish Farmers Make (And How to Avoid Them)", category: "Tips & Advice", date: "March 5, 2026", author: "Moses Kiprotich", readTime: "6 min", excerpt: "From overstocking ponds to poor water quality management, we break down the top mistakes and how our training program helps you avoid them.", tag: "Tips", color: "bg-purple-100 text-purple-700", image: "https://images.unsplash.com/photo-1609101419675-60842b69628d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhY3VsdHVyZSUyMGZpc2glMjBwb25kJTIwdGVjaG5vbG9neSUyMGFlcmF0aW9ufGVufDF8fHx8MTc3NDc3ODc3NHww&ixlib=rb-4.1.0&q=80&w=800" },
  { id: 5, title: "Aquafarm Wins 'Best Fish Farm in Kenya 2024' Award", category: "News", date: "February 28, 2026", author: "John Mwangi", readTime: "3 min", excerpt: "We're honoured to receive the prestigious Kenya Aquaculture Awards 2024 for Best Fish Farm. This award belongs to our team, farmers, and customers.", tag: "Award", color: "bg-amber-100 text-amber-700", image: "https://images.unsplash.com/photo-1735295442948-83f09f4afac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwcG9uZCUyMGFlcmlhbCUyMGRyb25lJTIwdmlldyUyMEFmcmljYXxlbnwxfHx8fDE3NzQ3Nzg3ODJ8MA&ixlib=rb-4.1.0&q=80&w=800" },
  { id: 6, title: "Sport Fishing at Aquafarm: What to Expect on Your Visit", category: "Sport Fishing", date: "February 20, 2026", author: "Edwin Omondi", readTime: "4 min", excerpt: "Planning a sport fishing session at Aquafarm? Here's your complete guide to our fishing packages, equipment options, rules, and tips for a great catch.", tag: "Sport", color: "bg-teal-100 text-teal-700", image: "https://images.unsplash.com/photo-1763047302840-17f4131fa3a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMGZpc2hpbmclMjBsYWtlJTIwcm9kJTIwY2F0Y2glMjBmcmVzaHdhdGVyfGVufDF8fHx8MTc3NDc3ODc3N3ww&ixlib=rb-4.1.0&q=80&w=800" },
  { id: 7, title: "How to Set Up Your First Fish Pond: A Step-by-Step Guide", category: "Tips & Advice", date: "February 15, 2026", author: "Moses Kiprotich", readTime: "8 min", excerpt: "Ready to start fish farming? This comprehensive guide covers site selection, pond design, stocking, feeding, water management, and first harvest.", tag: "Guide", color: "bg-purple-100 text-purple-700", image: "https://images.unsplash.com/photo-1518707332890-e05af3c6bfff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhY3VsdHVyZSUyMHNjaG9vbCUyMHN0dWRlbnRzJTIwZWR1Y2F0aW9uYWwlMjB0b3VyJTIwcG9uZHxlbnwxfHx8fDE3NzQ3Nzg3ODF8MA&ixlib=rb-4.1.0&q=80&w=800" },
  { id: 8, title: "Aquafarm Community Day 2026 — Recap & Photos", category: "Community", date: "February 10, 2026", author: "Faith Waweru", readTime: "3 min", excerpt: "Over 300 community members joined us for our annual Community Day — with subsidized fish sales, free training demos, and live entertainment.", tag: "Community", color: "bg-rose-100 text-rose-700", image: "https://images.unsplash.com/photo-1567471945805-069e09c11098?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwZmFybWVycyUyMGNvb3BlcmF0aXZlJTIwZ3JvdXAlMjBtZWV0aW5nfGVufDF8fHx8MTc3NDc3ODc4MXww&ixlib=rb-4.1.0&q=80&w=800" },
  { id: 9, title: "Rainbow Trout Farming in Kenya: Challenges & Opportunities", category: "Fish Guide", date: "February 5, 2026", author: "Dr. Sarah Otieno", readTime: "6 min", excerpt: "Rainbow Trout is one of Kenya's most premium fish but requires specialized conditions. We share our experience farming trout successfully at altitude.", tag: "Guide", color: "bg-blue-100 text-blue-700", image: "https://images.unsplash.com/photo-1755326701682-64bb0644c36c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwdHJhaW5pbmclMjBvdXRkb29yJTIwbGVzc29uJTIwaW5zdHJ1Y3RvcnxlbnwxfHx8fDE3NzQ3Nzg3NzV8MA&ixlib=rb-4.1.0&q=80&w=800" },
];

const categories = ["All", "News", "Fish Guide", "Tips & Advice", "Sustainability", "Sport Fishing", "Community"];

export function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = posts.filter(p =>
    (activeCategory === "All" || p.category === activeCategory) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-900 to-teal-700 py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Our Blog</span>
          <h1 className="mt-2 mb-3" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700 }}>
            Blog, News & Updates
          </h1>
          <p className="text-teal-200 text-lg max-w-xl mx-auto mb-6">
            Fish farming tips, sustainability news, farm updates, and industry insights from our team of experts.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeCategory === cat ? "bg-teal-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts */}
          <div className="lg:col-span-2 space-y-6">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <BookOpen size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No posts found.</p>
              </div>
            ) : (
              filtered.map(post => (
                <article key={post.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-44 overflow-hidden relative">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full ${post.color}`}>{post.tag}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${post.color}`}>{post.category}</span>
                      {post.tag && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{post.tag}</span>}
                    </div>
                    <h2 className="text-gray-900 font-bold text-xl mb-2 leading-snug hover:text-teal-700 cursor-pointer transition-colors" onClick={() => setExpanded(expanded === post.id ? null : post.id)}>
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-4 text-gray-400 text-xs mb-3">
                      <span className="flex items-center gap-1"><Calendar size={11} /> {post.date}</span>
                      <span className="flex items-center gap-1"><User size={11} /> {post.author}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime} read</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{post.excerpt}</p>
                    {expanded === post.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 text-gray-600 text-sm leading-relaxed space-y-3">
                        <p>This is a preview of the full article. Our team of aquaculture experts regularly publishes in-depth, practical content designed to help fish farmers, enthusiasts, and industry professionals stay informed and ahead of the curve.</p>
                        <p>For the complete article and access to our full blog library, visit our farm or reach out to our communications team. We also offer a free newsletter subscription for regular updates.</p>
                      </div>
                    )}
                    <button
                      onClick={() => setExpanded(expanded === post.id ? null : post.id)}
                      className="mt-4 flex items-center gap-1 text-teal-700 text-sm font-semibold hover:text-teal-600 transition-colors"
                    >
                      {expanded === post.id ? "Show Less" : "Read More"} <ArrowRight size={13} />
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag size={15} className="text-teal-700" /> Categories
              </h3>
              <div className="space-y-2">
                {categories.filter(c => c !== "All").map(cat => {
                  const count = posts.filter(p => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeCategory === cat ? "bg-teal-50 text-teal-700 font-semibold" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Recent Posts</h3>
              <div className="space-y-3">
                {posts.slice(0, 4).map(post => (
                  <div key={post.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <p className="text-gray-800 text-sm font-medium leading-snug hover:text-teal-700 cursor-pointer transition-colors">
                      {post.title}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">{post.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-teal-900 text-white rounded-2xl p-5">
              <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                Stay Updated
              </h3>
              <p className="text-teal-200 text-sm mb-4">Get weekly farm updates, tips, and fish availability alerts.</p>
              <input type="email" placeholder="your@email.com" className="w-full bg-teal-800 border border-teal-700 text-white placeholder-teal-400 text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 mb-2" />
              <button className="w-full bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors">
                Subscribe Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}