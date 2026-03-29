"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NewspaperPreview from "@/components/NewspaperPreview";

export default function EditionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(1);

  const dateParam = searchParams.get("date");
  const regionParam = searchParams.get("region") || "London";

  useEffect(() => {
    if (!dateParam) {
      setError("No date specified for retrieval.");
      setLoading(false);
      return;
    }

    async function loadHistoricalData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: dateParam, region: regionParam }),
        });

        if (!response.ok) throw new Error("The archive telegraph is down.");
        const result = await response.json();
        if (result.error) throw new Error(result.error);

        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadHistoricalData();
  }, [dateParam, regionParam]);

  const tabs = [
    { id: 1, label: "Folio I: Front" },
    { id: 2, label: "Folio II: Foreign" },
    { id: 3, label: "Folio III: Sports" },
    { id: 4, label: "Folio IV: Classifieds" }
  ];

  return (
    <div className="min-h-screen bg-[#f4f1ea] font-serif text-stone-900 selection:bg-amber-200">
      {/* 1. ARCHIVAL TOOLBAR (REPLACED MODERN NAV) */}
      <nav className="w-full bg-[#f4f1ea] border-b-4 border-double border-stone-900 sticky top-0 z-50 px-4 py-4 md:px-8 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* BACK ACTION */}
          <div className="flex items-center gap-6 self-start md:self-auto">
            <button 
              onClick={() => router.push("/")} 
              className="group flex items-center gap-3 text-stone-900 hover:text-amber-900 transition-colors text-[11px] font-black uppercase tracking-[0.2em]"
            >
              <span className="text-xl leading-none group-hover:-translate-x-1 transition-transform">←</span> 
              <span className="border-b border-stone-900">Return to Bureau</span>
            </button>
          </div>

          {/* PAGE SELECTOR (RECTANGULAR & BOLD) */}
          <div className="flex flex-wrap justify-center bg-stone-900 p-1 shadow-[4px_4px_0px_#29252440]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 md:px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
                  activeTab === tab.id 
                    ? "bg-[#f4f1ea] text-stone-900" 
                    : "bg-stone-900 text-stone-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          
        </div>
      </nav>

      {/* 2. MAIN CONTENT AREA */}
      <main className="w-full max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center min-h-[80vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            {/* Victorian Style Loading */}
            <div className="w-16 h-16 border-8 border-stone-300 border-t-stone-900 mb-8 animate-spin rounded-none"></div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Retrieving Despatch</h2>
            <p className="text-stone-500 uppercase tracking-[0.3em] text-[10px] font-bold">The Steam-Press is warming...</p>
          </div>
        ) : error ? (
          <div className="py-40 text-center max-w-lg border-4 border-double border-stone-900 p-12">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4 text-red-900">Communication Break</h2>
            <p className="text-stone-700 text-sm uppercase tracking-widest leading-loose mb-10 italic">
              "The telegraph wires to {regionParam} have been severed. {error}"
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-stone-900 text-[#f4f1ea] px-10 py-4 text-xs font-black uppercase tracking-[0.3em] hover:bg-stone-800 transition-all shadow-xl"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div id="newspaper-container" className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
             <NewspaperPreview data={data} activeTab={activeTab} />
          </div>
        )}
      </main>

      {/* 3. SUBTLE FOOTER STYLING */}
      <footer className="w-full py-12 border-t-2 border-stone-300 opacity-30 text-center print:hidden">
         <p className="text-[10px] font-black uppercase tracking-[0.5em]">TimePress Official Reader Access</p>
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}