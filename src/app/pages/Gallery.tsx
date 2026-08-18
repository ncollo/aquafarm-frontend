import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { X, Camera, ZoomIn } from "lucide-react";

const galleries = [
  {
    id: "farm",
    label: "The Farm",
    images: [
      { src: "https://images.unsplash.com/photo-1738508041350-03453c14811c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMHBvbmQlMjBhZXJpYWwlMjBLZW55YXxlbnwxfHx8fDE3NzQ1NDQzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080", caption: "Aerial view of our fish ponds" },
      { src: "https://images.unsplash.com/photo-1758854486625-2ef3d73853fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhcG9uaWNzJTIwd2F0ZXIlMjB0ZWNobm9sb2d5JTIwZmlzaCUyMHRhbmt8ZW58MXx8fHwxNzc0NTQ0Mzg0fDA&ixlib=rb-4.1.0&q=80&w=1080", caption: "RAS technology tanks" },
      { src: "https://images.unsplash.com/photo-1607629194620-a9726803827c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMGhhcnZlc3QlMjBmcmVzaCUyMGZpc2glMjB3b3JrZXJzfGVufDF8fHx8MTc3NDU0NDM4MXww&ixlib=rb-4.1.0&q=80&w=1080", caption: "Harvest day at Aquafarm" },
      { src: "https://images.unsplash.com/photo-1609101419675-60842b69628d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhY3VsdHVyZSUyMGZpc2glMjBwb25kJTIwdGVjaG5vbG9neSUyMGFlcmF0aW9ufGVufDF8fHx8MTc3NDc3ODc3NHww&ixlib=rb-4.1.0&q=80&w=1080", caption: "Modern aeration technology" },
      { src: "https://images.unsplash.com/photo-1735295442948-83f09f4afac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwcG9uZCUyMGFlcmlhbCUyMGRyb25lJTIwdmlldyUyMEFmcmljYXxlbnwxfHx8fDE3NzQ3Nzg3ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080", caption: "Drone view of Aquafarm ponds" },
      { src: "https://images.unsplash.com/photo-1751568928581-874900ec53f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMHdvcmtlcnMlMjBoYXJ2ZXN0aW5nJTIwbmV0cyUyMEtlbnlhfGVufDF8fHx8MTc3NDc3ODc3NHww&ixlib=rb-4.1.0&q=80&w=1080", caption: "Team harvesting with nets" },
    ],
  },
  {
    id: "fish",
    label: "Our Fish",
    images: [
      { src: "https://images.unsplash.com/photo-1649347173558-a305d7b8ff98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxhcGlhJTIwZmlzaCUyMHdhdGVyJTIwYXF1YWN1bHR1cmV8ZW58MXx8fHwxNzc0NTQ0MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080", caption: "Nile Tilapia in our grow-out ponds" },
      { src: "https://images.unsplash.com/photo-1770529882297-d60092c0c834?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaHdhdGVyJTIwZmlzaCUyMGNhcnAlMjBwb25kJTIwc3VyZmFjZXxlbnwxfHx8fDE3NzQ1NDQzODR8MA&ixlib=rb-4.1.0&q=80&w=1080", caption: "Freshwater fish pond surface" },
      { src: "https://images.unsplash.com/photo-1756364897965-6e294ceff269?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtJTIwZnJlc2glMjB0aWxhcGlhJTIwZmlzaCUyMHdhdGVyJTIwY2xvc2UlMjB1cHxlbnwxfHx8fDE3NzQ3Nzg3ODB8MA&ixlib=rb-4.1.0&q=80&w=1080", caption: "Tilapia close-up" },
      { src: "https://images.unsplash.com/photo-1623745494461-c5afa6f6e507?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGZpc2glMjBmYXJtaW5nJTIwS2VueWElMjBBZnJpY2F8ZW58MXx8fHwxNzc0Nzc4Nzc1fDA&ixlib=rb-4.1.0&q=80&w=1080", caption: "Sustainable fish rearing" },
      { src: "https://images.unsplash.com/photo-1771825259273-c57d2f0b6030?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwc3RvcmUlMjByZXRhaWwlMjBmcmVzaCUyMGZpc2glMjBkaXNwbGF5fGVufDF8fHx8MTc3NDc3ODc3N3ww&ixlib=rb-4.1.0&q=80&w=1080", caption: "Fresh fish ready for sale" },
    ],
  },
  {
    id: "fishing",
    label: "Sport Fishing",
    images: [
      { src: "https://images.unsplash.com/photo-1738599235555-03ac5f290b75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMGZpc2hpbmclMjBsYWtlJTIwcm9kJTIwY2F0Y2h8ZW58MXx8fHwxNzc0NTQ0MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080", caption: "Sport fishing at our recreational ponds" },
      { src: "https://images.unsplash.com/photo-1771533679900-568efb11569b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwdHJhaW5pbmclMjBpbnN0cnVjdG9yJTIwYm9hdCUyMGxlc3NvbnxlbnwxfHx8fDE3NzQ1NDQzODF8MA&ixlib=rb-4.1.0&q=80&w=1080", caption: "Training session on the water" },
      { src: "https://images.unsplash.com/photo-1695035711091-0658605fe1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwZXF1aXBtZW50JTIwc3RvcmUlMjB0YWNrbGUlMjByb2RzfGVufDF8fHx8MTc3NDU0NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080", caption: "Our well-stocked equipment store" },
      { src: "https://images.unsplash.com/photo-1763047302840-17f4131fa3a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMGZpc2hpbmclMjBsYWtlJTIwcm9kJTIwY2F0Y2glMjBmcmVzaHdhdGVyfGVufDF8fHx8MTc3NDc3ODc3N3ww&ixlib=rb-4.1.0&q=80&w=1080", caption: "Perfect catch at Aquafarm pond" },
      { src: "https://images.unsplash.com/photo-1755326701682-64bb0644c36c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwdHJhaW5pbmclMjBvdXRkb29yJTIwbGVzc29uJTIwaW5zdHJ1Y3RvcnxlbnwxfHx8fDE3NzQ3Nzg3NzV8MA&ixlib=rb-4.1.0&q=80&w=1080", caption: "Outdoor fishing lesson" },
    ],
  },
  {
    id: "community",
    label: "Community",
    images: [
      { src: "https://images.unsplash.com/photo-1768248559223-cc4ef20363fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwY29tbXVuaXR5JTIwbWFya2V0JTIwZnJlc2glMjBmaXNofGVufDF8fHx8MTc3NDU0NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080", caption: "Community farm market day" },
      { src: "https://images.unsplash.com/photo-1681705357021-d5434018247b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBjaGlsZHJlbiUyMGZhcm0lMjBlZHVjYXRpb25hbCUyMHZpc2l0fGVufDF8fHx8MTc3NDU0NDM3N3ww&ixlib=rb-4.1.0&q=80&w=1080", caption: "School visit to Aquafarm" },
      { src: "https://images.unsplash.com/photo-1567471945805-069e09c11098?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwZmFybWVycyUyMGNvb3BlcmF0aXZlJTIwZ3JvdXAlMjBtZWV0aW5nfGVufDF8fHx8MTc3NDc3ODc4MXww&ixlib=rb-4.1.0&q=80&w=1080", caption: "Farmers cooperative meeting" },
      { src: "https://images.unsplash.com/photo-1518707332890-e05af3c6bfff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhY3VsdHVyZSUyMHNjaG9vbCUyMHN0dWRlbnRzJTIwZWR1Y2F0aW9uYWwlMjB0b3VyJTIwcG9uZHxlbnwxfHx8fDE3NzQ3Nzg3ODF8MA&ixlib=rb-4.1.0&q=80&w=1080", caption: "Students learning aquaculture" },
    ],
  },
];

export function Gallery() {
  const [activeTab, setActiveTab] = useState("farm");
  const [lightbox, setLightbox] = useState<{ src: string; caption: string } | null>(null);

  const tabs = [{ id: "all", label: "All Photos" }, ...galleries.map((g) => ({ id: g.id, label: g.label }))];
  const allImages = galleries.flatMap((g) => g.images.map((img) => ({ ...img, category: g.label })));
  const current = activeTab === "all" ? allImages : galleries.find((g) => g.id === activeTab)?.images ?? [];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-900 to-teal-700 py-16 text-white text-center">
        <Camera size={40} className="text-amber-400 mx-auto mb-3" />
        <h1 className="mt-0 mb-2" style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700 }}>
          Photo Gallery
        </h1>
        <p className="text-teal-200 max-w-xl mx-auto">
          Take a visual tour of Aquafarm Fisheries — our ponds, fish, events, and community moments.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-5 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-teal-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {current.map((img, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-sm hover:shadow-xl transition-all"
              onClick={() => setLightbox(img)}
            >
              <ImageWithFallback
                src={img.src}
                alt={img.caption}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-white text-sm">{img.caption}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <Camera size={18} className="inline-block mr-2 text-gray-400" />
          Follow us on Instagram <strong>@aquafarmfisheries</strong> for more behind-the-scenes photos and videos.
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors" onClick={() => setLightbox(null)}>
            <X size={22} />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <ImageWithFallback
              src={lightbox.src}
              alt={lightbox.caption}
              className="w-full rounded-2xl shadow-2xl max-h-[80vh] object-contain"
            />
            <p className="text-white text-center mt-3">{lightbox.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}