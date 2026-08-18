import { Outlet, useLocation } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { ScrollToTop } from "./ScrollToTop";
import { useTheme } from "../../context/ThemeContext";

export function RootLayout() {
  const location = useLocation();
  const { isDark } = useTheme();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${isDark ? "bg-gray-950" : "bg-white"
        }`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <ScrollToTop />
      <Navbar />
      <main className={`flex-1 ${isDashboard ? "" : "pt-[98px]"}`}>
        <Outlet />
      </main>
      {!isDashboard && <Footer />}
      <WhatsAppButton />
    </div>
  );
}
