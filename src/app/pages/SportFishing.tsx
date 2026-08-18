import { useState } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Waves, ShoppingBag, Package, ArrowRight, CheckCircle, XCircle, Clock, Users, Star, AlertTriangle, Fish, CalendarCheck } from "lucide-react";

const regulations = [
  { type: "allowed", text: "Rod and reel fishing with single barbless hooks" },
  { type: "allowed", text: "Catch-and-release practice (encouraged)" },
  { type: "allowed", text: "Personal equipment (subject to inspection & approval)" },
  { type: "allowed", text: "Rented equipment from our store" },
  { type: "allowed", text: "Photography and video recording" },
  { type: "allowed", text: "Children under 12 with adult supervision" },
  { type: "banned", text: "Use of nets, traps, or fish-stunning devices" },
  { type: "banned", text: "Fishing in restricted breeding zones (marked areas)" },
  { type: "banned", text: "Throwing stones, foreign objects into ponds" },
  { type: "banned", text: "Introducing foreign organisms, chemicals, or bait animals" },
  { type: "banned", text: "Taking more than the daily catch limit (5 fish per person)" },
  { type: "banned", text: "Fishing under the influence of alcohol or drugs" },
];

const packages = [
  {
    name: "Half-Day Angler",
    duration: "4 Hours",
    price: "KES 1,500",
    perPerson: true,
    features: [
      "Access to 2 fishing ponds",
      "Basic rod & tackle included",
      "1 fish keep allowance (up to 500g)",
      "Fishing guide assistance",
      "Refreshments included",
    ],
    color: "border-teal-300 bg-teal-50",
    badge: "Popular",
    badgeColor: "bg-teal-600",
  },
  {
    name: "Full-Day Sport Fisher",
    duration: "8 Hours",
    price: "KES 2,500",
    perPerson: true,
    features: [
      "Access to all sport fishing ponds",
      "Premium rod, reel & tackle set",
      "2 fish keep allowance (up to 1kg each)",
      "Dedicated fishing instructor",
      "Lunch & refreshments",
      "Fish cleaning & packaging",
    ],
    color: "border-amber-400 bg-amber-50",
    badge: "Best Value",
    badgeColor: "bg-amber-600",
  },
  {
    name: "Family / Group Package",
    duration: "Full Day",
    price: "KES 8,000",
    perPerson: false,
    features: [
      "Up to 6 people included",
      "All equipment provided",
      "3 fish keep allowance per person",
      "Group BBQ / picnic area",
      "Photography spot",
      "Children's fishing section",
      "Priority booking",
    ],
    color: "border-purple-300 bg-purple-50",
    badge: "Groups",
    badgeColor: "bg-purple-600",
  },
];

const rentalEquipment = [
  { item: "Basic Fishing Rod", perHour: "KES 150", perDay: "KES 500", deposit: "KES 1,000" },
  { item: "Premium Rod & Reel Set", perHour: "KES 300", perDay: "KES 900", deposit: "KES 3,000" },
  { item: "Complete Tackle Box", perHour: "KES 100", perDay: "KES 300", deposit: "KES 500" },
  { item: "Life Jacket", perHour: "KES 50", perDay: "KES 150", deposit: "KES 200" },
  { item: "Fishing Boots (pair)", perHour: "KES 80", perDay: "KES 200", deposit: "KES 500" },
  { item: "Fishing Chair & Umbrella", perHour: "KES 100", perDay: "KES 250", deposit: "KES 500" },
];

export function SportFishing() {
  const [activeTab, setActiveTab] = useState<"overview" | "packages" | "equipment" | "regulations">("overview");

  return (
    <div>
      {/* Hero */}
      <section className="relative h-96 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1738599235555-03ac5f290b75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMGZpc2hpbmclMjBsYWtlJTIwcm9kJTIwY2F0Y2h8ZW58MXx8fHwxNzc0NTQ0MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Sport Fishing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-teal-700/60" />
        <div className="relative max-w-4xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Recreation & Sport</span>
            <h1 className="mt-2 mb-3" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700 }}>
              Sport Fishing at Aquafarm
            </h1>
            <p className="text-teal-200 text-lg max-w-xl">
              Experience the thrill of fishing in our well-stocked ponds. Perfect for individuals, families, and corporate groups.
            </p>
            <div className="flex gap-3 mt-6">
              <Link to="/schedule-visit" className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-5 py-3 rounded-xl transition-colors">
                <CalendarCheck size={15} /> Book a Session
              </Link>
              <Link to="/training" className="flex items-center gap-2 border border-white/40 text-white hover:bg-white/10 font-semibold px-5 py-3 rounded-xl transition-colors">
                <Star size={15} /> Take a Lesson
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-[88px] bg-white border-b border-gray-200 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-0 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: Waves },
            { id: "packages", label: "Packages & Pricing", icon: Star },
            { id: "equipment", label: "Equipment Rental", icon: Package },
            { id: "regulations", label: "Rules & Regulations", icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-teal-700 text-teal-700"
                    : "border-transparent text-gray-600 hover:text-teal-600"
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">About Sport Fishing</span>
                <h2 className="mt-2 mb-4 text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.875rem", fontWeight: 700 }}>
                  Fishing as a Sport & Leisure Activity
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Aquafarm Fisheries offers a world-class recreational fishing experience right here in Kenya. Our sport fishing zone features multiple well-stocked ponds with a variety of species including Tilapia, Catfish, Carp, and Largemouth Bass — all managed under strict sustainable fishing practices.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Whether you're a seasoned angler or a first-time fisher, our experienced guides will ensure you have an unforgettable time. Equipment can be rented from our store, purchased, or you may bring your own (subject to inspection at the gate).
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Fish, title: "4 Species Available", desc: "Tilapia, Catfish, Carp & Bass" },
                    { icon: Clock, title: "Open Daily", desc: "7AM – 5PM (Last entry 3PM)" },
                    { icon: Users, title: "All Welcome", desc: "Individuals, families & groups" },
                    { icon: ShoppingBag, title: "Equipment Available", desc: "Rent, buy or BYO (with inspection)" },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-start gap-3 bg-teal-50 rounded-xl p-4">
                        <div className="bg-teal-700 p-2 rounded-lg">
                          <Icon size={14} className="text-white" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-semibold text-sm">{item.title}</p>
                          <p className="text-gray-500 text-xs">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1771533679900-568efb11569b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwdHJhaW5pbmclMjBpbnN0cnVjdG9yJTIwYm9hdCUyMGxlc3NvbnxlbnwxfHx8fDE3NzQ1NDQzODF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Sport Fishing Training"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>

            {/* BYO Policy */}
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle size={22} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-amber-800 font-semibold text-lg mb-2">Bring Your Own Equipment (BYO) Policy</h3>
                  <p className="text-amber-700 text-sm mb-3 leading-relaxed">
                    Guests are welcome to bring their own fishing equipment. However, all BYO equipment must be presented at the gate for inspection before entering the fishing zone. The following conditions apply:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "Single barbless hooks only (maximum size 8)",
                      "No nets, traps, or electric fishing devices",
                      "Lines no longer than 30m",
                      "No fish attractants or chemical bait",
                      "Equipment tags must be visible",
                      "Gate inspection fee: KES 100",
                    ].map((rule, i) => (
                      <div key={i} className="flex items-center gap-2 text-amber-700 text-sm">
                        <CheckCircle size={13} className="text-amber-600 flex-shrink-0" />
                        {rule}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Packages */}
        {activeTab === "packages" && (
          <div>
            <div className="text-center mb-10">
              <h2 className="text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
                Fishing Packages & Pricing
              </h2>
              <p className="text-gray-500 mt-2">All packages include access to our certified sport fishing zones and basic guide assistance.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg, i) => (
                <div key={i} className={`border-2 rounded-2xl p-6 hover:shadow-lg transition-shadow ${pkg.color}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-900 font-bold text-xl">{pkg.name}</h3>
                    <span className={`text-white text-xs font-bold px-3 py-1 rounded-full ${pkg.badgeColor}`}>{pkg.badge}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 flex items-center gap-1"><Clock size={13} /> {pkg.duration}</p>
                  <div className="mb-5">
                    <span className="text-3xl font-bold text-gray-900">{pkg.price}</span>
                    <span className="text-gray-500 text-sm ml-1">{pkg.perPerson ? "/ person" : "/ group"}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-gray-700 text-sm">
                        <CheckCircle size={14} className="text-teal-600 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/schedule-visit" className="block w-full text-center bg-teal-700 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl transition-colors">
                    Book This Package
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-teal-50 border border-teal-200 rounded-2xl p-6 text-center">
              <p className="text-teal-700 text-sm">
                <strong>Corporate & Team Building Packages</strong> available for groups over 10 people. Contact us for custom pricing and catering options.
              </p>
              <Link to="/contact" className="mt-3 inline-flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-600 text-sm transition-colors">
                Get Custom Quote <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}

        {/* Equipment */}
        {activeTab === "equipment" && (
          <div>
            <div className="text-center mb-10">
              <h2 className="text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
                Equipment Rental & Purchase
              </h2>
              <p className="text-gray-500 mt-2">Hourly and full-day rentals available. All equipment is cleaned, inspected, and certified before each session.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-teal-800 text-white">
                      <th className="text-left px-6 py-4 text-sm font-semibold">Equipment Item</th>
                      <th className="text-center px-6 py-4 text-sm font-semibold">Hourly Rate</th>
                      <th className="text-center px-6 py-4 text-sm font-semibold">Full Day Rate</th>
                      <th className="text-center px-6 py-4 text-sm font-semibold">Deposit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentalEquipment.map((item, i) => (
                      <tr key={i} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="px-6 py-4 text-gray-900 font-medium text-sm">{item.item}</td>
                        <td className="px-6 py-4 text-center text-teal-700 font-semibold text-sm">{item.perHour}</td>
                        <td className="px-6 py-4 text-center text-teal-700 font-semibold text-sm">{item.perDay}</td>
                        <td className="px-6 py-4 text-center text-gray-600 text-sm">{item.deposit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <ShoppingBag size={22} className="text-blue-700 mb-3" />
                <h3 className="text-blue-800 font-semibold text-lg mb-2">Equipment for Purchase</h3>
                <p className="text-blue-700 text-sm mb-3">
                  Visit our <Link to="/store" className="underline font-medium">Aquafarm Fish Store</Link> for a wide range of fishing equipment available for purchase — from beginner starter kits to professional angler gear.
                </p>
                <Link to="/store" className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
                  Browse Store <ArrowRight size={13} />
                </Link>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <Package size={22} className="text-green-700 mb-3" />
                <h3 className="text-green-800 font-semibold text-lg mb-2">Equipment Care Policy</h3>
                <p className="text-green-700 text-sm leading-relaxed">
                  All rented equipment must be returned in the same condition. Damage, loss, or excessive wear will result in partial or full deposit forfeiture. Equipment is fully insured during normal use.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Regulations */}
        {activeTab === "regulations" && (
          <div>
            <div className="text-center mb-10">
              <h2 className="text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
                Fishing Rules & Regulations
              </h2>
              <p className="text-gray-500 mt-2">Please read and adhere to all rules before entering the sport fishing zone. Violation may result in immediate removal.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle size={18} className="text-green-600" />
                  </div>
                  <h3 className="text-green-800 font-semibold text-lg">What is Allowed</h3>
                </div>
                <div className="space-y-3">
                  {regulations.filter(r => r.type === "allowed").map((r, i) => (
                    <div key={i} className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
                      <CheckCircle size={15} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{r.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <XCircle size={18} className="text-red-600" />
                  </div>
                  <h3 className="text-red-800 font-semibold text-lg">What is Strictly Prohibited</h3>
                </div>
                <div className="space-y-3">
                  {regulations.filter(r => r.type === "banned").map((r, i) => (
                    <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3">
                      <XCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{r.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 bg-amber-50 border border-amber-300 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-amber-800 font-semibold mb-1">Daily Catch Limit</h4>
                  <p className="text-amber-700 text-sm">
                    Maximum <strong>5 fish per person per day</strong>. Catch-and-release is encouraged and a release bonus of KES 200 discount on your next visit applies. All caught fish leaving the premise must be paid for at current market rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
