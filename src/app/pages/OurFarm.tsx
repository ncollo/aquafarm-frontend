import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import { Cpu, Droplets, Wind, Thermometer, FlaskConical, Fish, Leaf, ArrowRight, CheckCircle, Zap, Shield } from "lucide-react";

const technologies = [
  {
    icon: Cpu,
    title: "Recirculating Aquaculture Systems (RAS)",
    desc: "Our state-of-the-art RAS technology recycles and purifies water continuously, maintaining optimal conditions for fish growth while using up to 95% less water than traditional ponds.",
    color: "text-teal-700 bg-teal-50",
  },
  {
    icon: Wind,
    title: "Aeration & Oxygenation Systems",
    desc: "High-efficiency aerators and pure oxygen injection systems ensure dissolved oxygen levels remain optimal 24/7, supporting high-density fish stocking and healthy growth rates.",
    color: "text-blue-700 bg-blue-50",
  },
  {
    icon: Thermometer,
    title: "Water Quality Monitoring",
    desc: "IoT-enabled sensors continuously monitor pH, dissolved oxygen, temperature, ammonia and nitrite levels. Automated alerts keep our team informed in real-time.",
    color: "text-amber-700 bg-amber-50",
  },
  {
    icon: FlaskConical,
    title: "Biofilter Technology",
    desc: "Advanced biological filtration systems remove harmful waste products, creating a stable, healthy environment for fish while significantly reducing environmental impact.",
    color: "text-green-700 bg-green-50",
  },
  {
    icon: Droplets,
    title: "Water Conservation",
    desc: "We treat and reuse over 95% of our water. Rainwater harvesting systems supplement our water supply, making Aquafarm one of Kenya's most water-efficient fish farms.",
    color: "text-cyan-700 bg-cyan-50",
  },
  {
    icon: Zap,
    title: "Solar-Powered Operations",
    desc: "80% of our farm operations are powered by solar energy, reducing our carbon footprint and energy costs while ensuring reliable 24/7 power to critical systems.",
    color: "text-yellow-700 bg-yellow-50",
  },
];

const feeds = [
  {
    name: "Premium Floating Pellets",
    brand: "Aquafarm Certified Feed",
    protein: "35–42%",
    stage: "Grow-out",
    desc: "High-protein floating pellets made from sustainable fishmeal, soybean, and locally sourced grains. Promotes rapid growth and excellent feed conversion ratios.",
    color: "border-teal-300 bg-teal-50",
  },
  {
    name: "Fingerling Starter Feed",
    brand: "NutriStart Pro",
    protein: "45–50%",
    stage: "Fingerling",
    desc: "Ultra-fine micro-pellets formulated for fingerlings 2–10g. High protein content supports critical early development stages and immune system building.",
    color: "border-blue-300 bg-blue-50",
  },
  {
    name: "Organic Supplement Blend",
    brand: "GreenFeed Kenya",
    protein: "28–32%",
    stage: "Supplement",
    desc: "Certified organic supplement blend featuring duckweed, moringa, and black soldier fly larvae meal — sustainable, cost-effective and nutritionally complete.",
    color: "border-green-300 bg-green-50",
  },
  {
    name: "Broodstock Diet",
    brand: "ReproMax",
    protein: "40–45%",
    stage: "Breeding",
    desc: "Specially formulated diet for breeding fish, enriched with vitamins E & C, essential fatty acids and mineral supplements to support egg quality and spawning success.",
    color: "border-amber-300 bg-amber-50",
  },
];

const fishReared = [
  {
    name: "Nile Tilapia",
    scientific: "Oreochromis niloticus",
    desc: "Our flagship species. Hardy, fast-growing, and highly nutritious. Thrives in our warm pond systems and is the most popular fish in Kenya's market.",
    season: "Year-round",
    harvestSize: "300–600g",
    ponds: 12,
    image: "https://images.unsplash.com/photo-1649347173558-a305d7b8ff98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxhcGlhJTIwZmlzaCUyMHdhdGVyJTIwYXF1YWN1bHR1cmV8ZW58MXx8fHwxNzc0NTQ0MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    tag: { label: "Bestseller", color: "bg-teal-600 text-white" },
  },
  {
    name: "African Catfish",
    scientific: "Clarias gariepinus",
    desc: "Resilient and adaptable, catfish thrives in varied water conditions. Excellent for smoking and deep-frying — highly demanded in local and regional markets.",
    season: "Year-round",
    harvestSize: "500g–1.5kg",
    ponds: 8,
    image: "https://images.unsplash.com/photo-1607629194620-a9726803827c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMGhhcnZlc3QlMjBmcmVzaCUyMGZpc2glMjB3b3JrZXJzfGVufDF8fHx8MTc3NDU0NDM4MXww&ixlib=rb-4.1.0&q=80&w=1080",
    tag: { label: "High Demand", color: "bg-amber-600 text-white" },
  },
  {
    name: "Rainbow Trout",
    scientific: "Oncorhynchus mykiss",
    desc: "Premium quality cold-water fish raised in our specially cooled RAS tanks. Popular in upscale restaurants and hotels. Rich in Omega-3 fatty acids.",
    season: "Mar–Nov",
    harvestSize: "400g–1kg",
    ponds: 4,
    image: "https://images.unsplash.com/photo-1770529882297-d60092c0c834?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaHdhdGVyJTIwZmlzaCUyMGNhcnAlMjBwb25kJTIwc3VyZmFjZXxlbnwxfHx8fDE3NzQ1NDQzODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tag: { label: "Premium", color: "bg-purple-600 text-white" },
  },
  {
    name: "Common Carp",
    scientific: "Cyprinus carpio",
    desc: "A robust species suited for polyculture systems. Valuable in the Eastern Kenya market and a good choice for small-scale farmers entering aquaculture.",
    season: "Year-round",
    harvestSize: "600g–2kg",
    ponds: 3,
    image: "https://images.unsplash.com/photo-1738508041350-03453c14811c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMHBvbmQlMjBhZXJpYWwlMjBLZW55YXxlbnwxfHx8fDE3NzQ1NDQzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tag: { label: "Polyculture", color: "bg-blue-600 text-white" },
  },
  {
    name: "Mud Fish (Lungfish)",
    scientific: "Protopterus aethiopicus",
    desc: "Indigenous Kenyan species with high cultural and nutritional value. Farmed sustainably and sold to local and traditional markets across the region.",
    season: "Oct–Apr",
    harvestSize: "800g–3kg",
    ponds: 2,
    image: "https://images.unsplash.com/photo-1758854486625-2ef3d73853fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhcG9uaWNzJTIwd2F0ZXIlMjB0ZWNobm9sb2d5JTIwZmlzaCUyMHRhbmt8ZW58MXx8fHwxNzc0NTQ0Mzg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    tag: { label: "Indigenous", color: "bg-green-700 text-white" },
  },
  {
    name: "Bass (Largemouth)",
    scientific: "Micropterus salmoides",
    desc: "Reared primarily for our sport fishing zone. These prized game fish provide an exciting challenge for recreational anglers visiting Aquafarm.",
    season: "Year-round",
    harvestSize: "400g–2kg",
    ponds: 2,
    image: "https://images.unsplash.com/photo-1738599235555-03ac5f290b75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMGZpc2hpbmclMjBsYWtlJTIwcm9kJTIwY2F0Y2h8ZW58MXx8fHwxNzc0NTQ0MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    tag: { label: "Sport Fish", color: "bg-red-600 text-white" },
  },
];

export function OurFarm() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1758854486625-2ef3d73853fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhcG9uaWNzJTIwd2F0ZXIlMjB0ZWNobm9sb2d5JTIwZmlzaCUyMHRhbmt8ZW58MXx8fHwxNzc0NTQ0Mzg0fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Our Farm Technology"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-teal-900/80" />
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">The Farm</span>
          <h1 className="mt-2 mb-4" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700 }}>
            Our Farm, Technology & Fish
          </h1>
          <p className="text-teal-200 text-lg max-w-2xl mx-auto">
            30 active ponds, cutting-edge aquaculture technology, 6 fish species, and a team of experts — all working together for sustainable, high-quality fish production.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {[
              { val: "30+", label: "Active Ponds" },
              { val: "6", label: "Fish Species" },
              { val: "500T", label: "Annual Yield" },
              { val: "95%", label: "Water Recycled" },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-amber-400 font-bold text-2xl">{s.val}</p>
                <p className="text-teal-200 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Innovation</span>
            <h2 className="mt-2 text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
              Technology We Use
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Aquafarm Fisheries employs world-class aquaculture technology to ensure optimal fish health, yield, and sustainability.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, i) => {
              const Icon = tech.icon;
              return (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tech.color}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-gray-900 font-semibold text-lg mb-2">{tech.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{tech.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fish Feeds */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Nutrition</span>
            <h2 className="mt-2 text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
              Feeds We Use
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              We use only certified, nutritionally complete feeds to ensure healthy, fast-growing fish and superior taste quality.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feeds.map((feed, i) => (
              <div key={i} className={`border rounded-2xl p-6 hover:shadow-md transition-shadow ${feed.color}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-gray-900 font-semibold text-lg">{feed.name}</h3>
                    <p className="text-gray-500 text-sm">{feed.brand}</p>
                  </div>
                  <span className="bg-white text-teal-700 text-xs font-semibold px-3 py-1 rounded-full border border-teal-200">
                    {feed.stage}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={14} className="text-green-600" />
                  <span className="text-sm text-gray-700 font-medium">Protein: {feed.protein}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{feed.desc}</p>
                <div className="mt-3 flex items-center gap-2 text-green-600 text-xs">
                  <Leaf size={12} />
                  <span>Certified Sustainable Ingredients</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fish Species */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Our Stock</span>
            <h2 className="mt-2 text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
              Fish Species We Rear
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Six carefully selected species chosen for market demand, nutritional value, and adaptability to Kenya's climate.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fishReared.map((fish, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={fish.image}
                    alt={fish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full ${fish.tag.color}`}>
                    {fish.tag.label}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-gray-900 font-semibold text-xl">{fish.name}</h3>
                  <p className="text-gray-400 text-xs italic mb-3">{fish.scientific}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{fish.desc}</p>
                  <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Season</p>
                      <p className="text-gray-800 text-xs font-semibold">{fish.season}</p>
                    </div>
                    <div className="text-center border-x border-gray-100">
                      <p className="text-gray-400 text-xs">Size at Harvest</p>
                      <p className="text-gray-800 text-xs font-semibold">{fish.harvestSize}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs">Ponds</p>
                      <p className="text-gray-800 text-xs font-semibold">{fish.ponds}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="py-14 bg-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-green-300 text-sm font-semibold uppercase tracking-widest">Our Commitment</span>
              <h2 className="mt-2 mb-4 text-white" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
                Sustainable Aquaculture
              </h2>
              <p className="text-green-200 leading-relaxed mb-6">
                Aquafarm Fisheries operates under strict environmental and sustainability standards. We are committed to minimizing our ecological footprint while maximizing food production for Kenya's growing population.
              </p>
              <div className="space-y-3">
                {[
                  "95% water recycling and reuse",
                  "80% solar-powered operations",
                  "Zero antibiotic/chemical fish treatment policy",
                  "Certified sustainable feed sourcing",
                  "Regular ecosystem impact assessments",
                  "Community waste management programs",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                    <span className="text-green-100 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-3xl p-8">
              <h3 className="text-white font-bold text-xl mb-6 text-center" style={{ fontFamily: "Playfair Display, serif" }}>
                Environmental Impact
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: "95%", label: "Water Recycled", icon: Droplets },
                  { val: "80%", label: "Solar Energy", icon: Zap },
                  { val: "0", label: "Antibiotics Used", icon: Shield },
                  { val: "200+", label: "Trees Planted", icon: Leaf },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="bg-white/10 rounded-2xl p-4 text-center">
                      <Icon size={22} className="text-green-400 mx-auto mb-2" />
                      <p className="text-white font-bold text-2xl">{s.val}</p>
                      <p className="text-green-300 text-xs">{s.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-gray-900 mb-4" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
            Come See the Farm in Person
          </h2>
          <p className="text-gray-600 mb-8">
            Schedule a guided tour and witness our operations, technology, and fish up close.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/schedule-visit" className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Schedule a Visit <ArrowRight size={15} />
            </Link>
            <Link to="/store" className="flex items-center gap-2 border border-teal-300 text-teal-700 hover:bg-teal-50 font-semibold px-6 py-3 rounded-xl transition-colors">
              <Fish size={15} /> Buy Our Fish
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
