import { Link } from "react-router";
import { Fish, Home, ArrowRight } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-teal-100 w-24 h-24 rounded-full flex items-center justify-center">
            <Fish size={48} className="text-teal-400" />
          </div>
        </div>
        <h1 className="text-gray-900 font-bold mb-2" style={{ fontFamily: "Playfair Display, serif", fontSize: "5rem", lineHeight: 1 }}>
          404
        </h1>
        <h2 className="text-gray-700 font-semibold text-2xl mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like this fish got away! The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            <Home size={15} /> Back to Home
          </Link>
          <Link to="/contact" className="flex items-center gap-2 border border-teal-300 text-teal-700 hover:bg-teal-50 font-semibold px-6 py-3 rounded-xl transition-colors">
            Contact Us <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
