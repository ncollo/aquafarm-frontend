import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Target, Eye, Quote, Clock, Users, Award, Leaf, CheckCircle, ArrowRight, Heart } from "lucide-react";

const timeline = [
  { year: "2012", title: "Foundation", desc: "Aquafarm Fisheries was founded by John Mwangi and a group of passionate aquaculture enthusiasts in Nakuru, starting with 3 small ponds and 500 Tilapia fingerlings." },
  { year: "2014", title: "First Harvest & Sales", desc: "Achieved our first major commercial harvest of 2 tonnes. Began supplying local markets, restaurants, and supermarkets in Nakuru and Naivasha." },
  { year: "2016", title: "Expansion & Technology", desc: "Invested in Recirculating Aquaculture System (RAS) technology, growing to 15 ponds. Introduced African Catfish and Rainbow Trout species." },
  { year: "2018", title: "Community Programs", desc: "Launched the Aquafarm Community Development Program, partnering with 30 small-scale farmers and providing fingerlings, feeds, and training." },
  { year: "2020", title: "Sport Fishing & Training Centre", desc: "Opened our Sport Fishing Zone and established the Aquafarm Training Centre, offering certified courses in aquaculture and recreational fishing." },
  { year: "2022", title: "ISO Certification", desc: "Received ISO certification for sustainable aquaculture practices and opened our full equipment store and online sales platform." },
  { year: "2024", title: "Award-Winning Farm", desc: "Won 'Best Aquaculture Farm in Kenya 2024' and expanded to over 30 ponds, reaching 500+ tonnes annual harvest capacity." },
  { year: "2026", title: "Today", desc: "Aquafarm Fisheries continues to grow — serving thousands of customers, training hundreds of farmers, and contributing to Kenya's food security." },
];

const team = [
  { name: "John Mwangi", role: "Founder & CEO", initials: "JM", dept: "Leadership", color: "bg-teal-700" },
  { name: "Dr. Sarah Otieno", role: "Chief Aquaculture Officer", initials: "SO", dept: "Science & Operations", color: "bg-blue-700" },
  { name: "Peter Kimani", role: "Farm Operations Manager", initials: "PK", dept: "Operations", color: "bg-green-700" },
  { name: "Grace Njeri", role: "Sales & Marketing Manager", initials: "GN", dept: "Sales", color: "bg-purple-700" },
  { name: "David Ochieng", role: "Training Coordinator", initials: "DO", dept: "Training", color: "bg-amber-700" },
  { name: "Faith Waweru", role: "Community Liaison Officer", initials: "FW", dept: "Community", color: "bg-rose-700" },
];

export function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-teal-900 to-teal-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-64 h-64 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-teal-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Our Story</span>
          <h1 className="mt-2 mb-4 text-white" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700 }}>
            About Aquafarm Fisheries
          </h1>
          <p className="text-teal-200 text-lg max-w-2xl mx-auto">
            Over a decade of sustainable aquaculture, community development, and feeding Kenya's growing population with quality, responsibly farmed fish.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Motto */}
      <section id="mission" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Our Foundation</span>
            <h2 className="mt-2 text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
              Mission, Vision & Motto
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="bg-teal-700 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target size={28} className="text-white" />
              </div>
              <h3 className="text-teal-800 font-bold text-xl mb-3" style={{ fontFamily: "Playfair Display, serif" }}>Our Mission</h3>
              <p className="text-teal-700 leading-relaxed">
                To produce high-quality, sustainable fish through innovative aquaculture technology, while empowering local communities, promoting food security, and preserving Kenya's freshwater ecosystems for future generations.
              </p>
            </div>
            {/* Vision */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="bg-amber-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Eye size={28} className="text-white" />
              </div>
              <h3 className="text-amber-800 font-bold text-xl mb-3" style={{ fontFamily: "Playfair Display, serif" }}>Our Vision</h3>
              <p className="text-amber-700 leading-relaxed">
                To be East Africa's leading sustainable aquaculture enterprise — recognized for excellence in fish quality, community impact, environmental stewardship, and innovation in fish farming technology.
              </p>
            </div>
            {/* Motto */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="bg-green-700 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Quote size={28} className="text-white" />
              </div>
              <h3 className="text-green-800 font-bold text-xl mb-3" style={{ fontFamily: "Playfair Display, serif" }}>Our Motto</h3>
              <blockquote className="text-green-700 leading-relaxed italic text-lg">
                "From Our Waters to Your Plate — Fresh, Responsible, Community-Driven."
              </blockquote>
              <p className="text-green-600 mt-3 text-sm">
                Every fish we farm, sell, and deliver carries our commitment to quality, sustainability, and the wellbeing of our communities.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="mt-12 bg-gradient-to-r from-teal-800 to-teal-900 rounded-3xl p-8 sm:p-10 text-white">
            <div className="text-center mb-8">
              <h3 className="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-2">What We Stand For</h3>
              <h2 className="text-white" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", fontWeight: 700 }}>
                Our Core Values
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Leaf, title: "Sustainability", desc: "Environmental responsibility in every decision" },
                { icon: Award, title: "Quality", desc: "Premium fish products meeting the highest standards" },
                { icon: Heart, title: "Community", desc: "Uplifting the people around us through our work" },
                { icon: CheckCircle, title: "Integrity", desc: "Honest, transparent and ethical business practices" },
              ].map((val, i) => {
                const Icon = val.icon;
                return (
                  <div key={i} className="text-center">
                    <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icon size={22} className="text-amber-400" />
                    </div>
                    <h4 className="text-white font-semibold mb-1">{val.title}</h4>
                    <p className="text-teal-300 text-xs leading-relaxed">{val.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section id="history" className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Our Journey</span>
            <h2 className="mt-2 text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
              How We Were Founded & Grew
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              From three humble ponds to Kenya's premier fish farm — a story of passion, hard work, and community.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-teal-200 -translate-x-1/2"></div>
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className={`relative flex items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="flex-1 pl-16 md:pl-0">
                    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${i % 2 === 0 ? "md:mr-8" : "md:ml-8"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full">{item.year}</span>
                        <Clock size={13} className="text-gray-400" />
                      </div>
                      <h3 className="text-gray-900 font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  {/* Dot */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-teal-600 rounded-full border-4 border-white shadow-md z-10 top-6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">The People</span>
            <h2 className="mt-2 text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
              Meet Our Leadership Team
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Experienced professionals dedicated to sustainable aquaculture, community development, and operational excellence.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all group text-center">
                <div className={`w-20 h-20 ${member.color} rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {member.initials}
                </div>
                <h3 className="text-gray-900 font-semibold text-lg">{member.name}</h3>
                <p className="text-teal-700 text-sm font-medium mb-1">{member.role}</p>
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{member.dept}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-14 bg-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Recognition</span>
            <h2 className="mt-2 text-white" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
              Awards & Achievements
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { year: "2024", award: "Best Aquaculture Farm", body: "Kenya Aquaculture Awards" },
              { year: "2023", award: "Food Safety Excellence", body: "Kenya Bureau of Standards" },
              { year: "2022", award: "ISO 22000 Certification", body: "International Organization" },
              { year: "2021", award: "Community Impact Award", body: "Nakuru County Government" },
            ].map((ach, i) => (
              <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-colors">
                <Award size={28} className="text-amber-400 mx-auto mb-3" />
                <p className="text-amber-400 font-bold text-2xl">{ach.year}</p>
                <p className="text-white font-semibold mt-1">{ach.award}</p>
                <p className="text-teal-300 text-xs mt-1">{ach.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-gray-900 mb-3" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
            Want to Be Part of Our Story?
          </h2>
          <p className="text-gray-600 mb-8">
            Whether you're looking to buy fish, visit our farm, take up a career, or partner with us — we'd love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/careers" className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              <Users size={15} /> View Open Positions
            </Link>
            <Link to="/contact" className="flex items-center gap-2 border border-teal-300 text-teal-700 hover:bg-teal-50 font-semibold px-6 py-3 rounded-xl transition-colors">
              Contact Us <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
