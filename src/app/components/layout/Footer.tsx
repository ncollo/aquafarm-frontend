import { useState } from "react";
import { Link } from "react-router";
import { useLanguage } from "../../context/LanguageContext";
import {
  Fish,
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Camera,
  Play,
  ArrowRight,
  Clock,
  Leaf,
} from "lucide-react";

export function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Our Farm", path: "/our-farm" },
    { label: "Fish Store", path: "/store" },
    { label: "Sport Fishing", path: "/sport-fishing" },
    { label: "Schedule Visit", path: "/schedule-visit" },
    { label: "Training", path: "/training" },
    { label: "Community", path: "/community" },
    { label: "Blog & News", path: "/blog" },
    { label: "Gallery", path: "/gallery" },
    { label: "Careers", path: "/careers" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <footer className="bg-teal-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-teal-700 p-2 rounded-xl">
                <Fish size={22} className="text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-xl leading-none" style={{ fontFamily: "Playfair Display, serif" }}>
                  Aquafarm
                </div>
                <div className="text-amber-400 text-xs font-semibold tracking-widest uppercase">
                  Fisheries
                </div>
              </div>
            </div>
            <p className="text-teal-200 text-sm leading-relaxed mb-4">
              {t("footerTagline")}. Kenya's premier sustainable fish farm
              dedicated to quality, community, and conservation.
            </p>
            <div className="flex items-center gap-1 mb-2">
              <Leaf size={13} className="text-green-400" />
              <span className="text-green-300 text-xs font-medium">
                Certified Sustainable Aquaculture
              </span>
            </div>
            <div className="flex gap-3 mt-4">
              {[
                { Icon: Globe, href: "#" },
                { Icon: MessageCircle, href: "#" },
                { Icon: Camera, href: "#" },
                { Icon: Play, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="bg-teal-800 hover:bg-teal-700 p-2 rounded-lg transition-colors"
                >
                  <Icon size={16} className="text-teal-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 pb-2 border-b border-teal-700">
              {t("quickLinks")}
            </h3>
            <div className="grid grid-cols-2 gap-x-2 gap-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-teal-300 hover:text-amber-400 text-sm flex items-center gap-1 transition-colors"
                >
                  <ArrowRight size={11} />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 pb-2 border-b border-teal-700">
              {t("contactUs")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-teal-200 text-sm">
                  Aquafarm Fisheries Complex<br />
                  Naivasha Road, Nakuru<br />
                  Kenya, East Africa
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-amber-400 flex-shrink-0" />
                <div className="text-teal-200 text-sm">
                  <div>+254 700 000 000</div>
                  <div>+254 722 000 000</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-amber-400 flex-shrink-0" />
                <div className="text-teal-200 text-sm">
                  <div>info@aquafarmfisheries.co.ke</div>
                  <div>sales@aquafarmfisheries.co.ke</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-teal-200 text-sm">
                  <div>Mon – Sat: 7:00 AM – 6:00 PM</div>
                  <div>Sunday: 8:00 AM – 4:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 pb-2 border-b border-teal-700">
              {t("newsletter")}
            </h3>
            <p className="text-teal-200 text-sm mb-4">{t("newsletterText")}</p>
            {subscribed ? (
              <div className="bg-green-800 border border-green-600 rounded-xl p-3 text-green-200 text-sm text-center">
                ✓ Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-teal-800 border border-teal-700 text-white placeholder-teal-400 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {t("subscribe")}
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
            {/* WhatsApp Community */}
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl transition-colors text-sm font-medium w-full justify-center"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Join Our WhatsApp Community
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-teal-800 bg-teal-950">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-teal-400">
          <p>© {new Date().getFullYear()} Aquafarm Fisheries. {t("allRightsReserved")}.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
