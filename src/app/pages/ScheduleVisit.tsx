import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { CalendarCheck, Users, User, School, Tractor, Handshake, Clock, MapPin, CheckCircle, ArrowRight, Phone, Star } from "lucide-react";

type VisitType = "individual" | "school" | "farmer" | "cooperative" | "corporate";

const visitTypes = [
  { id: "individual" as VisitType, label: "Individual / Family", icon: User, desc: "Personal guided tour for individuals or small family groups", color: "border-teal-300 bg-teal-50 text-teal-700" },
  { id: "school" as VisitType, label: "School / University", icon: School, desc: "Educational visits for students — aligned to STEM & agriculture curriculum", color: "border-blue-300 bg-blue-50 text-blue-700" },
  { id: "farmer" as VisitType, label: "Farmers Group", icon: Tractor, desc: "Practical aquaculture demonstrations for small-scale farmers", color: "border-green-300 bg-green-50 text-green-700" },
  { id: "cooperative" as VisitType, label: "Co-operative Society", icon: Handshake, desc: "Business & partnership visits for cooperatives and investment groups", color: "border-amber-300 bg-amber-50 text-amber-700" },
  { id: "corporate" as VisitType, label: "Corporate / Team Building", icon: Users, desc: "Team-building packages with fishing, farm tour & outdoor catering", color: "border-purple-300 bg-purple-50 text-purple-700" },
];

const tourHighlights = [
  "Guided tour of all active fish ponds",
  "Live demonstration of feeding & aeration systems",
  "Water quality monitoring system showcase",
  "RAS technology explanation & tour",
  "Fish harvesting demonstration (scheduled dates)",
  "Q&A session with our aquaculture experts",
  "Optional sport fishing session (extra charge)",
  "Visit to our fish store & equipment section",
  "Refreshments and snacks included",
  "Comprehensive visit booklet provided",
];

const availability = [
  { day: "Monday – Friday", time: "8:00 AM – 4:00 PM", status: "available" },
  { day: "Saturday", time: "8:00 AM – 3:00 PM", status: "available" },
  { day: "Sunday", time: "10:00 AM – 2:00 PM", status: "limited" },
  { day: "Public Holidays", time: "By special arrangement", status: "special" },
];

export function ScheduleVisit() {
  const [visitType, setVisitType] = useState<VisitType>("individual");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", organization: "", email: "", phone: "",
    date: "", time: "", groupSize: "", purpose: "",
    fisherInterest: false, specialNeeds: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1681705357021-d5434018247b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBjaGlsZHJlbiUyMGZhcm0lMjBlZHVjYXRpb25hbCUyMHZpc2l0fGVufDF8fHx8MTc3NDU0NDM3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Farm Visit"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-teal-900/80" />
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Educational & Leisure</span>
          <h1 className="mt-2 mb-3" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700 }}>
            Schedule a Farm Visit
          </h1>
          <p className="text-teal-200 text-lg max-w-2xl mx-auto">
            Bring your school, group, cooperative, or family for an unforgettable educational experience at Aquafarm Fisheries.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left - Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Visit Highlights */}
            <div className="bg-teal-900 text-white rounded-2xl p-6">
              <h3 className="font-bold text-xl mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                What to Expect
              </h3>
              <div className="space-y-2">
                {tourHighlights.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-teal-200 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <Clock size={18} className="text-teal-600" /> Visiting Hours
              </h3>
              <div className="space-y-3">
                {availability.map((slot, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-gray-800 font-medium text-sm">{slot.day}</p>
                      <p className="text-gray-500 text-xs">{slot.time}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      slot.status === "available" ? "bg-green-100 text-green-700" :
                      slot.status === "limited" ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {slot.status === "available" ? "Available" : slot.status === "limited" ? "Limited" : "Special"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-500 text-xs flex items-start gap-1">
                  <MapPin size={11} className="flex-shrink-0 mt-0.5" />
                  Aquafarm Fisheries Complex, Naivasha Road, Nakuru, Kenya
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="font-bold text-amber-800 text-lg mb-3">Need Help Booking?</h3>
              <p className="text-amber-700 text-sm mb-3">Our visits team is happy to help customize your farm visit.</p>
              <a href="tel:+254700000000" className="flex items-center gap-2 text-amber-700 font-semibold text-sm hover:text-amber-600 transition-colors">
                <Phone size={14} /> +254 700 000 000
              </a>
              <p className="text-amber-600 text-xs mt-2">Minimum 48 hours advance booking required</p>
            </div>

            {/* Ratings */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                {[1,2,3,4,5].map(s => <Star key={s} size={16} className="text-amber-400 fill-amber-400" />)}
                <span className="text-gray-700 font-semibold text-sm ml-1">4.9/5</span>
              </div>
              <p className="text-gray-500 text-xs">Based on 142 verified visit reviews</p>
              <p className="text-gray-700 text-sm mt-2 italic">"Best educational farm visit in Kenya! Students loved every bit of it."</p>
              <p className="text-gray-500 text-xs mt-1">— Principal, Nakuru Academy</p>
            </div>
          </div>

          {/* Right - Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-green-50 border border-green-300 rounded-3xl p-10 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <h2 className="text-gray-900 font-bold text-2xl mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                  Visit Request Submitted!
                </h2>
                <p className="text-gray-600 mb-2">
                  Thank you for scheduling a visit to Aquafarm Fisheries! Our team will review your request and contact you within <strong>24 hours</strong> to confirm your booking.
                </p>
                <p className="text-gray-500 text-sm">Check your email for a confirmation receipt.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Schedule Another Visit
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
                <h2 className="text-gray-900 font-bold text-2xl mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                  Book Your Visit
                </h2>
                <p className="text-gray-500 text-sm mb-6">Fill in the form below. All fields marked * are required.</p>

                {/* Visit Type Selection */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold text-sm mb-3">Visit Type *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {visitTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setVisitType(type.id)}
                          className={`border-2 rounded-xl p-3 text-left transition-all ${
                            visitType === type.id
                              ? `${type.color} border-opacity-100`
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon size={15} />
                            <span className="text-sm font-semibold">{type.label}</span>
                          </div>
                          <p className="text-xs opacity-70 leading-snug">{type.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Contact Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        {visitType === "individual" ? "Family/Group Name" : "Organization/School Name"} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={visitType === "individual" ? "e.g. The Kamau Family" : "e.g. Nakuru Boys High School"}
                        value={form.organization}
                        onChange={(e) => setForm({ ...form, organization: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+254 700 000 000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Preferred Date *</label>
                      <input
                        type="date"
                        required
                        value={form.date}
                        min={new Date(Date.now() + 48 * 3600000).toISOString().split("T")[0]}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Preferred Time *</label>
                      <select
                        required
                        value={form.time}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 bg-white transition-colors"
                      >
                        <option value="">Select time</option>
                        <option>8:00 AM</option>
                        <option>9:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>2:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">Group Size *</label>
                      <input
                        type="number"
                        required
                        min={1}
                        placeholder="No. of people"
                        value={form.groupSize}
                        onChange={(e) => setForm({ ...form, groupSize: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Purpose / Special Interests</label>
                    <textarea
                      rows={3}
                      placeholder="Describe the purpose of your visit, any specific areas of interest, or questions you'd like addressed during the tour..."
                      value={form.purpose}
                      onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-colors resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <input
                      type="checkbox"
                      id="fishing"
                      checked={form.fisherInterest}
                      onChange={(e) => setForm({ ...form, fisherInterest: e.target.checked })}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <label htmlFor="fishing" className="text-amber-800 text-sm font-medium cursor-pointer">
                      I'm interested in adding a Sport Fishing session to my visit (extra charges apply)
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg text-sm"
                  >
                    <CalendarCheck size={16} />
                    Submit Visit Request
                    <ArrowRight size={15} />
                  </button>
                  <p className="text-center text-gray-400 text-xs">
                    We'll confirm your booking within 24 hours. No payment required at this stage.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
