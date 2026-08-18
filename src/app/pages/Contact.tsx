import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageCircle } from "lucide-react";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", department: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-900 to-teal-700 py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Get in Touch</span>
          <h1 className="mt-2 mb-3" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700 }}>
            Contact Aquafarm Fisheries
          </h1>
          <p className="text-teal-200 text-lg max-w-xl mx-auto">
            Whether you're a buyer, partner, student, or just curious — we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Phone, title: "Call Us", info: "+254 700 000 000\n+254 722 000 000", sub: "Mon–Sat: 7AM – 6PM", href: "tel:+254700000000", color: "text-teal-700 bg-teal-50" },
              { icon: Mail, title: "Email Us", info: "info@aquafarmfisheries.co.ke\nsales@aquafarmfisheries.co.ke", sub: "Response within 24 hours", href: "mailto:info@aquafarmfisheries.co.ke", color: "text-blue-700 bg-blue-50" },
              { icon: MapPin, title: "Visit Us", info: "Naivasha Road, Nakuru\nKenya, East Africa", sub: "Open Mon–Sat", href: "https://maps.google.com", color: "text-amber-700 bg-amber-50" },
              { icon: MessageCircle, title: "WhatsApp", info: "+254 700 000 000", sub: "Instant chat support", href: "https://wa.me/254700000000", color: "text-green-700 bg-green-50" },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <a key={i} href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                  className={`flex items-start gap-3 rounded-2xl p-5 border border-transparent hover:border-gray-200 hover:shadow-md transition-all ${card.color}`}>
                  <Icon size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{card.title}</h3>
                    <p className="text-gray-700 text-sm whitespace-pre-line mt-0.5">{card.info}</p>
                    <p className="text-gray-500 text-xs mt-1">{card.sub}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-gray-900 font-bold text-2xl mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
              Send Us a Message
            </h2>
            <p className="text-gray-500 text-sm mb-6">We'll get back to you within 1 business day.</p>
            {submitted ? (
              <div className="bg-green-50 border border-green-300 rounded-3xl p-10 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <h3 className="text-gray-900 font-bold text-xl mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thank you for contacting Aquafarm Fisheries. We'll respond within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-5 bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-teal-600 transition-colors">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Full Name *</label>
                    <input required type="text" placeholder="John Kamau" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number</label>
                    <input type="tel" placeholder="+254 700 000 000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Email Address *</label>
                  <input required type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Department *</label>
                  <select required value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 bg-white transition-colors">
                    <option value="">Select department</option>
                    <option>Sales & Fish Orders</option>
                    <option>Visit Bookings & Tours</option>
                    <option>Training Programs</option>
                    <option>Sport Fishing</option>
                    <option>Community & Partnerships</option>
                    <option>Careers & HR</option>
                    <option>General Enquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Subject *</label>
                  <input required type="text" placeholder="e.g. Wholesale Fish Order Inquiry" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Message *</label>
                  <textarea required rows={5} placeholder="Tell us how we can help you..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-colors resize-none" />
                </div>
                <button type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-colors shadow-md">
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Map Placeholder */}
            <div className="bg-teal-50 border border-teal-200 rounded-2xl overflow-hidden">
              <div className="bg-teal-800 p-4 text-white flex items-center gap-2">
                <MapPin size={16} className="text-amber-400" />
                <span className="font-semibold">Find Us on the Map</span>
              </div>
              <div className="h-48 bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
                <div className="text-center text-teal-600">
                  <MapPin size={36} className="mx-auto mb-2 text-teal-400" />
                  <p className="font-semibold">Aquafarm Fisheries</p>
                  <p className="text-sm">Naivasha Road, Nakuru, Kenya</p>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-block text-xs text-teal-700 underline">
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock size={16} className="text-teal-700" /> Opening Hours</h3>
              {[
                { day: "Monday – Friday", time: "7:00 AM – 6:00 PM" },
                { day: "Saturday", time: "7:00 AM – 5:00 PM" },
                { day: "Sunday", time: "8:00 AM – 4:00 PM" },
                { day: "Public Holidays", time: "9:00 AM – 3:00 PM" },
              ].map((h, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-700 text-sm">{h.day}</span>
                  <span className="text-teal-700 font-semibold text-sm">{h.time}</span>
                </div>
              ))}
            </div>

            {/* Departments */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Direct Department Contacts</h3>
              <div className="space-y-3">
                {[
                  { dept: "Fish Sales", email: "sales@aquafarmfisheries.co.ke", phone: "+254 700 000 001" },
                  { dept: "Farm Visits & Training", email: "visits@aquafarmfisheries.co.ke", phone: "+254 700 000 002" },
                  { dept: "HR & Careers", email: "careers@aquafarmfisheries.co.ke", phone: "+254 700 000 003" },
                  { dept: "Community Programs", email: "community@aquafarmfisheries.co.ke", phone: "+254 700 000 004" },
                ].map((d, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-teal-700 font-semibold text-sm">{d.dept}</p>
                    <p className="text-gray-600 text-xs">{d.email}</p>
                    <p className="text-gray-600 text-xs">{d.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
