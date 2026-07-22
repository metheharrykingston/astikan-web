// All site config lives here — static frontend, no Node/Python/.env needed.
// Firebase + Supabase anon keys are public by design (safe in browser).
// Firebase Auth → Authorized domains must include EVERY hostname users open:
// astikan.com, www.astikan.com, localhost (project: astikan-healthcare-83920)
window.ASTIKAN_CONFIG = {
  publicSiteUrl: "https://www.astikan.com",
  firebase: {
    apiKey: "AIzaSyBEHyexeIVX5rpUT3GielsSD1eLa36J8zI",
    authDomain: "astikan-healthcare-83920.firebaseapp.com",
    projectId: "astikan-healthcare-83920",
    storageBucket: "astikan-healthcare-83920.firebasestorage.app",
    messagingSenderId: "201357365434",
    appId: "1:201357365434:web:0eb680382f552164eaf283",
    measurementId: "G-04LDF0H3GY"
  },
  supabase: {
    url: "https://zixslzbfeackdupqwdnf.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeHNsemJmZWFja2R1cHF3ZG5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4OTM3MDEsImV4cCI6MjA5ODQ2OTcwMX0.q6CnQLohk6gWIY7k514zTRQOJdZWIp_sUvrW004QsoM"
  },
  // Payment amounts only (Cashfree checkout) — change back to 8499 / 11499 / 24499 for production
  planPrices: {
    "silver plan": 2,
    "gold plan": 5,
    "platinum plan": 7
  },
  planBenefits: {
    "silver plan": {
      tier: "silver",
      tagline: "Small recharge, big protection",
      crown: "silver",
      price: 8499,
      benefits: [
        "1,00,000 Pts Wallet Topup",
        "Rupay HealthPocket Card",
        "Free Full Body Lab Test: 2",
        "Free OPD Consultation: 2 (upto ₹500)",
        "Teleconsultation: Unlimited",
        "IPD Coverage: ₹50,000",
        "Daily Cash Coverage: ₹30,000",
        "Wellness Vouchers: ₹50,000",
        "Accidental Coverage: ₹2,00,000",
        "Medical Credit Limit: ₹10,00,000",
        "Panel Discounts: Up to 40%"
      ],
      services: [
        { id: "lab-test", title: "Book Lab Test", desc: "Use your 2 free full body lab tests", icon: "bi-eyedropper", href: "lab-test.html", claim: false },
        { id: "opd", title: "OPD Consultation", desc: "2 free OPD visits upto ₹500", icon: "bi-hospital", href: "find-doctors.html", claim: false },
        { id: "tele", title: "Teleconsultation", desc: "Unlimited video consultations", icon: "bi-camera-video", href: "video-consultation.html", claim: false },
        { id: "medicine", title: "Medicine Delivery", desc: "Order medicines with member discounts", icon: "bi-capsule", href: "medicine-delivery.html", claim: false },
        { id: "healthpocket", title: "HealthPocket Card", desc: "Request your Rupay HealthPocket card activation", icon: "bi-credit-card-2-front", href: "healthpocket", claim: false },
        { id: "finance", title: "Medical Finance", desc: "₹10L medical credit limit support", icon: "bi-cash-stack", href: "medical-finance.html", claim: false },
        { id: "insurance", title: "Insurance Assistance", desc: "Policy & TPA coordination help", icon: "bi-shield-check", href: "insurance-assistance.html", claim: true },
        { id: "accident", title: "Accidental Claim", desc: "File accidental coverage claim", icon: "bi-bandaid", href: "grevience-portal.html", claim: true },
        { id: "ipd", title: "IPD Claim", desc: "Hospitalization claim upto ₹50,000", icon: "bi-clipboard2-pulse", href: "grevience-portal.html", claim: true },
        { id: "ambulance", title: "Ambulance", desc: "24×7 emergency ambulance support", icon: "bi-truck", href: "ambulance-emergency.html", claim: false }
      ]
    },
    "gold plan": {
      tier: "gold",
      tagline: "Big recharge for serious problems",
      crown: "gold",
      price: 11499,
      benefits: [
        "2,00,000 Pts Wallet Topup",
        "Rupay HealthPocket Card",
        "Free Full Body Lab Test: 4",
        "Free OPD Consultation: 10 visits",
        "Teleconsultation: Unlimited",
        "IPD Coverage: ₹1,00,000",
        "Daily Cash Coverage: ₹45,000",
        "Wellness Vouchers: ₹50,000",
        "Accidental Coverage: ₹3,00,000",
        "Medical Credit Limit: ₹10,00,000",
        "Panel Discounts: Up to 60%"
      ],
      services: [
        { id: "lab-test", title: "Book Lab Test", desc: "Use your 4 free full body lab tests", icon: "bi-eyedropper", href: "lab-test.html", claim: false },
        { id: "opd", title: "OPD Consultation", desc: "10 free OPD consultation visits", icon: "bi-hospital", href: "find-doctors.html", claim: false },
        { id: "tele", title: "Teleconsultation", desc: "Unlimited video consultations", icon: "bi-camera-video", href: "video-consultation.html", claim: false },
        { id: "medicine", title: "Medicine Delivery", desc: "Order medicines with up to 60% discount", icon: "bi-capsule", href: "medicine-delivery.html", claim: false },
        { id: "healthpocket", title: "HealthPocket Card", desc: "Request your Rupay HealthPocket card activation", icon: "bi-credit-card-2-front", href: "healthpocket", claim: false },
        { id: "finance", title: "Medical Finance", desc: "₹10L medical credit limit support", icon: "bi-cash-stack", href: "medical-finance.html", claim: false },
        { id: "insurance", title: "Insurance Assistance", desc: "Policy & TPA coordination help", icon: "bi-shield-check", href: "insurance-assistance.html", claim: true },
        { id: "accident", title: "Accidental Claim", desc: "File accidental coverage claim", icon: "bi-bandaid", href: "grevience-portal.html", claim: true },
        { id: "ipd", title: "IPD Claim", desc: "Hospitalization claim upto ₹1,00,000", icon: "bi-clipboard2-pulse", href: "grevience-portal.html", claim: true },
        { id: "ambulance", title: "Ambulance", desc: "24×7 emergency ambulance support", icon: "bi-truck", href: "ambulance-emergency.html", claim: false }
      ]
    },
    "platinum plan": {
      tier: "platinum",
      tagline: "Complete care package",
      crown: "platinum",
      price: 24499,
      benefits: [
        "3,00,000 Pts Wallet Topup",
        "Rupay HealthPocket Card",
        "Free Full Body Lab Test: 6",
        "Free OPD Consultation: 6 (upto ₹500)",
        "Teleconsultation: Unlimited",
        "IPD Coverage: ₹3,00,000",
        "Daily Cash Coverage: ₹60,000",
        "Wellness Vouchers: ₹50,000",
        "Accidental Coverage: ₹5,00,000",
        "Medical Credit Limit: ₹10,00,000",
        "Panel Discounts: Up to 70%"
      ],
      services: [
        { id: "lab-test", title: "Book Lab Test", desc: "Use your 6 free full body lab tests", icon: "bi-eyedropper", href: "lab-test.html", claim: false },
        { id: "opd", title: "OPD Consultation", desc: "6 free OPD visits upto ₹500", icon: "bi-hospital", href: "find-doctors.html", claim: false },
        { id: "tele", title: "Teleconsultation", desc: "Unlimited video consultations", icon: "bi-camera-video", href: "video-consultation.html", claim: false },
        { id: "medicine", title: "Medicine Delivery", desc: "Order medicines with up to 70% discount", icon: "bi-capsule", href: "medicine-delivery.html", claim: false },
        { id: "healthpocket", title: "HealthPocket Card", desc: "Request your Rupay HealthPocket card activation", icon: "bi-credit-card-2-front", href: "healthpocket", claim: false },
        { id: "finance", title: "Medical Finance", desc: "₹10L medical credit limit support", icon: "bi-cash-stack", href: "medical-finance.html", claim: false },
        { id: "insurance", title: "Insurance Assistance", desc: "Policy & TPA coordination help", icon: "bi-shield-check", href: "insurance-assistance.html", claim: true },
        { id: "accident", title: "Accidental Claim", desc: "File accidental coverage claim", icon: "bi-bandaid", href: "grevience-portal.html", claim: true },
        { id: "ipd", title: "IPD Claim", desc: "Hospitalization claim upto ₹3,00,000", icon: "bi-clipboard2-pulse", href: "grevience-portal.html", claim: true },
        { id: "ambulance", title: "Ambulance", desc: "24×7 emergency ambulance support", icon: "bi-truck", href: "ambulance-emergency.html", claim: false }
      ]
    }
  }
};