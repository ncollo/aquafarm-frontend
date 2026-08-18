import React, { createContext, useContext, useState } from "react";

type Language = "en" | "sw";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    home: "Home",
    about: "About Us",
    ourFarm: "Our Farm",
    store: "Fish Store",
    sportFishing: "Sport Fishing",
    scheduleVisit: "Schedule a Visit",
    training: "Training",
    community: "Community",
    blog: "Blog & News",
    gallery: "Gallery",
    careers: "Careers",
    contact: "Contact",
    dashboard: "Dashboard",
    // Hero
    heroTitle: "Welcome to Aquafarm Fisheries",
    heroSubtitle: "Kenya's Premier Sustainable Fish Farm — Fresh, Healthy, Community-Driven",
    heroBtn1: "Explore Our Farm",
    heroBtn2: "Schedule a Visit",
    // Stats
    stat1: "Tonnes Harvested/Year",
    stat2: "Fish Species",
    stat3: "Community Partners",
    stat4: "Years of Excellence",
    // Sections
    learnMore: "Learn More",
    getStarted: "Get Started",
    bookNow: "Book Now",
    shopNow: "Shop Now",
    applyNow: "Apply Now",
    submitRequest: "Submit Request",
    // Common
    name: "Name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    send: "Send Message",
    close: "Close",
    viewAll: "View All",
    readMore: "Read More",
    // Footer
    footerTagline: "Farming the Future, Feeding the Nation",
    quickLinks: "Quick Links",
    contactUs: "Contact Us",
    followUs: "Follow Us",
    newsletter: "Newsletter",
    newsletterText: "Subscribe for updates on fish availability, events & news.",
    subscribe: "Subscribe",
    allRightsReserved: "All Rights Reserved",
  },
  sw: {
    // Nav
    home: "Nyumbani",
    about: "Kuhusu Sisi",
    ourFarm: "Shamba Letu",
    store: "Duka la Samaki",
    sportFishing: "Uvuvi wa Burudani",
    scheduleVisit: "Panga Ziara",
    training: "Mafunzo",
    community: "Jamii",
    blog: "Blogu & Habari",
    gallery: "Picha",
    careers: "Kazi",
    contact: "Wasiliana",
    dashboard: "Dashibodi",
    // Hero
    heroTitle: "Karibu Aquafarm Fisheries",
    heroSubtitle: "Shamba Bora la Samaki nchini Kenya — Safi, Bora, Inayosaidia Jamii",
    heroBtn1: "Chunguza Shamba Letu",
    heroBtn2: "Panga Ziara",
    // Stats
    stat1: "Tani Zinazovunwa/Mwaka",
    stat2: "Aina za Samaki",
    stat3: "Washirika wa Jamii",
    stat4: "Miaka ya Ubora",
    // Sections
    learnMore: "Jifunza Zaidi",
    getStarted: "Anza Sasa",
    bookNow: "Hifadhi Sasa",
    shopNow: "Nunua Sasa",
    applyNow: "Omba Sasa",
    submitRequest: "Tuma Ombi",
    // Common
    name: "Jina",
    email: "Barua Pepe",
    phone: "Simu",
    message: "Ujumbe",
    send: "Tuma Ujumbe",
    close: "Funga",
    viewAll: "Angalia Zote",
    readMore: "Soma Zaidi",
    // Footer
    footerTagline: "Kulima Baadaye, Kulisha Taifa",
    quickLinks: "Viungo vya Haraka",
    contactUs: "Wasiliana Nasi",
    followUs: "Tufuate",
    newsletter: "Jarida",
    newsletterText: "Jiandikishe kwa masasisho ya samaki, matukio na habari.",
    subscribe: "Jiandikishe",
    allRightsReserved: "Haki Zote Zimehifadhiwa",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
