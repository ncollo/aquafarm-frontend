import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import {
  Fish,
  Menu,
  X,
  ChevronDown,
  Globe,
  LayoutDashboard,
  Home,
  Info,
  ShoppingBag,
  Users,
  Camera,
  Briefcase,
  Phone,
  Waves,
  BookOpen,
  CalendarCheck,
  GraduationCap,
  Leaf,
  Sun,
  Moon,
  LogOut,
  UserCircle,
} from "lucide-react";

const navItems = [
  { key: "home", path: "/", icon: Home },
  {
    key: "about",
    path: "/about",
    icon: Info,
    children: [
      { label: "Mission & Vision", path: "/about#mission" },
      { label: "Our History", path: "/about#history" },
      { label: "Our Team", path: "/about#team" },
    ],
  },
  { key: "ourFarm", path: "/our-farm", icon: Leaf },
  {
    key: "sportFishing",
    path: "/sport-fishing",
    icon: Waves,
    children: [
      { label: "Fishing as Sport", path: "/sport-fishing" },
      { label: "Training & Lessons", path: "/training" },
      { label: "Equipment Rental", path: "/sport-fishing#rental" },
    ],
  },
  { key: "store", path: "/store", icon: ShoppingBag },
  { key: "scheduleVisit", path: "/schedule-visit", icon: CalendarCheck },
  { key: "community", path: "/community", icon: Users },
  { key: "blog", path: "/blog", icon: BookOpen },
  { key: "gallery", path: "/gallery", icon: Camera },
  { key: "careers", path: "/careers", icon: Briefcase },
  { key: "contact", path: "/contact", icon: Phone },
];

export function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? "bg-gray-900 shadow-lg shadow-black/20 border-b border-gray-800"
            : "bg-white shadow-lg border-b border-teal-100"
          : isDark
          ? "bg-gray-900/95 backdrop-blur-md shadow-sm"
          : "bg-white/95 backdrop-blur-md shadow-sm"
      }`}
    >
      {/* Top Bar */}
      <div className={`${isDark ? "bg-teal-950" : "bg-teal-800"} text-white py-1.5 px-4 transition-colors`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone size={12} />
              <span>+254 700 000 000</span>
            </span>
            <span className="hidden sm:block">|</span>
            <span className="hidden sm:block">info@aquafarmfisheries.co.ke</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "sw" : "en")}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors text-xs"
            >
              <Globe size={12} />
              <span>{language === "en" ? "Swahili" : "English"}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors p-1 rounded-md"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
            </button>

            {/* Dashboard / User Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-600 text-white px-2.5 py-0.5 rounded-full transition-colors text-xs font-semibold"
                >
                  <div className="w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-teal-900 text-[9px] font-bold">
                    {user?.avatar.charAt(0)}
                  </div>
                  <span className="hidden sm:block">{user?.name.split(" ")[0]}</span>
                  <ChevronDown size={10} />
                </button>
                {userMenuOpen && (
                  <div className={`absolute right-0 top-full mt-2 w-52 rounded-xl shadow-xl border py-2 z-50 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                    <div className={`px-4 py-2 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                      <p className={`text-xs font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>{user?.name}</p>
                      <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium capitalize">{user?.role}</span>
                    </div>
                    <Link
                      to="/dashboard"
                      className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${isDark ? "text-gray-200 hover:bg-gray-700" : "text-gray-700 hover:bg-teal-50 hover:text-teal-700"}`}
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${isDark ? "text-red-400 hover:bg-gray-700" : "text-red-600 hover:bg-red-50"}`}
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-0.5 rounded-full transition-colors text-xs font-semibold"
              >
                <LayoutDashboard size={12} />
                <span>{t("dashboard")}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-teal-700 p-2 rounded-xl group-hover:bg-teal-600 transition-colors">
              <Fish size={22} className="text-white" />
            </div>
            <div>
              <div
                className={`font-bold text-lg leading-none transition-colors ${isDark ? "text-teal-300" : "text-teal-800"}`}
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Aquafarm
              </div>
              <div className="text-amber-600 text-xs font-semibold tracking-wider uppercase">
                Fisheries
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-0.5">
            {navItems.slice(0, 8).map((item) => (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.key)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "text-teal-700 bg-teal-50 dark:bg-teal-900/40 dark:text-teal-300"
                      : isDark
                      ? "text-gray-300 hover:text-teal-300 hover:bg-gray-800"
                      : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
                  }`}
                >
                  <span>{t(item.key)}</span>
                  {item.children && <ChevronDown size={13} className="opacity-60" />}
                </Link>
                {item.children && activeDropdown === item.key && (
                  <div className={`absolute top-full left-0 mt-1 w-48 rounded-xl shadow-xl border py-2 z-50 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`block px-4 py-2 text-sm transition-colors ${isDark ? "text-gray-200 hover:bg-gray-700 hover:text-teal-300" : "text-gray-700 hover:bg-teal-50 hover:text-teal-700"}`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center gap-1 ml-2">
              <Link
                to="/careers"
                className={`px-3 py-1.5 text-sm font-medium border rounded-lg hover:bg-teal-50 transition-colors ${isDark ? "text-teal-300 border-teal-700 hover:bg-teal-900/30" : "text-teal-700 border-teal-300"}`}
              >
                {t("careers")}
              </Link>
              <Link
                to="/contact"
                className="px-3 py-1.5 text-sm font-semibold text-white bg-teal-700 rounded-lg hover:bg-teal-600 transition-colors shadow-sm"
              >
                {t("contact")}
              </Link>
            </div>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`xl:hidden border-t shadow-lg max-h-[80vh] overflow-y-auto ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.key}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? isDark ? "bg-teal-900/40 text-teal-300" : "bg-teal-50 text-teal-700"
                        : isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={16} className="text-teal-600" />
                    <span>{t(item.key)}</span>
                  </Link>
                  {item.children && (
                    <div className="pl-10 space-y-1 mt-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`block px-4 py-2 text-sm rounded-lg transition-colors ${isDark ? "text-gray-400 hover:text-teal-300 hover:bg-gray-800" : "text-gray-600 hover:text-teal-700 hover:bg-teal-50"}`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className={`pt-3 border-t flex gap-2 ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-teal-700 text-white rounded-xl text-sm font-semibold hover:bg-teal-600 transition-colors"
                  >
                    <LayoutDashboard size={15} />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-red-100 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-200 transition-colors"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors"
                >
                  <LayoutDashboard size={15} />
                  {t("dashboard")}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
