import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { GraduationCap, Clock, Users, Award, CheckCircle, ArrowRight, BookOpen, Star, CalendarCheck } from "lucide-react";
import { Link } from "react-router";

const courses = [
  {
    id: 1,
    title: "Introduction to Aquaculture",
    level: "Beginner",
    duration: "2 Days",
    price: "KES 5,000",
    maxStudents: 20,
    nextDate: "April 5, 2026",
    desc: "A comprehensive beginner's course covering pond setup, fish selection, water management, feeding, and basic business concepts. Perfect for aspiring fish farmers.",
    outcomes: [
      "Understand basic aquaculture principles",
      "Set up and manage a basic fish pond",
      "Choose appropriate species for your area",
      "Apply basic water quality management",
      "Create a simple fish farm business plan",
    ],
    color: "border-teal-300",
    badge: "Most Popular",
    badgeColor: "bg-teal-600",
    includes: "Certificate, Course Manual, Refreshments",
    image: "https://images.unsplash.com/photo-1609101419675-60842b69628d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhY3VsdHVyZSUyMGZpc2glMjBwb25kJTIwdGVjaG5vbG9neSUyMGFlcmF0aW9ufGVufDF8fHx8MTc3NDc3ODc3NHww&ixlib=rb-4.1.0&q=80&w=600",
  },
  {
    id: 2,
    title: "Advanced Fish Farming",
    level: "Intermediate",
    duration: "5 Days",
    price: "KES 15,000",
    maxStudents: 15,
    nextDate: "April 12, 2026",
    desc: "For practicing fish farmers seeking to scale up. Topics include RAS technology, disease management, feed formulation, market linkages, and financial management.",
    outcomes: [
      "Implement RAS and intensive farming methods",
      "Diagnose and treat common fish diseases",
      "Formulate cost-effective fish feed",
      "Access wholesale markets and export channels",
      "Manage cash flow and farm finances",
    ],
    color: "border-amber-400",
    badge: "Highly Rated",
    badgeColor: "bg-amber-600",
    includes: "Certificate, Manual, Lab Sessions, Meals",
    image: "https://images.unsplash.com/photo-1623745494461-c5afa6f6e507?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZpc2glMjBmYXJtaW5nJTIwS2VueWElMjBBZnJpY2F8ZW58MXx8fHwxNzc0Nzc4Nzc1fDA&ixlib=rb-4.1.0&q=80&w=600",
  },
  {
    id: 3,
    title: "Recreational Fishing Skills",
    level: "All Levels",
    duration: "1 Day",
    price: "KES 3,000",
    maxStudents: 12,
    nextDate: "Every Saturday",
    desc: "Learn the art of fishing from our expert instructors. Covers rod casting, reading water, bait selection, catch handling, and basic fishing regulations. Equipment provided.",
    outcomes: [
      "Master basic and advanced casting techniques",
      "Read water to find fish effectively",
      "Select appropriate bait and lures",
      "Handle and care for caught fish",
      "Understand fishing ethics & regulations",
    ],
    color: "border-blue-300",
    badge: "Fun & Practical",
    badgeColor: "bg-blue-600",
    includes: "Equipment, Refreshments, Certificate",
    image: "https://images.unsplash.com/photo-1763047302840-17f4131fa3a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMGZpc2hpbmclMjBsYWtlJTIwcm9kJTIwY2F0Y2glMjBmcmVzaHdhdGVyfGVufDF8fHx8MTc3NDc3ODc3N3ww&ixlib=rb-4.1.0&q=80&w=600",
  },
  {
    id: 4,
    title: "Fish Pond Construction & Management",
    level: "Technical",
    duration: "3 Days",
    price: "KES 8,000",
    maxStudents: 18,
    nextDate: "April 20, 2026",
    desc: "Hands-on technical training on earthen pond design, excavation, water inlet/outlet systems, lining, and ongoing maintenance best practices.",
    outcomes: [
      "Design and site appropriate fish ponds",
      "Supervise pond construction projects",
      "Install water management infrastructure",
      "Carry out regular pond maintenance",
      "Prevent and repair common pond problems",
    ],
    color: "border-green-300",
    badge: "Hands-On",
    badgeColor: "bg-green-600",
    includes: "Certificate, Tools Training, Field Sessions, Manual",
  },
  {
    id: 5,
    title: "Fish Value Addition & Processing",
    level: "Intermediate",
    duration: "2 Days",
    price: "KES 6,000",
    maxStudents: 20,
    nextDate: "May 3, 2026",
    desc: "Learn how to process, smoke, fry, package, and add value to fish products for retail and export markets. Food safety and hygiene standards included.",
    outcomes: [
      "Apply hygienic fish processing methods",
      "Smoke and dry fish for preservation",
      "Package fish for retail and wholesale",
      "Meet food safety regulations",
      "Price and market fish products",
    ],
    color: "border-purple-300",
    badge: "Value Chain",
    badgeColor: "bg-purple-600",
    includes: "Certificate, Processing Equipment Use, Meals",
  },
  {
    id: 6,
    title: "Corporate Group Fishing Experience",
    level: "Recreation",
    duration: "Half to Full Day",
    price: "KES 2,500/person",
    maxStudents: 30,
    nextDate: "Book Anytime",
    desc: "Team-building fishing experience for corporate groups. Includes guided fishing, friendly competitions, catering, and farm tour. Customizable for any group.",
    outcomes: [
      "Team bonding through guided fishing",
      "Learn basic fishing skills",
      "Compete in friendly fishing contests",
      "Enjoy outdoor catering & BBQ",
      "Farm tour and product tasting",
    ],
    color: "border-rose-300",
    badge: "Corporate",
    badgeColor: "bg-rose-600",
    includes: "Equipment, Catering, BBQ, Prizes, Farm Tour",
  },
];

const instructors = [
  { name: "Moses Kiprotich", specialty: "Aquaculture & Pond Management", exp: "15 years", cert: "BSc Aquaculture, UoN", initials: "MK", color: "bg-teal-700" },
  { name: "Ann Muthoni", specialty: "Fish Processing & Value Addition", exp: "10 years", cert: "MSc Food Science, JKUAT", initials: "AM", color: "bg-purple-700" },
  { name: "Edwin Omondi", specialty: "Recreational Fishing & Sport Angling", exp: "12 years", cert: "Certified Fishing Instructor", initials: "EO", color: "bg-blue-700" },
  { name: "Dr. Lydia Wambui", specialty: "Fish Health & Disease Management", exp: "18 years", cert: "PhD Aquatic Sciences, UoN", initials: "LW", color: "bg-green-700" },
];

export function Training() {
  const [selected, setSelected] = useState<number | null>(null);
  const [bookForm, setBookForm] = useState({ name: "", email: "", phone: "", courseId: 0 });
  const [submitted, setSubmitted] = useState(false);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-80 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1771533679900-568efb11569b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwdHJhaW5pbmclMjBpbnN0cnVjdG9yJTIwYm9hdCUyMGxlc3NvbnxlbnwxfHx8fDE3NzQ1NDQzODF8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Training"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 h-full flex items-center text-white">
          <div>
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Skills Development</span>
            <h1 className="mt-2 mb-2" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700 }}>
              Training Programs
            </h1>
            <p className="text-teal-200 max-w-xl">
              From beginner aquaculture to advanced fish farming and sport fishing — build skills that transform your life and business.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-teal-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "6", label: "Training Courses" },
            { val: "1,200+", label: "Graduates" },
            { val: "4", label: "Expert Trainers" },
            { val: "95%", label: "Success Rate" },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-amber-300 font-bold text-2xl">{s.val}</p>
              <p className="text-teal-300 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Courses */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Available Courses</span>
            <h2 className="mt-2 text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
              Our Training Programs
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Certified practical courses for aspiring and experienced fish farmers, anglers, and food processors.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className={`border-2 rounded-2xl overflow-hidden hover:shadow-xl transition-all bg-white ${course.color}`}>
                {course.image && (
                  <div className="h-40 overflow-hidden relative">
                    <ImageWithFallback
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className={`absolute top-3 right-3 text-white text-xs font-bold px-2 py-1 rounded-full ${course.badgeColor}`}>{course.badge}</span>
                  </div>
                )}
                <div className={`${!course.image ? "bg-gradient-to-br from-teal-50 to-blue-50 " : ""}p-5 border-b border-gray-100`}>
                  {!course.image && (
                    <div className="flex items-start justify-between mb-2">
                      <div className="bg-teal-100 p-2 rounded-xl">
                        <GraduationCap size={20} className="text-teal-700" />
                      </div>
                      <span className={`text-white text-xs font-bold px-2 py-1 rounded-full ${course.badgeColor}`}>{course.badge}</span>
                    </div>
                  )}
                  <div className={`flex items-center gap-2 mb-2 ${course.image ? "mt-0" : "mt-2"}`}>
                    {course.image && <GraduationCap size={16} className="text-teal-700" />}
                    <h3 className="text-gray-900 font-bold text-lg">{course.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-white text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-teal-200">{course.level}</span>
                    <span className="bg-white text-gray-600 text-xs px-2 py-0.5 rounded-full border border-gray-200 flex items-center gap-1">
                      <Clock size={10} /> {course.duration}
                    </span>
                    <span className="bg-white text-gray-600 text-xs px-2 py-0.5 rounded-full border border-gray-200 flex items-center gap-1">
                      <Users size={10} /> Max {course.maxStudents}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{course.desc}</p>
                  <p className="text-xs text-gray-500 mb-1 font-medium">Includes: {course.includes}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-teal-700 font-bold text-xl">{course.price}</p>
                      <p className="text-gray-400 text-xs flex items-center gap-1"><CalendarCheck size={10} /> Next: {course.nextDate}</p>
                    </div>
                    <button
                      onClick={() => setSelected(course.id)}
                      className="bg-teal-700 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
                    >
                      Enroll <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            {submitted ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <h3 className="text-gray-900 font-bold text-xl mb-2">Enrollment Submitted!</h3>
                <p className="text-gray-600 text-sm mb-4">
                  We'll contact you within 24 hours with payment details and course confirmation.
                </p>
                <button
                  onClick={() => { setSelected(null); setSubmitted(false); }}
                  className="bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-teal-600 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-gray-900 font-bold text-xl mb-1" style={{ fontFamily: "Playfair Display, serif" }}>
                  Enroll in Course
                </h3>
                <p className="text-teal-700 text-sm font-medium mb-5">
                  {courses.find(c => c.id === selected)?.title}
                </p>
                <form onSubmit={handleBook} className="space-y-4">
                  <input
                    required type="text" placeholder="Full Name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                    onChange={(e) => setBookForm({ ...bookForm, name: e.target.value })}
                  />
                  <input
                    required type="email" placeholder="Email Address"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                    onChange={(e) => setBookForm({ ...bookForm, email: e.target.value })}
                  />
                  <input
                    required type="tel" placeholder="Phone Number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 transition-colors"
                    onChange={(e) => setBookForm({ ...bookForm, phone: e.target.value })}
                  />
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setSelected(null)} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 bg-teal-700 hover:bg-teal-600 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                      Submit Enrollment
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Instructors */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Expert Faculty</span>
            <h2 className="mt-2 text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
              Meet Our Instructors
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((inst, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow">
                <div className={`w-16 h-16 ${inst.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4`}>
                  {inst.initials}
                </div>
                <h3 className="font-semibold text-gray-900">{inst.name}</h3>
                <p className="text-teal-700 text-xs font-medium mt-0.5 mb-2">{inst.specialty}</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1,2,3,4,5].map(s => <Star key={s} size={11} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-500 text-xs">{inst.exp} experience</p>
                <p className="text-gray-400 text-xs mt-1 italic">{inst.cert}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-teal-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <BookOpen size={40} className="text-amber-400 mx-auto mb-4" />
          <h2 className="mb-3" style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700 }}>
            Ready to Start Your Journey?
          </h2>
          <p className="text-teal-200 mb-6">
            Join over 1,200 graduates who have transformed their lives and businesses through Aquafarm training.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Contact Training Team <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}