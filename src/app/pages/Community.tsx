import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import { Heart, Leaf, Users, TrendingUp, HandHeart, School, Tractor, ArrowRight, CheckCircle, MapPin, Phone } from "lucide-react";

const programs = [
  {
    icon: Tractor,
    title: "Farmer Support Program",
    desc: "We partner with small-scale fish farmers across the Rift Valley, providing certified fingerlings, quality feed, technical support, and market linkages.",
    impact: "120+ farmers supported",
    color: "bg-green-50 border-green-200 text-green-700",
    details: [
      "Subsidized fingerlings for registered small-scale farmers",
      "Free technical site visits and consultations",
      "Guaranteed off-take of farmed fish at fair prices",
      "Access to Aquafarm's supply chain and markets",
      "Monthly farmer forums and knowledge-sharing events",
    ],
  },
  {
    icon: School,
    title: "Education & Youth Programs",
    desc: "We partner with schools, colleges, and youth groups to build the next generation of aquaculture professionals through education, mentorship, and internships.",
    impact: "50+ schools engaged",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    details: [
      "Free educational farm visits for public schools",
      "Annual aquaculture scholarship for 5 students",
      "Internship and attachment opportunities",
      "Teacher training on aquaculture curriculum",
      "Donation of fish and equipment to school ponds",
    ],
  },
  {
    icon: HandHeart,
    title: "Cooperative Development",
    desc: "We work directly with cooperatives and SACCOs to build sustainable group fish farming enterprises — from formation through to profitability.",
    impact: "15 cooperatives partnered",
    color: "bg-amber-50 border-amber-200 text-amber-700",
    details: [
      "Group business development training",
      "Access to communal fish ponds on contract",
      "Guaranteed market access at competitive rates",
      "Record-keeping and financial management support",
      "Annual cooperative performance awards",
    ],
  },
  {
    icon: Leaf,
    title: "Environmental Conservation",
    desc: "Our conservation program protects local water catchments, rehabilitates rivers, and promotes sustainable land use practices in areas surrounding our farm.",
    impact: "200+ trees planted",
    color: "bg-teal-50 border-teal-200 text-teal-700",
    details: [
      "Annual riverbank tree planting drives",
      "Water source protection around our farm",
      "Community clean-up programs",
      "Education on responsible water resource use",
      "Partnership with Nakuru County Water Department",
    ],
  },
];

const impactStats = [
  { val: "120+", label: "Small-scale Farmers Supported", icon: Tractor },
  { val: "50+", label: "Schools & Colleges Engaged", icon: School },
  { val: "KES 5M+", label: "Paid to Local Farmers (2024)", icon: TrendingUp },
  { val: "15", label: "Cooperatives Partnered", icon: Users },
];

const marketInfo = [
  { title: "Fresh Fish Market", desc: "Every Saturday, 7AM–12PM at Aquafarm main gate. Fresh fish, fingerlings, and feeds sold at farm prices.", location: "Aquafarm Fisheries Gate, Naivasha Rd", color: "bg-teal-50 border-teal-300" },
  { title: "Wholesale Supply", desc: "We supply supermarkets, hotels, restaurants, and fish mongers in Nakuru, Naivasha, and Nairobi. Minimum order 10kg.", location: "Delivery or Farm Pickup", color: "bg-amber-50 border-amber-300" },
  { title: "Community Fish Days", desc: "Monthly subsidized fish sales for residents, offering tilapia and catfish at below-market prices to improve food security.", location: "Rotating community locations", color: "bg-green-50 border-green-300" },
];

export function Community() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1768248559223-cc4ef20363fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwY29tbXVuaXR5JTIwbWFya2V0JTIwZnJlc2glMjBmaXNofGVufDF8fHx8MTc3NDU0NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Community"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-teal-900/80" />
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Community & Social Impact</span>
          <h1 className="mt-2 mb-4" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700 }}>
            Growing Together with Our Community
          </h1>
          <p className="text-teal-200 text-lg max-w-2xl mx-auto">
            At Aquafarm Fisheries, we believe a successful business must lift its community. Our programs empower farmers, youth, cooperatives, and the environment.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <div className="bg-teal-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {impactStats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-2">
                  <Icon size={22} className="text-amber-400" />
                </div>
                <p className="text-amber-300 font-bold text-2xl">{s.val}</p>
                <p className="text-teal-300 text-sm">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Programs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Our Initiatives</span>
            <h2 className="mt-2 text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
              Community Development Programs
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              We invest in people, not just fish. Here's how Aquafarm gives back.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((prog, i) => {
              const Icon = prog.icon;
              return (
                <div key={i} className={`border rounded-2xl p-6 hover:shadow-lg transition-shadow ${prog.color}`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">{prog.title}</h3>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-white/80 rounded-full mt-1 inline-block">{prog.impact}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{prog.desc}</p>
                  <div className="space-y-2">
                    {prog.details.map((d, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <CheckCircle size={13} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Farm Market */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Farm Market</span>
              <h2 className="mt-2 mb-5 text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
                Our Farm Market & How We Help Locals Grow
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                The Aquafarm Farm Market is more than just a place to buy fish — it's a community hub where local farmers sell produce, buyers get fair prices, and knowledge is shared. We believe in creating value at every point in the food chain.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                We prioritize buying from local suppliers, employing locally, and reinvesting in the communities around us. For every kilogram of fish we sell, a percentage goes to our Community Development Fund.
              </p>
              <div className="space-y-4">
                {marketInfo.map((m, i) => (
                  <div key={i} className={`border rounded-xl p-4 ${m.color}`}>
                    <h4 className="font-semibold text-gray-900 mb-1">{m.title}</h4>
                    <p className="text-gray-600 text-sm mb-2">{m.desc}</p>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <MapPin size={11} />
                      <span>{m.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1607629194620-a9726803827c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMGhhcnZlc3QlMjBmcmVzaCUyMGZpc2glMjB3b3JrZXJzfGVufDF8fHx8MTc3NDU0NDM4MXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Community Market"
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="bg-teal-900 text-white rounded-2xl p-6">
                <Heart size={22} className="text-rose-400 mb-3" />
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "Playfair Display, serif" }}>Community Development Fund</h3>
                <p className="text-teal-200 text-sm leading-relaxed mb-3">
                  5% of all Aquafarm sales go directly to our Community Development Fund, supporting bursaries, community health events, and local infrastructure projects.
                </p>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-amber-400 font-bold text-xl">KES 1.2M</p>
                  <p className="text-teal-300 text-xs">Disbursed to community in 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-14 bg-amber-50 border-y border-amber-200">
        <div className="max-w-4xl mx-auto px-4">
          <blockquote className="text-center">
            <p className="text-gray-700 text-xl italic leading-relaxed mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
              "Aquafarm didn't just give us fish — they gave us a livelihood. Their fingerlings, training, and guaranteed market have transformed over 40 families in our cooperative. We went from subsistence farming to earning KES 200,000 per harvest cycle."
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center text-white font-bold">RV</div>
              <div className="text-left">
                <p className="text-gray-900 font-semibold">Joseph Odhiambo, Chairman</p>
                <p className="text-gray-500 text-sm">Rift Valley Aquaculture Cooperative Society</p>
              </div>
            </div>
          </blockquote>
        </div>
      </section>

      {/* Partner with Us CTA */}
      <section className="py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-gray-900 mb-3" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
            Partner with Aquafarm Fisheries
          </h2>
          <p className="text-gray-600 mb-8">
            Are you a farmer, school, cooperative, or community organization? We'd love to collaborate. Let's build sustainable futures together.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Get in Touch <ArrowRight size={15} />
            </Link>
            <a
              href="https://wa.me/254700000000?text=Hello! I'm interested in partnering with Aquafarm Fisheries."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <Phone size={15} /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
