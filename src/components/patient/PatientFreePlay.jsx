import { useState } from "react";
import { allUnifiedGames, coreCategoriesInfo } from "../../data/unifiedGamesData";
import { translations } from "../../data/translations";
import { IconHelper } from "../common/IconHelper";
import { ArrowLeft, Clock, Play, Gamepad2, Search, ShieldCheck } from "lucide-react";
export const PatientFreePlay = ({
  profile,
  onStartGame,
  onBack
}) => {
  const t = translations[profile.language];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const filtered = allUnifiedGames.filter((game) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${game.title} ${game.coreCategoryLabel} ${game.domain} ${game.tagline} ${game.examplePrompt}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    if (selectedFilter === "all") return true;
    if (selectedFilter === "physical") return game.gameType === "physical_memory";
    if (selectedFilter === "cognitive") return game.gameType === "cognitive";
    return game.coreCategory === selectedFilter;
  });
  const activeCategoryInfo = coreCategoriesInfo.find((c) => c.id === selectedFilter);
  const handleLaunchUnified = (game) => {
    const task = {
      id: game.id,
      title: game.title.toUpperCase(),
      domain: game.domain || "Memory",
      difficulty: game.difficulty || "Easy",
      durationMinutes: game.durationMinutes,
      doctorAssigned: false,
      status: "pending",
      iconName: game.iconName,
      description: game.tagline,
      required: false
    };
    onStartGame(task);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28 animate-in fade-in duration-200 select-none">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-700 hover:text-[#0D7377] font-bold text-sm py-2 px-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <span className="text-xs font-black uppercase text-teal-800 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200">
          Showing {filtered.length} of {allUnifiedGames.length} Activities
        </span>
      </div>

      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-[#0D7377]/15 space-y-6">
        
        {/* Header Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0D7377] text-white flex items-center justify-center shadow-xs">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#132A2F] tracking-tight">
                ALL GAMES & ACTIVITIES DIRECTORY
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                Explore exercises structured across memory, attention, routine recall, pattern, object recognition, and mental engagement.
              </p>
            </div>
          </div>
        </div>

        {
    /* Search & Filter Controls */
  }
        <div className="space-y-3 pt-1">
          {
    /* Search Input */
  }
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search by game name, routine, memory domain, or keyword..."
    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-[#0D7377] focus:outline-hidden transition"
  />
            {searchQuery && <button
    onClick={() => setSearchQuery("")}
    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 bg-slate-200 rounded-lg cursor-pointer"
  >
                Clear
              </button>}
          </div>

          {
    /* Filter Pills based on 6 core categories */
  }
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            <button
    onClick={() => setSelectedFilter("all")}
    className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition active:scale-95 cursor-pointer ${selectedFilter === "all" ? "bg-[#0D7377] text-white shadow-xs" : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"}`}
  >
              All Activities ({allUnifiedGames.length})
            </button>

            {coreCategoriesInfo.map((cat) => {
    const count = allUnifiedGames.filter((g) => g.coreCategory === cat.id).length;
    return <button
      key={cat.id}
      onClick={() => setSelectedFilter(cat.id)}
      className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition active:scale-95 cursor-pointer flex items-center gap-1.5 ${selectedFilter === cat.id ? "bg-[#0D7377] text-white shadow-xs" : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"}`}
    >
                  <IconHelper name={cat.iconName} className="w-3.5 h-3.5" />
                  <span>{cat.name} ({count})</span>
                </button>;
  })}

            <button
    onClick={() => setSelectedFilter("physical")}
    className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition active:scale-95 cursor-pointer ${selectedFilter === "physical" ? "bg-emerald-600 text-white shadow-xs" : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"}`}
  >
              🤸 Physical (15)
            </button>

            <button
    onClick={() => setSelectedFilter("cognitive")}
    className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition active:scale-95 cursor-pointer ${selectedFilter === "cognitive" ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"}`}
  >
              🧠 Cognitive (15)
            </button>
          </div>

          {
    /* Active Category Description Banner */
  }
          {activeCategoryInfo && <div className={`p-3.5 rounded-2xl border ${activeCategoryInfo.badgeBg} ${activeCategoryInfo.badgeBorder} flex items-center gap-3`}>
              <div className={`w-8 h-8 rounded-xl ${activeCategoryInfo.color} text-white flex items-center justify-center shrink-0 shadow-2xs`}>
                <IconHelper name={activeCategoryInfo.iconName} className="w-4 h-4" />
              </div>
              <div>
                <h4 className={`text-xs font-black uppercase ${activeCategoryInfo.badgeText}`}>
                  {activeCategoryInfo.name}
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  {activeCategoryInfo.description}
                </p>
              </div>
            </div>}
        </div>

        {
    /* 2-Column Responsive Grid with Picture Cards */
  }
        {filtered.length === 0 ? <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-3">
            <p className="text-base font-extrabold text-slate-700">
              No games found matching "{searchQuery}"
            </p>
            <button
    onClick={() => {
      setSearchQuery("");
      setSelectedFilter("all");
    }}
    className="text-xs font-black text-[#0D7377] bg-teal-50 px-4 py-2 rounded-xl border border-teal-200 hover:bg-teal-100 cursor-pointer"
  >
              Reset Filters
            </button>
          </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((game) => <div
    key={game.id}
    className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-teal-500/50 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
  >
                {
    /* Picture Banner with Badges & Gradient */
  }
                <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
                  <img
    src={game.imageUrl}
    alt={game.title}
    loading="lazy"
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    onError={(e) => {
      e.target.style.display = "none";
    }}
  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                  {
    /* Top Badges */
  }
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs ${game.gameType === "physical_memory" ? "bg-emerald-500/95 text-white" : "bg-indigo-600/95 text-white"}`}>
                      {game.gameType === "physical_memory" ? "\u{1F938} Physical + Memory" : "\u{1F9E0} Cognitive"}
                    </span>

                    {game.popular && <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full shadow-xs">
                        ★ Popular
                      </span>}
                  </div>

                  {
    /* Bottom Overlay on Image */
  }
                  <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-white text-xs font-bold pointer-events-none">
                    <span className="bg-black/50 backdrop-blur-xs px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-300" />
                      <span>~{game.durationMinutes} min</span>
                    </span>
                    <span className="bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-lg text-teal-200">
                      Difficulty: {game.difficulty}
                    </span>
                  </div>
                </div>

                {
    /* Card Content */
  }
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${game.color} text-white flex items-center justify-center shadow-2xs shrink-0`}>
                        <IconHelper name={game.iconName} className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-[#132A2F] group-hover:text-[#0D7377] transition-colors leading-tight">
                          {game.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-[10px] font-black uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                            {game.coreCategoryLabel}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {game.domain}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      {game.tagline}
                    </p>

                    <div className="text-xs text-teal-950 font-medium bg-teal-50/80 p-3 rounded-2xl border border-teal-100/90 leading-snug">
                      <strong className="font-extrabold text-[#0D7377]">Example:</strong> {game.examplePrompt}
                    </div>

                    {game.safetyMessage && <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{game.safetyMessage}</span>
                      </div>}
                  </div>

                  <button
    onClick={() => handleLaunchUnified(game)}
    className="btn-glow-teal w-full py-4 bg-[#0D7377] hover:bg-[#0A5C5F] active:bg-[#074648] text-white font-black text-base rounded-2xl shadow-lg transition flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>Play Game Now</span>
                  </button>
                </div>
              </div>)}
          </div>}
      </div>

    </div>
  );
};
