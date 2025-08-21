import React from "react";
import { GuestCardFinder } from "@/components/guest-card-finder";

export default function LandingPage() {
  // Slideshow data
  const uspSlides = [
    {
      title: "Personalized Recommendations",
      description: "Get instant, AI-powered card suggestions tailored to your favorite stores and spending habits.",
      image: "/src/assets/usp-personalized.png",
    },
    {
      title: "Maximize Your Rewards",
      description: "Never miss out on cash back, points, or bonuses. CashReap finds the best card for every purchase.",
      image: "/src/assets/usp-maximize.png",
    },
    {
      title: "Privacy-First & Local",
      description: "No signup required. Your data stays on your device, always private and secure.",
      image: "/src/assets/usp-privacy.png",
    },
    {
      title: "Comprehensive Coverage",
      description: "Covers thousands of US businesses—retail, dining, online, and more.",
      image: "/src/assets/usp-coverage.png",
    },
    {
      title: "Advanced Insights",
      description: "Track your rewards, forecast earnings, and discover new ways to save.",
      image: "/src/assets/usp-insights.png",
    },
    {
      title: "Better Than Others",
      description: "Unlike generic cashback tools, CashReap is tailored, privacy-first, and always up-to-date.",
      image: "/src/assets/usp-better.png",
    },
  ];

  const [slideIndex, setSlideIndex] = React.useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % uspSlides.length);
    }, 6000); // Slower interval: 6 seconds
    return () => clearInterval(timer);
  }, [uspSlides.length]);
  return (
    <main className="min-h-screen flex flex-col items-center justify-start relative" style={{ background: 'linear-gradient(135deg, #fffbe6 0%, #f0f9e8 50%, #e0f7fa 100%)' }}>
      {/* Decorative credit card shapes for brand background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute left-10 top-24 w-80 h-48 rounded-2xl bg-gradient-to-tr from-yellow-300 via-yellow-100 to-white shadow-xl rotate-[-8deg] opacity-40"></div>
        <div className="absolute right-10 top-56 w-72 h-40 rounded-2xl bg-gradient-to-tr from-green-300 via-green-100 to-white shadow-xl rotate-[12deg] opacity-30"></div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-24 w-96 h-56 rounded-2xl bg-gradient-to-tr from-blue-300 via-blue-100 to-white shadow-xl rotate-[-4deg] opacity-25"></div>
        {/* Credit card illustrations */}
        <img src="/src/assets/favicon.png" alt="Credit Card" className="absolute left-24 top-10 w-24 h-24 opacity-20" />
        <img src="/src/assets/favicon.png" alt="Credit Card" className="absolute right-24 bottom-10 w-32 h-32 opacity-15" />
      </div>
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
        {/* Brand Logo above heading */}
        <img src="/src/assets/favicon.png" alt="CashReap Logo" className="w-24 h-24 mb-2" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-4 drop-shadow-lg flex flex-wrap justify-center items-center gap-2" style={{ fontFamily: 'Montserrat, Poppins, sans-serif' }}>
          <span className="text-yellow-500">Cash</span>
          <span className="text-green-600">Reap</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground text-center mb-8 max-w-2xl" style={{ fontFamily: 'Montserrat, Poppins, sans-serif' }}>
          The intelligent rewards assistant that helps you earn more, effortlessly.<br />
          Find the best credit card for every purchase, maximize your cash back, and unlock exclusive offers—all in one place.
        </p>
  {/* Removed Why CashReap and How It Works sections for cleaner layout. */}
        <div className="flex flex-row items-center gap-6">
          <button
            className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
            onClick={() => window.location.href = '/signup'}
          >
            Sign Up
          </button>
          <button
            className="inline-block px-8 py-3 bg-gray-100 text-primary font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
            onClick={() => window.location.href = '/signin'}
          >
            Sign In
          </button>
        </div>
        <span className="text-xs text-muted-foreground mt-2">No email or signup required</span>
      </section>
      {/* Search Bar Section */}
  <section id="search-section" className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full rounded-2xl shadow-lg bg-gradient-to-br from-yellow-50 to-white/80 border border-yellow-100 p-8">
          {/* ...existing code... */}
          {/* Import and use GuestCardFinder */}
          {/* You may need to import GuestCardFinder at the top if not already imported */}
          <GuestCardFinder onSignUpClick={() => window.location.href = '/signup'} />
        </div>
      </section>
      {/* USP Slideshow Section */}
      <section className="w-full flex justify-center items-center py-10">
        <div className="w-full max-w-2xl rounded-2xl shadow-xl bg-gradient-to-br from-primary/10 to-white/80 border border-primary/20 p-8 flex flex-col items-center" style={{ minHeight: '320px' }}>
          <h3 className="text-2xl md:text-3xl font-extrabold text-black mb-2 drop-shadow-xl animate-fade-in text-center">
            {uspSlides[slideIndex].title}
          </h3>
          <p className="text-md md:text-lg font-bold text-black text-center animate-fade-in-slow px-2 max-w-xl mb-4">
            {uspSlides[slideIndex].description}
          </p>
          <div className="w-full flex justify-center items-center mb-2">
            <img
              src={uspSlides[slideIndex].image}
              alt={uspSlides[slideIndex].title}
              className="w-full h-56 md:h-64 object-cover rounded-xl animate-fade-in"
              style={{ maxWidth: '100%', minHeight: '224px' }}
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <div className="flex gap-2 mt-4 justify-center">
            {uspSlides.map((_, idx) => (
              <span
                key={idx}
                className={`w-3 h-3 rounded-full border border-black ${idx === slideIndex ? 'bg-primary' : 'bg-primary/30'} transition-all duration-300`}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}