"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [date, setDate] = useState("1910-05-12");
  const [region, setRegion] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/edition/preview?date=${date}&region=${region || 'London'}`);
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex flex-col font-serif text-stone-900 selection:bg-amber-200 relative overflow-x-hidden">
      {/* Authentic Paper Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/stardust.png')` }} />

      {/* 1. THE IMPERIAL MASTHEAD */}
      <header className="w-full py-6 md:py-10 border-b-4 border-double border-stone-900 bg-[#f4f1ea] relative z-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-6">
            <span className="text-[8px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.5em] font-black text-stone-500 mb-2 text-center">
              The Great Universal Dispatch & Records Office
            </span>
            {/* Responsive Heading: Fluid text sizes */}
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none border-y-2 border-stone-900 py-3 md:py-4 w-full text-center">
              The TimePress
            </h1>
            <div className="w-full flex flex-col md:flex-row justify-between items-center mt-3 text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2 gap-2 md:gap-0">
              <span>Established: MMXXVI</span>
              <span className="hidden lg:inline italic normal-case font-serif tracking-normal text-stone-600">
                "The Past is but a Prologue to the Present."
              </span>
              <span>Price: Marlboro Advance Compact</span>
            </div>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-x-6 md:gap-x-12 gap-y-3 border-t border-stone-300 pt-4 text-[10px] md:text-[11px] uppercase font-black tracking-[0.1em] md:tracking-[0.2em]">
            <a href="#vaults" className="hover:text-amber-900 transition-colors underline decoration-stone-400 underline-offset-4 md:underline-offset-8">The Vaults</a>
            <a href="#wire" className="hover:text-amber-900 transition-colors underline decoration-stone-400 underline-offset-4 md:underline-offset-8">The Wire Service</a>
            <a href="#editor" className="hover:text-amber-900 transition-colors underline decoration-stone-400 underline-offset-4 md:underline-offset-8">Editorial Bureau</a>
          </nav>
        </div>
      </header>

      {/* 2. THE CHRONOLOGICAL PORTAL */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-6 py-12 md:py-24 relative z-10">
        <div className="w-full max-w-2xl bg-transparent border-4 md:border-[6px] border-double border-stone-900 p-6 md:p-14 shadow-[15px_15px_0px_rgba(41,37,36,0.08)] md:shadow-[25px_25px_0px_rgba(41,37,36,0.08)]">
          <div className="space-y-8 md:space-y-10">
            <div className="text-center space-y-3 md:space-y-4">
              <h2 className="text-2xl md:text-5xl font-black uppercase leading-[0.9] md:leading-[0.85] tracking-tighter">
                Summon a Historical Gazette
              </h2>
              <p className="text-stone-800 italic text-base md:text-xl border-y border-stone-300 py-3 md:py-4 leading-snug">
                Instruct the engines to retrieve a specific leaf from the annals of time.
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-8 md:space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-3 md:space-y-4">
                  <label className="text-[9px] md:text-[10px] uppercase font-black text-stone-900 tracking-[0.2em] block border-b-2 border-stone-900 pb-1">
                    Temporal Target
                  </label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent border-none py-1 md:py-2 text-xl md:text-2xl focus:ring-0 outline-none text-stone-900 font-bold cursor-pointer"
                  />
                </div>

                <div className="space-y-3 md:space-y-4">
                  <label className="text-[9px] md:text-[10px] uppercase font-black text-stone-900 tracking-[0.2em] block border-b-2 border-stone-900 pb-1">
                    Geography of Record
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g., BOMBAY"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-transparent border-none py-1 md:py-2 text-xl md:text-2xl focus:ring-0 outline-none text-stone-900 font-bold placeholder:text-stone-300 uppercase"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-stone-900 hover:bg-stone-800 text-[#f4f1ea] font-black py-5 md:py-7 rounded-none uppercase tracking-[0.3em] md:tracking-[0.5em] text-lg md:text-xl transition-all border-2 border-stone-900 shadow-xl active:translate-y-1"
              >
                Print Edition
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* 3. ARCHIVAL DESCRIPTIONS */}
      <section className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20 py-12 md:py-24 border-t-2 border-stone-900 relative z-10">
        
        <div id="vaults" className="space-y-4 md:space-y-6">
            <h4 className="text-stone-900 text-xl md:text-2xl font-black uppercase tracking-tighter border-b-4 border-double border-stone-900 pb-2">
                The Ledger Vaults
            </h4>
            <p className="text-[13px] md:text-[14px] leading-relaxed text-justify first-letter:text-3xl md:first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2">
                Our subterranean vaults house the collective memory of the Empire. Each request triggers a mechanical search through vast corridors of municipal records, court circulars, and merchant logs. We do not merely provide data; we provide a window into the exact atmosphere of the morning in question.
            </p>
        </div>

        <div id="wire" className="space-y-4 md:space-y-6">
            <h4 className="text-stone-900 text-xl md:text-2xl font-black uppercase tracking-tighter border-b-4 border-double border-stone-900 pb-2">
                The Global Wire
            </h4>
            <p className="text-[13px] md:text-[14px] leading-relaxed text-justify first-letter:text-3xl md:first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2">
                Information is gathered via a worldwide network of telegraphic despatches. From the bustling docks of New York to the colonial outposts of India, our agents remain vigilant. These reports are transmitted through high-pressure pneumatic systems, ensuring that the news of the world arrives fresh.
            </p>
        </div>

        <div id="editor" className="space-y-4 md:space-y-6">
            <h4 className="text-stone-900 text-xl md:text-2xl font-black uppercase tracking-tighter border-b-4 border-double border-stone-900 pb-2">
                Editorial Bureau
            </h4>
            <p className="text-[13px] md:text-[14px] leading-relaxed text-justify italic first-letter:text-3xl md:first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2">
                A newspaper is more than a list of events; it is a labor of curation. Our Chief Editor oversees the typesetting of every column, ensuring that sporting matches and humble classifieds are presented with the linguistic dignity they deserve. Every edition is hand-composed for the reader.
            </p>
        </div>

      </section>

      {/* 4. THE FOOTER */}
      <footer id="legal" className="w-full py-12 md:py-16 bg-stone-900 text-[#f4f1ea] px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
            <p className="text-[9px] md:text-[11px] uppercase font-bold tracking-[0.3em] md:tracking-[0.6em] opacity-40">
                Printed & Distributed by the TimePress Royal Gazetteers
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-black text-stone-500">
                <span>London</span>
                <span>Calcutta</span>
                <span>Melbourne</span>
                <span>New York</span>
            </div>
            <p className="text-[8px] md:text-[10px] italic opacity-30 max-w-2xl mx-auto px-4">
                "Warning: The retrieval of historical despatches is a delicate process. The Bureau assumes no responsibility for the shocking nature of past scandals."
            </p>
        </div>
      </footer>
    </div>
  );
}