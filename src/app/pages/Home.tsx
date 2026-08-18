import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  ArrowRight,
  Fish,
  Users,
  Award,
  TrendingUp,
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  CalendarCheck,
  GraduationCap,
  Waves,
  Leaf,
  Heart,
  MapPin,
  CheckCircle,
  Clock,
} from "lucide-react";

const heroSlides = [
  {
    title: "Kenya's Premier Sustainable Fish Farm",
    subtitle: "Rearing quality Tilapia, Catfish, Trout & more — from our ponds to your table.",
    image: "https://images.unsplash.com/photo-1738508041350-03453c14811c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMHBvbmQlMjBhZXJpYWwlMjBLZW55YXxlbnwxfHx8fDE3NzQ1NDQzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    btn1: { label: "Explore Our Farm", path: "/our-farm" },
    btn2: { label: "Schedule a Visit", path: "/schedule-visit" },
  },
  {
    title: "Sport Fishing & Training",
    subtitle: "Experience the thrill of fishing — equipment rentals, expert training & guided sessions.",
    image: "https://images.unsplash.com/photo-1738599235555-03ac5f290b75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMGZpc2hpbmclMjBsYWtlJTIwcm9kJTIwY2F0Y2h8ZW58MXx8fHwxNzc0NTQ0MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    btn1: { label: "Try Sport Fishing", path: "/sport-fishing" },
    btn2: { label: "Book Training", path: "/training" },
  },
  {
    title: "Empowering Our Community",
    subtitle: "Building sustainable livelihoods — partnering with farmers, schools, and cooperatives.",
    image: "https://images.unsplash.com/photo-1768248559223-cc4ef20363fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwY29tbXVuaXR5JTIwbWFya2V0JTIwZnJlc2glMjBmaXNofGVufDF8fHx8MTc3NDU0NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    btn1: { label: "Our Community Work", path: "/community" },
    btn2: { label: "Join Our Team", path: "/careers" },
  },
];

const stats = [
  { icon: TrendingUp, value: "500+", label: "Tonnes Harvested/Year", color: "text-teal-600" },
  { icon: Fish, value: "6", label: "Fish Species Reared", color: "text-blue-600" },
  { icon: Users, value: "200+", label: "Community Partners", color: "text-green-600" },
  { icon: Award, value: "12+", label: "Years of Excellence", color: "text-amber-600" },
];

const fishSpecies = [
  {
    name: "Nile Tilapia",
    scientific: "Oreochromis niloticus",
    image: "https://images.unsplash.com/photo-1649347173558-a305d7b8ff98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxhcGlhJTIwZmlzaCUyMHdhdGVyJTIwYXF1YWN1bHR1cmV8ZW58MXx8fHwxNzc0NTQ0MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    stock: "High",
    priceKg: "KES 350",
    color: "bg-green-100 text-green-700",
  },
  {
    name: "African Catfish",
    scientific: "Clarias gariepinus",
    image: "https://images.unsplash.com/photo-1607629194620-a9726803827c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMGhhcnZlc3QlMjBmcmVzaCUyMGZpc2glMjB3b3JrZXJzfGVufDF8fHx8MTc3NDU0NDM4MXww&ixlib=rb-4.1.0&q=80&w=1080",
    stock: "Medium",
    priceKg: "KES 400",
    color: "bg-amber-100 text-amber-700",
  },
  {
    name: "Rainbow Trout",
    scientific: "Oncorhynchus mykiss",
    image: "https://images.unsplash.com/photo-1770529882297-d60092c0c834?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaHdhdGVyJTIwZmlzaCUyMGNhcnAlMjBwb25kJTIwc3VyZmFjZXxlbnwxfHx8fDE3NzQ1NDQzODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    stock: "Low",
    priceKg: "KES 650",
    color: "bg-red-100 text-red-700",
  },
];

const services = [
  {
    icon: Fish,
    title: "Fresh Fish Sales",
    desc: "Farm-fresh fish available daily. Wholesale and retail options for individuals and businesses.",
    path: "/store",
    color: "bg-teal-50 text-teal-700 border-teal-200",
    btnColor: "bg-teal-700 hover:bg-teal-600",
  },
  {
    icon: Waves,
    title: "Sport Fishing",
    desc: "Enjoy recreational fishing at our well-stocked ponds. Equipment rentals available.",
    path: "/sport-fishing",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    btnColor: "bg-blue-700 hover:bg-blue-600",
  },
  {
    icon: CalendarCheck,
    title: "Farm Visits",
    desc: "Schedule educational visits for schools, co-ops, and groups. Guided tours available.",
    path: "/schedule-visit",
    color: "bg-green-50 text-green-700 border-green-200",
    btnColor: "bg-green-700 hover:bg-green-600",
  },
  {
    icon: GraduationCap,
    title: "Training Programs",
    desc: "Learn professional aquaculture and fishing skills from certified instructors.",
    path: "/training",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    btnColor: "bg-purple-700 hover:bg-purple-600",
  },
  {
    icon: ShoppingBag,
    title: "Fishing Equipment",
    desc: "Complete range of fishing gear — rods, reels, bait, nets and professional tackle.",
    path: "/store",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    btnColor: "bg-amber-600 hover:bg-amber-500",
  },
  {
    icon: Heart,
    title: "Community Programs",
    desc: "Supporting local farmers and co-ops with fingerlings, feed, and technical support.",
    path: "/community",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    btnColor: "bg-rose-600 hover:bg-rose-500",
  },
];

const testimonials = [
  {
    name: "James Kamau",
    role: "Farmer, Nakuru",
    text: "Aquafarm has transformed my livelihood. Their fingerlings are of excellent quality and their technical support is unmatched. I went from 0 to earning over KES 80,000 monthly from fish farming.",
    rating: 5,
    avatar: "JK",
  },
  {
    name: "Nairobi Girls' High School",
    role: "School Visit, Nairobi",
    text: "The educational visit was phenomenal! Students learned so much about aquaculture, sustainability, and career opportunities in the industry. Highly recommend for school trips.",
    rating: 5,
    avatar: "NG",
  },
  {
    name: "Mary Wanjiku",
    role: "Restaurant Owner, Nakuru",
    text: "Fresh, consistent supply of quality tilapia and catfish. Our customers love the quality. Aquafarm's delivery is always on time and the fish is always fresh. Best supplier in the region!",
    rating: 5,
    avatar: "MW",
  },
  {
    name: "Rift Valley Farmers Co-op",
    role: "Cooperative Society",
    text: "Partnership with Aquafarm has helped over 50 small-scale fish farmers in our cooperative improve their yields and market access. A true partner in development.",
    rating: 5,
    avatar: "RV",
  },
];

const blogPosts = [
  {
    title: "Sustainable Aquaculture: How Aquafarm is Leading the Way",
    date: "March 20, 2026",
    excerpt: "How we maintain eco-friendly operations while maximizing fish yield and quality...",
    category: "Sustainability",
    color: "bg-green-100 text-green-700",
    image: "https://images.unsplash.com/photo-1623745494461-c5afa6f6e507?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZpc2glMjBmYXJtaW5nJTIwS2VueWElMjBBZnJpY2F8ZW58MXx8fHwxNzc0Nzc4Nzc1fDA&ixlib=rb-4.1.0&q=80&w=800",
  },
  {
    title: "Nile Tilapia: Kenya's Favourite Farm Fish",
    date: "March 15, 2026",
    excerpt: "Everything you need to know about our champion fish species — nutrition, farming tips...",
    category: "Fish Guide",
    color: "bg-blue-100 text-blue-700",
    image: "https://images.unsplash.com/photo-1756364897965-6e294ceff269?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwZnJlc2glMjB0aWxhcGlhJTIwZmlzaCUyMHdhdGVyJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NzQ3Nzg3ODB8MA&ixlib=rb-4.1.0&q=80&w=800",
  },
  {
    title: "New Batch of Fingerlings Available — March 2026",
    date: "March 10, 2026",
    excerpt: "We have a fresh batch of certified Tilapia and Catfish fingerlings ready for sale...",
    category: "News",
    color: "bg-amber-100 text-amber-700",
    image: "https://images.unsplash.com/photo-1751568928581-874900ec53f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMHdvcmtlcnMlMjBoYXJ2ZXN0aW5nJTIwbmV0cyUyMEtlbnlhfGVufDF8fHx8MTc3NDc3ODc3NHww&ixlib=rb-4.1.0&q=80&w=800",
  },
];

export function Home() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* ─── HERO SLIDER ─── */}
      <section className="relative h-[88vh] min-h-[550px] overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? "opacity-100" : "opacity-0"}`}
          >
            <ImageWithFallback
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </div>
        ))}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
              <Leaf size={13} />
              <span>Certified Sustainable Aquaculture — Kenya</span>
            </div>
            <h1
              className="text-white mb-4"
              style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, lineHeight: 1.2 }}
            >
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-gray-200 text-lg mb-8 leading-relaxed">
              {heroSlides[currentSlide].subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={heroSlides[currentSlide].btn1.path}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-teal-500/30"
              >
                {heroSlides[currentSlide].btn1.label}
                <ArrowRight size={16} />
              </Link>
              <Link
                to={heroSlides[currentSlide].btn2.path}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl backdrop-blur-sm transition-all"
              >
                {heroSlides[currentSlide].btn2.label}
              </Link>
            </div>
          </div>
        </div>
        {/* Slide Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all ${i === currentSlide ? "w-8 h-2 bg-amber-400 rounded-full" : "w-2 h-2 bg-white/50 rounded-full"}`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={() => setCurrentSlide((p) => (p + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all"
        >
          <ChevronRight size={22} />
        </button>
      </section>

      {/* ─── STATS BANNER ─── */}
      <section className="bg-teal-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center text-white">
                  <div className="flex justify-center mb-2">
                    <div className="bg-white/10 p-3 rounded-xl">
                      <Icon size={24} className="text-amber-300" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-amber-300">{stat.value}</div>
                  <div className="text-teal-200 text-sm mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── LIVE FISH AVAILABILITY ─── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 text-sm font-semibold uppercase tracking-wide">Live Today</span>
              </div>
              <h2 className="text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.875rem", fontWeight: 700 }}>
                Fish Availability
              </h2>
              <p className="text-gray-500 mt-1 text-sm">Updated daily — stock as of {new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
            <Link to="/store" className="flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-600 transition-colors">
              View Full Store <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fishSpecies.map((fish, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                <div className="h-48 overflow-hidden relative">
                  <ImageWithFallback src={fish.image} alt={fish.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${fish.color}`}>
                    {fish.stock} Stock
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-gray-900 font-semibold text-lg">{fish.name}</h3>
                  <p className="text-gray-400 text-xs italic mb-3">{fish.scientific}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs">Price per Kg</p>
                      <p className="text-teal-700 font-bold text-lg">{fish.priceKg}</p>
                    </div>
                    <Link to="/store" className="bg-teal-700 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES GRID ─── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">What We Offer</span>
            <h2 className="text-gray-900 mt-2" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
              Our Services
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              From fresh fish sales to sport fishing, training, and community development — Aquafarm Fisheries is your one-stop destination.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div key={i} className={`border rounded-2xl p-6 hover:shadow-lg transition-all group ${svc.color}`}>
                  <div className="mb-4">
                    <Icon size={28} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{svc.title}</h3>
                  <p className="text-sm opacity-80 mb-5 leading-relaxed">{svc.desc}</p>
                  <Link
                    to={svc.path}
                    className={`inline-flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${svc.btnColor}`}
                  >
                    Learn More <ArrowRight size={13} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── ABOUT SNAPSHOT ─── */}
      <section className="py-16 bg-teal-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">About Aquafarm</span>
              <h2 className="mt-2 mb-5" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700, lineHeight: 1.3 }}>
                Farming with Purpose,<br />Growing with Community
              </h2>
              <p className="text-teal-200 leading-relaxed mb-4">
                Founded in 2012, Aquafarm Fisheries began as a small-scale tilapia pond in Nakuru and has grown to become one of Kenya's most recognized sustainable aquaculture operations. We rear six species of fish using modern recirculating aquaculture systems (RAS), aeration technology, and certified sustainable feeds.
              </p>
              <p className="text-teal-200 leading-relaxed mb-6">
                Our motto: <strong className="text-amber-300">"From Our Waters to Your Plate — Fresh, Responsible, Community-Driven."</strong> We believe that responsible fish farming can transform lives, feed communities, and protect our ecosystems.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {[
                  "ISO Certified Operations",
                  "Organic Certified Fish Feed",
                  "Zero Harmful Chemical Policy",
                  "Community First Approach",
                  "Expert Aquaculture Team",
                  "Direct Farm-to-Consumer Sales",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-teal-200 text-sm">
                    <CheckCircle size={15} className="text-amber-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link to="/about" className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-5 py-3 rounded-xl transition-colors">
                  Our Full Story <ArrowRight size={15} />
                </Link>
                <Link to="/our-farm" className="flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white font-semibold px-5 py-3 rounded-xl transition-colors">
                  See Our Farm
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758854486625-2ef3d73853fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhcG9uaWNzJTIwd2F0ZXIlMjB0ZWNobm9sb2d5JTIwZmlzaCUyMHRhbmt8ZW58MXx8fHwxNzc0NTQ0Mzg0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Aquafarm Technology"
                  className="w-full h-80 object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-5 bg-white text-gray-900 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-2.5 rounded-xl">
                    <Award size={20} className="text-teal-700" />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-none text-teal-800">Best Farm 2024</p>
                    <p className="text-gray-500 text-xs mt-0.5">Kenya Aquaculture Awards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VISIT SECTION ─── */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1681705357021-d5434018247b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBjaGlsZHJlbiUyMGZhcm0lMjBlZHVjYXRpb25hbCUyMHZpc2l0fGVufDF8fHx8MTc3NDU0NDM3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Educational Visit"
                className="w-full h-80 object-cover"
              />
            </div>
            <div>
              <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Farm Visits</span>
              <h2 className="mt-2 mb-4 text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
                Bring Your Group to Aquafarm!
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We welcome schools, universities, farmer groups, and cooperatives to experience our state-of-the-art fish farm. Learn about aquaculture, sustainability, and feeding techniques. Visits can be customized to educational, research, or leisure needs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { icon: Users, title: "School Groups", desc: "Grades 4–12, tailored curriculum" },
                  { icon: Leaf, title: "Farmer Groups", desc: "Practical aquaculture sessions" },
                  { icon: Heart, title: "Co-operatives", desc: "Partnership & business visits" },
                  { icon: MapPin, title: "Individual Tours", desc: "Personal guided farm walk" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="bg-teal-100 p-2 rounded-lg">
                        <Icon size={16} className="text-teal-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                        <p className="text-gray-500 text-xs">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-3 mb-6 text-gray-600 text-sm">
                <Clock size={16} className="text-amber-600" />
                <span>Mon–Sat: 8:00 AM – 4:00 PM | Min. 48 hrs advance booking</span>
              </div>
              <Link
                to="/schedule-visit"
                className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md"
              >
                <CalendarCheck size={16} />
                Schedule Your Visit
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">What They Say</span>
            <h2 className="mt-2 text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
              Testimonials
            </h2>
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.slice(testimonialIdx, testimonialIdx + 2).map((t, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-5 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setTestimonialIdx((p) => Math.max(0, p - 2))}
                disabled={testimonialIdx === 0}
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setTestimonialIdx((p) => Math.min(testimonials.length - 2, p + 2))}
                disabled={testimonialIdx + 2 >= testimonials.length}
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BLOG PREVIEW ─── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Latest Updates</span>
              <h2 className="mt-2 text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
                Blog & News
              </h2>
            </div>
            <Link to="/blog" className="flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-600 transition-colors">
              View All Posts <ArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <article key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                <div className="h-44 overflow-hidden relative">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${post.color}`}>{post.category}</span>
                    <span className="text-gray-400 text-xs">{post.date}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 leading-snug">{post.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{post.excerpt}</p>
                  <Link to="/blog" className="text-teal-700 text-sm font-semibold hover:text-teal-600 flex items-center gap-1 transition-colors">
                    Read More <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-14 bg-gradient-to-r from-teal-700 to-teal-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="mb-3" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
            Ready to Partner with Aquafarm Fisheries?
          </h2>
          <p className="text-teal-200 mb-8 max-w-xl mx-auto">
            Whether you're a buyer, student, farmer, or sport angler — there's something for everyone at Aquafarm.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg">
              Contact Us Today <ArrowRight size={15} />
            </Link>
            <Link to="/schedule-visit" className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              <CalendarCheck size={15} />
              Book a Visit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}