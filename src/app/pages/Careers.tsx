import { useState } from "react";
import { Briefcase, MapPin, Clock, Users, CheckCircle, ArrowRight, X, Upload, Search, Filter } from "lucide-react";

const jobs = [
  {
    id: 1,
    title: "Farm Operations Supervisor",
    dept: "Operations",
    type: "Full-time",
    location: "Nakuru, Kenya",
    salary: "KES 45,000 – 60,000/month",
    level: "Mid-level",
    posted: "March 20, 2026",
    deadline: "April 20, 2026",
    desc: "Oversee day-to-day operations of our fish ponds including feeding schedules, water quality monitoring, disease surveillance, and staff supervision.",
    requirements: [
      "Diploma or Degree in Aquaculture, Fisheries or related field",
      "3+ years experience in fish farm operations",
      "Experience with RAS technology is an added advantage",
      "Strong leadership and team management skills",
      "Proficiency in MS Office (for record-keeping)",
    ],
    responsibilities: [
      "Manage daily feeding, aeration, and pond maintenance",
      "Monitor and record water quality parameters",
      "Supervise a team of 5–10 farm workers",
      "Prepare weekly operations reports",
      "Implement biosecurity and health protocols",
    ],
    color: "bg-teal-50 border-teal-300",
    badge: "Urgent",
    badgeColor: "bg-red-500",
  },
  {
    id: 2,
    title: "Fish Sales & Marketing Executive",
    dept: "Sales & Marketing",
    type: "Full-time",
    location: "Nakuru / Nairobi (Hybrid)",
    salary: "KES 35,000 – 50,000 + Commission",
    level: "Junior to Mid",
    posted: "March 18, 2026",
    deadline: "April 15, 2026",
    desc: "Drive fish product sales to supermarkets, hotels, restaurants, and wholesale buyers. Manage client relationships and develop new market channels.",
    requirements: [
      "Degree/Diploma in Sales, Marketing, or Business",
      "2+ years in FMCG or food products sales",
      "Existing network in hospitality/retail sector preferred",
      "Valid driver's license",
      "Excellent communication and negotiation skills",
    ],
    responsibilities: [
      "Identify and onboard new wholesale and retail clients",
      "Manage existing client accounts and orders",
      "Achieve monthly sales targets",
      "Coordinate delivery schedules with operations team",
      "Prepare weekly sales reports and forecasts",
    ],
    color: "bg-blue-50 border-blue-300",
    badge: "New",
    badgeColor: "bg-blue-600",
  },
  {
    id: 3,
    title: "Aquaculture Trainer / Extension Officer",
    dept: "Training",
    type: "Full-time",
    location: "Nakuru, Kenya",
    salary: "KES 40,000 – 55,000/month",
    level: "Mid-level",
    posted: "March 15, 2026",
    deadline: "April 10, 2026",
    desc: "Design and deliver aquaculture training programs for farmers, cooperatives, and students. Conduct field visits and provide technical extension services.",
    requirements: [
      "BSc in Aquaculture, Fisheries Science or Agriculture",
      "Experience in adult education/training facilitation",
      "Practical fish farming experience (5+ years)",
      "Ability to travel to partner farm sites",
      "Strong presentation and communication skills",
    ],
    responsibilities: [
      "Develop and update training curriculum",
      "Conduct training sessions and workshops",
      "Provide on-farm technical support to partner farmers",
      "Monitor and evaluate farmer progress",
      "Write monthly training activity reports",
    ],
    color: "bg-green-50 border-green-300",
    badge: "Popular",
    badgeColor: "bg-green-600",
  },
  {
    id: 4,
    title: "Fish Store Manager",
    dept: "Retail & Store",
    type: "Full-time",
    location: "Nakuru, Kenya",
    salary: "KES 30,000 – 40,000/month",
    level: "Junior to Mid",
    posted: "March 12, 2026",
    deadline: "April 8, 2026",
    desc: "Manage our fish store operations including stock management, customer service, equipment sales, cash handling, and daily store administration.",
    requirements: [
      "Diploma in Business, Sales or related field",
      "Experience in retail management",
      "Knowledge of fishing equipment is an advantage",
      "Strong customer service orientation",
      "Honest, organized and detail-oriented",
    ],
    responsibilities: [
      "Open and close the store daily",
      "Manage stock levels and orders",
      "Serve walk-in and wholesale customers",
      "Handle daily cash reconciliation",
      "Maintain store cleanliness and displays",
    ],
    color: "bg-amber-50 border-amber-300",
    badge: "In-Store",
    badgeColor: "bg-amber-600",
  },
  {
    id: 5,
    title: "Finance & Accounts Officer",
    dept: "Finance",
    type: "Full-time",
    location: "Nakuru, Kenya",
    salary: "KES 45,000 – 60,000/month",
    level: "Mid-level",
    posted: "March 10, 2026",
    deadline: "April 5, 2026",
    desc: "Manage all financial records, prepare financial reports, handle payroll, coordinate tax compliance, and support budgeting and financial planning.",
    requirements: [
      "CPA Part 2 or above (CPA-K preferred)",
      "3+ years in finance/accounting role",
      "Proficiency in QuickBooks or similar ERP",
      "Knowledge of Kenya Revenue Authority (KRA) compliance",
      "High level of integrity and confidentiality",
    ],
    responsibilities: [
      "Prepare monthly financial statements",
      "Process payroll for 30+ staff",
      "Manage accounts payable and receivable",
      "Ensure tax compliance (VAT, PAYE, withholding tax)",
      "Coordinate annual audit preparation",
    ],
    color: "bg-purple-50 border-purple-300",
    badge: "Finance",
    badgeColor: "bg-purple-600",
  },
  {
    id: 6,
    title: "Fish Farm Labourers (5 Positions)",
    dept: "Operations",
    type: "Full-time",
    location: "Nakuru, Kenya",
    salary: "KES 15,000 – 22,000/month",
    level: "Entry Level",
    posted: "March 8, 2026",
    deadline: "April 3, 2026",
    desc: "Support daily farm operations including pond cleaning, fish feeding, aeration maintenance, harvesting, and general farm upkeep. Training provided.",
    requirements: [
      "KCSE certificate or equivalent",
      "Physically fit for outdoor farm work",
      "Willingness to work early morning and weekends",
      "Previous farm work experience preferred",
      "Honest, hardworking, and reliable",
    ],
    responsibilities: [
      "Feed fish according to prescribed schedules",
      "Clean and maintain pond environments",
      "Assist with fish harvesting activities",
      "Maintain farm equipment and tools",
      "Report any unusual fish behavior to supervisor",
    ],
    color: "bg-gray-50 border-gray-300",
    badge: "Multiple",
    badgeColor: "bg-gray-600",
  },
  {
    id: 7,
    title: "IT & Digital Marketing Officer",
    dept: "IT & Marketing",
    type: "Full-time",
    location: "Nakuru, Kenya (Hybrid)",
    salary: "KES 35,000 – 50,000/month",
    level: "Mid-level",
    posted: "March 5, 2026",
    deadline: "March 31, 2026",
    desc: "Manage Aquafarm's digital presence including website, social media, online store, and digital advertising. Also provide first-line IT support.",
    requirements: [
      "Degree/Diploma in IT, Computer Science, or Digital Marketing",
      "Proven social media management experience",
      "Website management skills (React/WordPress)",
      "Experience with SEO and digital ads (Google/Facebook)",
      "Graphic design skills (Canva/Adobe) preferred",
    ],
    responsibilities: [
      "Manage social media accounts daily",
      "Create marketing content and campaigns",
      "Update and maintain the company website",
      "Handle online inquiries and WhatsApp customer interactions",
      "Generate monthly digital performance reports",
    ],
    color: "bg-cyan-50 border-cyan-300",
    badge: "Digital",
    badgeColor: "bg-cyan-600",
  },
  {
    id: 8,
    title: "Security Guard (Day & Night Shifts)",
    dept: "Security",
    type: "Full-time",
    location: "Nakuru, Kenya",
    salary: "KES 12,000 – 16,000/month",
    level: "Entry Level",
    posted: "March 1, 2026",
    deadline: "March 28, 2026",
    desc: "Provide security services at Aquafarm Fisheries main premises, controlling entry/exit, monitoring CCTV, and ensuring safety of property and staff.",
    requirements: [
      "KCSE certificate or equivalent",
      "Valid security guard training certificate",
      "Good physical fitness",
      "Ability to work day and night shifts",
      "Clean criminal record",
    ],
    responsibilities: [
      "Monitor farm entry and exit points",
      "Patrol farm perimeter hourly",
      "Monitor CCTV and alarm systems",
      "Record visitor and vehicle logs",
      "Report security incidents immediately",
    ],
    color: "bg-orange-50 border-orange-300",
    badge: "Shift Work",
    badgeColor: "bg-orange-600",
  },
];

const howToApply = [
  { step: "1", title: "Find a Suitable Role", desc: "Browse all open positions and read the full job description, requirements, and responsibilities carefully." },
  { step: "2", title: "Prepare Your Documents", desc: "Prepare your updated CV (max 3 pages), cover letter, academic certificates, and 2 professional references." },
  { step: "3", title: "Submit Application", desc: "Send your application via email to careers@aquafarmfisheries.co.ke with the job title in the subject line." },
  { step: "4", title: "Shortlisting & Interview", desc: "Shortlisted candidates will be contacted within 2 weeks. Interviews are conducted at our Nakuru office." },
  { step: "5", title: "Offer & Onboarding", desc: "Successful candidates receive a formal offer letter and undergo a 3-day orientation at Aquafarm." },
];

export function Careers() {
  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);
  const [applied, setApplied] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");

  const departments = ["All", ...Array.from(new Set(jobs.map(j => j.dept)))];

  const filtered = jobs.filter(j =>
    (filterDept === "All" || j.dept === filterDept) &&
    (j.title.toLowerCase().includes(search.toLowerCase()) || j.dept.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-900 to-teal-700 py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Briefcase size={40} className="text-amber-400 mx-auto mb-3" />
          <h1 className="mt-0 mb-3" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700 }}>
            Join Our Team
          </h1>
          <p className="text-teal-200 text-lg max-w-xl mx-auto mb-6">
            Build a rewarding career at Kenya's leading fish farm. We're looking for passionate, skilled professionals to grow with us.
          </p>
          <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {[
              { val: `${jobs.length}+`, label: "Open Positions" },
              { val: "30+", label: "Team Members" },
              { val: "100%", label: "Local Employment" },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 border border-white/20 rounded-xl p-3 text-center">
                <p className="text-amber-300 font-bold text-xl">{s.val}</p>
                <p className="text-teal-300 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-gray-900" style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", fontWeight: 700 }}>
              How to Apply
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {howToApply.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 bg-teal-700 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  {step.step}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{step.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                {i < howToApply.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-5 text-gray-300">
                    <ArrowRight size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 bg-teal-50 border border-teal-200 rounded-2xl p-4 text-center max-w-2xl mx-auto">
            <p className="text-teal-700 text-sm">
              <strong>Email your application to:</strong> careers@aquafarmfisheries.co.ke<br />
              <strong>WhatsApp inquiries:</strong> +254 700 000 000 | <strong>Deadline noted on each position</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search positions..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 transition-colors" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {departments.map(dept => (
                <button key={dept} onClick={() => setFilterDept(dept)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    filterDept === dept ? "bg-teal-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}>
                  {dept}
                </button>
              ))}
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-6">{filtered.length} position{filtered.length !== 1 ? "s" : ""} available</p>
          <div className="space-y-4">
            {filtered.map(job => (
              <div key={job.id} className={`border rounded-2xl p-6 hover:shadow-lg transition-all bg-white ${job.color}`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-white text-xs font-bold px-2 py-0.5 rounded-full ${job.badgeColor}`}>{job.badge}</span>
                      <span className="bg-white text-gray-600 text-xs px-2 py-0.5 rounded-full border border-gray-200">{job.type}</span>
                      <span className="bg-white text-gray-600 text-xs px-2 py-0.5 rounded-full border border-gray-200">{job.level}</span>
                    </div>
                    <h2 className="text-gray-900 font-bold text-xl mb-1">{job.title}</h2>
                    <div className="flex flex-wrap gap-3 text-gray-500 text-xs mb-3">
                      <span className="flex items-center gap-1"><Briefcase size={11} /> {job.dept}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> Deadline: {job.deadline}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{job.desc}</p>
                    <p className="text-teal-700 font-semibold text-sm mt-2">{job.salary}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="bg-teal-700 hover:bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                    >
                      View & Apply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-start justify-between sticky top-0 bg-white rounded-t-3xl z-10">
              <div>
                <h2 className="text-gray-900 font-bold text-xl" style={{ fontFamily: "Playfair Display, serif" }}>{selectedJob.title}</h2>
                <p className="text-teal-700 text-sm">{selectedJob.dept} · {selectedJob.location}</p>
              </div>
              <button onClick={() => { setSelectedJob(null); setApplied(false); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {applied ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-white" />
                  </div>
                  <h3 className="text-gray-900 font-bold text-xl mb-2">Application Submitted!</h3>
                  <p className="text-gray-600 text-sm">Thank you for applying. We'll review your application and contact you within 2 weeks if shortlisted.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-xl p-3"><p className="text-gray-500 text-xs">Salary</p><p className="font-semibold text-gray-900">{selectedJob.salary}</p></div>
                    <div className="bg-gray-50 rounded-xl p-3"><p className="text-gray-500 text-xs">Type</p><p className="font-semibold text-gray-900">{selectedJob.type}</p></div>
                    <div className="bg-gray-50 rounded-xl p-3"><p className="text-gray-500 text-xs">Level</p><p className="font-semibold text-gray-900">{selectedJob.level}</p></div>
                    <div className="bg-gray-50 rounded-xl p-3"><p className="text-gray-500 text-xs">Deadline</p><p className="font-semibold text-red-600">{selectedJob.deadline}</p></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">About the Role</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{selectedJob.desc}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Requirements</h4>
                    <ul className="space-y-1">{selectedJob.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle size={13} className="text-teal-600 flex-shrink-0 mt-0.5" />{r}</li>
                    ))}</ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Key Responsibilities</h4>
                    <ul className="space-y-1">{selectedJob.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700"><ArrowRight size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />{r}</li>
                    ))}</ul>
                  </div>
                  <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
                    <h4 className="font-bold text-teal-800 mb-2">How to Apply</h4>
                    <p className="text-teal-700 text-sm">Send your CV, cover letter, and certificates to <strong>careers@aquafarmfisheries.co.ke</strong> with subject: <em>"{selectedJob.title} Application"</em></p>
                    <p className="text-teal-600 text-xs mt-2">Or WhatsApp: +254 700 000 000</p>
                  </div>
                  <button
                    onClick={() => setApplied(true)}
                    className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-bold py-3.5 rounded-xl transition-colors"
                  >
                    <Upload size={16} /> Submit Interest / Application
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
