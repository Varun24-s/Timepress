"use client";

import React from "react";

export default function NewspaperPreview({ data, activeTab }) {
    if (!data) return null;

    const PAGE_CONFIG = {
        1: { title: "Main Edition", hero: "The TimePress", subHero: "Worldwide Distribution" },
        2: { title: "Foreign Intelligence", hero: "Foreign", subHero: "Latest Reports From Our Bureaus" },
        3: { title: "Sporting Intelligence", hero: "Sports", subHero: "Cricket — Turf — Athletics" },
        4: { title: "Classified Notices", hero: "Classifieds", subHero: "Public Notices & Business Appeals" },
    };

    const PageSheet = ({ pageNumber, children }) => {
        const config = PAGE_CONFIG[pageNumber];

        return (
            <div className={`
        relative mx-auto transition-all duration-300
        ${activeTab === pageNumber ? 'flex opacity-100' : 'hidden opacity-0'}
        w-full max-w-[850px] min-h-[70vh] md:min-h-[1100px] flex-col 
        bg-[#f4f1ea] p-6 md:p-12 shadow-2xl border border-stone-300/60 
        sepia-[0.1] contrast-[1.02] overflow-hidden
      `}>
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/stardust.png')` }} />

                <header className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center border-b-2 border-stone-800 pb-2 mb-6 md:mb-8 gap-2">
                    <div className="flex flex-col text-center md:text-left">
                        <span className="text-stone-400 text-[8px] uppercase tracking-widest">Archive Record</span>
                        <span className="text-stone-900 font-bold text-[10px]">{data.date}</span>
                    </div>
                    <div className="hidden md:flex flex-col text-right text-[10px] uppercase font-bold tracking-widest">
                        <span className="text-stone-400 text-[8px]">Folio №</span>
                        <span className="text-stone-900">00{pageNumber}</span>
                    </div>
                </header>

                <div className="flex flex-col font-serif items-center border-b-2 border-stone-900 pb-6 md:pb-8 mb-6 md:mb-8 text-center">
                    <h2 className={`font-black uppercase italic leading-tight ${pageNumber === 1 ? 'text-5xl md:text-7xl border-y-4 md:border-y-[6px] border-double border-stone-900 py-2 md:py-4 w-full' : 'text-3xl md:text-5xl'}`}>
                        {config.hero}
                    </h2>
                    <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] mt-2 text-stone-600">
                        {config.subHero}
                    </div>
                </div>

                <main className="relative z-10 flex-grow font-serif text-stone-900 overflow-y-auto no-scrollbar">
                    {children}
                </main>

                <footer className="relative z-10 w-full mt-auto pt-4 border-t border-stone-300 flex justify-between items-center text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-stone-400">
                    <span>{data.region} Edition</span>
                    <span className="hidden md:inline italic normal-case">Authenticated via Telegraph</span>
                    <span>P. {pageNumber}</span>
                </footer>
            </div>
        );
    };

    return (
        <div className="w-full px-4 py-6 md:py-10 flex justify-center min-h-screen">

            {/* PAGE 1: FRONT PAGE */}
            <PageSheet pageNumber={1}>
                <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8">
                    <article className="md:col-span-2">
                        <h2 className="text-2xl md:text-4xl font-bold leading-none mb-4 uppercase tracking-tighter">
                            {data.mainStory?.headline || "Global Updates"}
                        </h2>
                        <p className="text-sm md:text-[15px] leading-relaxed text-justify first-letter:text-5xl md:first-letter:text-7xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-2 first-letter:leading-none">
                            {data.mainStory?.content}
                        </p>
                    </article>
                    {/* Sidebar Story (Page 1 Story #2) */}
                    <div className="border-t md:border-t-0 md:border-l border-stone-300 pt-4 md:pt-0 md:pl-6 text-[12px] italic leading-relaxed">
                        <h4 className="font-bold uppercase not-italic text-[10px] mb-2 tracking-widest border-b border-stone-200 pb-1">In Brief</h4>
                        <div className="mb-6">
                            <h5 className="font-bold uppercase not-italic text-[11px] mb-1">{data.sideStories?.[0]?.headline}</h5>
                            <p>{data.sideStories?.[0]?.content || "No further dispatches."}</p>
                        </div>
                        {/* Optional small filler ad or notice for Page 1 Story #3 */}
                        <div className="pt-4 border-t border-stone-200">
                            <p className="text-[10px] uppercase font-bold tracking-tighter opacity-60 italic">"The price of liberty is eternal vigilance."</p>
                        </div>
                    </div>
                </div>
            </PageSheet>

            {/* PAGE 2: FOREIGN (Now showing stories 2, 3, and 4) */}
            <PageSheet pageNumber={2}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    {data.sideStories?.slice(1, 4).map((s, i) => (
                        <div key={i} className={`pb-6 ${i < 2 ? 'md:border-b border-stone-300' : ''}`}>
                            <h3 className="text-lg md:text-xl font-bold uppercase mb-3 leading-tight border-b-4 border-double border-stone-900 pb-1 inline-block">
                                {s.headline}
                            </h3>
                            <p className="text-sm leading-relaxed text-justify">{s.content}</p>
                        </div>
                    ))}
                    {/* Fallback if LLM provides fewer than 3 */}
                    {data.sideStories?.length < 3 && (
                        <div className="italic text-stone-400 text-sm">Waiting for further telegraphic despatches...</div>
                    )}
                </div>
            </PageSheet>

            {/* PAGE 3: SPORTS (Structured as Multi-part news) */}
            {/* PAGE 3: SPORTS (Now structured like Foreign News) */}
            <PageSheet pageNumber={3}>
                <div className="flex flex-col gap-8">
                

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                        {data.sportsStories?.map((s, i) => (
                            <div key={i} className={`pb-6 ${i < 2 ? 'md:border-b border-stone-300' : ''} ${i === 0 ? 'md:col-span-2 border-b border-stone-300 mb-4' : ''}`}>
                                <h3 className={`font-bold uppercase mb-3 leading-tight ${i === 0 ? 'text-2xl border-b-2 border-stone-900' : 'text-lg border-b border-stone-400'} pb-1 inline-block`}>
                                    {s.headline}
                                </h3>
                                <p className={`text-sm leading-relaxed text-justify ${i === 0 ? 'first-letter:text-4xl first-letter:font-serif first-letter:mr-2' : ''}`}>
                                    {s.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Decorative Sports Footer */}
                    <div className="mt-auto pt-4 border-t-2 border-stone-800 flex justify-around text-[9px] font-black uppercase tracking-[0.3em] text-stone-500">
                        <span>Cricket</span>
                        <span>The Turf</span>
                        <span>Athletics</span>
                        <span>Aquatics</span>
                    </div>
                </div>
            </PageSheet>


            {/* PAGE 4: CLASSIFIEDS - FULL PAGE DENSITY */}
            <PageSheet pageNumber={4}>
                <div className="flex flex-col h-full">
                    {/* Header for the Classifieds Section */}
                    <div className="border-b-2 border-stone-800 mb-6 pb-2 flex justify-between items-end">
                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">The Public Exchange</h3>
                        <span className="text-[9px] font-bold text-stone-400 italic">Established 1884</span>
                    </div>

                    {/* MASONRY-STYLE COLUMNS: This fills the vertical space */}
                    <div className="columns-2 md:columns-3 gap-6 space-y-6 [column-rule:1px_solid_#d6d3d1]">
                        {(data.classifieds?.length ? data.classifieds : []).map((ad, i) => (
                            <div
                                key={i}
                                className="break-inside-avoid border-b border-stone-300 pb-4 mb-4 last:border-0 group"
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-black text-[8px] text-stone-800 uppercase tracking-widest">
                                        № {900 + i}
                                    </span>
                                    <div className="h-[1px] flex-grow mx-2 bg-stone-200 uppercase" />
                                </div>

                                {/* The Ad Content */}
                                <p className="text-[10px] md:text-[11px] leading-[1.4] text-stone-800 text-justify">
                                    <span className="font-bold uppercase mr-1">
                                        {ad.split(':')[0]}:
                                    </span>
                                    <br />
                                    {ad.split(':').slice(1).join(':') || ad}
                                </p>
                            </div>
                        ))}

                        {/* FILLER ADS: If the AI doesn't provide enough, these keep the page looking full */}
                        <div className="break-inside-avoid border-2 border-dashed border-stone-300 p-3 text-center bg-stone-50/50">
                            <p className="text-[9px] font-bold uppercase text-stone-400 leading-tight">
                                Space Reserved for Royal Proclamations
                            </p>
                            <p className="text-[8px] italic text-stone-300 mt-1 italic">Inquire at the Main Office</p>
                        </div>
                    </div>

                    {/* PAGE FOOTER DECORATION */}
                    <div className="mt-auto pt-8 flex flex-col items-center">
                        <div className="w-full border-t-4 border-double border-stone-900 mb-2" />
                        <p className="text-[8px] font-bold uppercase tracking-[0.5em] text-stone-400">
                            Printed & Published in {data.region} — All Rights Reserved
                        </p>
                    </div>
                </div>
            </PageSheet>

        </div>
    );
}