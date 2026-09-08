import React from "react";
import {
  Brain,
  Play,
  LayoutDashboard,
  Sparkles,
  Users,
  Mic,
  WifiOff,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  Heart,
  ChevronRight,
  Puzzle,
  TrendingUp,
  Camera,
  Music
} from "lucide-react";

export const HomeHero = ({ onSelectRole, onOpenMemoryTest, t }) => {
  return (
    <section className="relative pt-6 pb-12 sm:pb-16 bg-[#F8FAFC] overflow-hidden" id="hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Triple Action Banners: Cognitive & Motor Assessment + Memory Art Gallery + Memory Lane & Brain Music */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-8 max-w-6xl">
          {/* 1. Take Memory Test Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-xs flex items-center justify-between gap-3 hover:border-blue-300 hover:shadow-sm transition group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#001A4C] group-hover:bg-[#002466] flex items-center justify-center text-white shrink-0 shadow-xs transition-colors">
                <Brain className="w-5 h-5 text-[#9DF3C4]" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] font-extrabold text-[#001A4C] tracking-wider uppercase block">
                  COGNITIVE ASSESSMENT
                </span>
                <h3 className="text-xs font-bold text-[#0F172A] truncate">
                  Memory & Agility Test
                </h3>
              </div>
            </div>
            <button
              type="button"
              id="home-take-memory-test-btn"
              onClick={() => onOpenMemoryTest && onOpenMemoryTest("voice_motor_test")}
              className="bg-[#001A4C] hover:bg-[#002466] text-white px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shrink-0 transition cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
            >
              <span>Test</span>
              <span>→</span>
            </button>
          </div>

          {/* 2. Memory Art Gallery Game Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-xs flex items-center justify-between gap-3 hover:border-blue-300 hover:shadow-sm transition group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#001A4C] group-hover:bg-[#002466] flex items-center justify-center text-white shrink-0 shadow-xs transition-colors">
                <Camera className="w-5 h-5 text-[#9DF3C4]" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] font-extrabold text-[#001A4C] tracking-wider uppercase block flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#001A4C]" />
                  ART GALLERY
                </span>
                <h3 className="text-xs font-bold text-[#0F172A] truncate">
                  Elder Memory Studio
                </h3>
              </div>
            </div>
            <button
              type="button"
              id="home-memory-gallery-btn"
              onClick={() => onOpenMemoryTest && onOpenMemoryTest("memory_gallery")}
              className="bg-[#001A4C] hover:bg-[#002466] text-white px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shrink-0 transition cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
            >
              <span>Gallery</span>
              <Sparkles className="w-3 h-3 text-[#9DF3C4]" />
            </button>
          </div>

          {/* 3. Memory Lane & Brain Music Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-xs flex items-center justify-between gap-3 hover:border-blue-300 hover:shadow-sm transition group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#001A4C] group-hover:bg-[#002466] flex items-center justify-center text-white shrink-0 shadow-xs transition-colors">
                <Music className="w-5 h-5 text-[#9DF3C4]" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] font-extrabold text-[#001A4C] tracking-wider uppercase block flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#001A4C]" />
                  NOSTALGIA & MUSIC
                </span>
                <h3 className="text-xs font-bold text-[#0F172A] truncate">
                  Memory Lane & Brain Music
                </h3>
              </div>
            </div>
            <button
              type="button"
              id="home-memory-lane-music-btn"
              onClick={() => onOpenMemoryTest && onOpenMemoryTest("nostalgia_recall_music")}
              className="bg-[#001A4C] hover:bg-[#002466] text-white px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shrink-0 transition cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
            >
              <span>Explore</span>
              <span>✨</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold tracking-tight text-[#001A4C] leading-[1.08]">
                {t?.hero?.t1 || "Your Elder's"}
                <br />
                <span className="text-[#3B82F6]">{t?.hero?.t2 || "AI Cognitive Companion"}</span>
              </h1>
            </div>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              {t?.hero?.desc ||
                "Smriti Saathi combines engaging activities, real-life memories, and cultural relevance to support better brain health and independence — while keeping families connected and doctors informed."}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                id="heroMainCta"
                onClick={() => onSelectRole && onSelectRole("patient")}
                className="btn-glow-blue px-8 py-4 sm:py-5 rounded-2xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black text-lg sm:text-xl flex items-center gap-3 transition shadow-xl cursor-pointer active:scale-95"
              >
                <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                </div>
                <span>{t?.hero?.cta1 || "Start Therapy"}</span>
              </button>

              <button
                onClick={() => onSelectRole && onSelectRole("family")}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#0F172A] font-bold text-base flex items-center gap-2.5 transition shadow-xs cursor-pointer active:scale-95"
              >
                <LayoutDashboard className="w-4 h-4 text-[#001A4C]" />
                <span>{t?.hero?.cta2 || "Caregiver Dashboard"}</span>
              </button>
            </div>

            {/* Trust Social Proof */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                  alt="Family Caregiver"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Elder Grandfather"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                  alt="Clinician"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="Family Member"
                />
              </div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium">
                <span className="font-extrabold text-[#001A4C]">2K+</span>{" "}
                {t?.hero?.trust || "Trusted by 2,000+ families & clinicians"}
              </div>
            </div>
          </div>

          {/* Right Hero Column: Cozy Elder Illustration with 3 Floating UI Cards */}
          <div className="lg:col-span-6 relative">
            <div 
              className="relative w-full max-w-lg mx-auto aspect-[4/3] rounded-3xl bg-gradient-to-b from-[#EFF6FF]/70 via-[#F8FAFC]/50 to-[#E2E8F0]/30 border border-slate-200/80 p-3 sm:p-5 flex items-center justify-center overflow-visible shadow-sm group"
            >
              
              {/* Main Landing Hero Image (Matching Elder with Tablet in Armchair) */}
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  id="heroCompanionImage"
                  src="/images/hero_elder_tablet.svg"
                  alt="Elder Companion with Tablet in Cozy Armchair"
                  className="w-full h-full max-h-[380px] object-contain select-none drop-shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "/images/hero_bento_elder.svg";
                  }}
                />
              </div>

              {/* 📊 Floating Card 1: Today's Progress (Top Left) */}
              <div className="absolute top-2 left-2 sm:-top-4 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-lg border border-slate-100 max-w-[200px] sm:max-w-[220px] transition transform hover:scale-105">
                <div className="text-[11px] sm:text-xs font-bold text-[#0F172A] mb-2">
                  Today's Progress
                </div>
                {/* Mini Line Chart SVG */}
                <div className="h-8 w-full mb-2">
                  <svg viewBox="0 0 160 35" className="w-full h-full overflow-visible">
                    <path
                      d="M 10 28 Q 45 18, 75 22 T 120 12 T 150 6"
                      fill="none"
                      stroke="#001A4C"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="10" cy="28" r="3" fill="#001A4C" />
                    <circle cx="50" cy="20" r="3" fill="#001A4C" />
                    <circle cx="75" cy="22" r="3" fill="#001A4C" />
                    <circle cx="115" cy="14" r="3" fill="#001A4C" />
                    <circle cx="150" cy="6" r="3.5" fill="#001A4C" stroke="#FFFFFF" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-left">
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold block">Score</span>
                    <span className="text-xs sm:text-sm font-black text-[#0F172A]">85%</span>
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold block">Streak</span>
                    <span className="text-xs sm:text-sm font-black text-[#0F172A]">7 Days</span>
                  </div>
                </div>
              </div>

              {/* 🎯 Floating Card 2: Daily Goal (Middle Left) */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-2 sm:-left-8 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-lg border border-slate-100 flex flex-col items-center text-center transition transform hover:scale-105">
                <span className="text-[11px] font-bold text-[#0F172A] mb-1.5">Daily Goal</span>
                <div className="relative w-12 h-12 flex items-center justify-center my-0.5">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#001A4C]"
                      strokeDasharray="80, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-black text-[#001A4C]">4/5</span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 mt-1">
                  Activities
                  <br />
                  Completed
                </span>
              </div>

              {/* 🧩 Floating Card 3: Current Activity (Bottom Left) */}
              <div className="absolute -bottom-4 left-2 sm:-bottom-6 sm:left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-slate-100 flex items-center gap-3 transition transform hover:scale-105 cursor-pointer max-w-[240px]">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#001A4C] flex items-center justify-center shrink-0">
                  <Puzzle className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">
                    Current Activity
                  </span>
                  <div className="text-xs font-bold text-[#0F172A] truncate">Memory Match</div>
                  <span className="text-[10px] text-slate-500 block truncate">Improve recall and focus</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

            </div>
          </div>

        </div>

        {/* 5 Feature Benefit Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mt-14 sm:mt-16 pt-6 border-t border-slate-200/80">
          
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#001A4C] flex items-center justify-center mb-3">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#0F172A] mb-1">
              AI-Powered Activities
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Adaptive games that adjust to ability and performance.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#0F172A] mb-1">
              Personalized for Them
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Activities built around memories, routines, preferences & culture.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Mic className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#0F172A] mb-1">
              Voice Companion
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Natural conversations in regional languages for better engagement.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <WifiOff className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#0F172A] mb-1">
              100% Offline
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Full therapy experience anytime, anywhere.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#0F172A] mb-1">
              Secure & Private
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your data is protected with industry-grade security.
            </p>
          </div>

        </div>

        {/* Bottom Trust Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 mt-8 pt-4 text-xs sm:text-sm font-semibold text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-700" />
            <span>Evidence-Based Activities</span>
          </div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-slate-700" />
            <span>Doctor & Clinician Recommended</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-slate-700" />
            <span>Proudly Made in India</span>
          </div>
        </div>

      </div>
    </section>
  );
};
