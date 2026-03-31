"use client";
import React, { useState } from 'react';

export default function Controls({ onGenerate }) {
  const [date, setDate] = useState("1910-05-12");
  const [region, setRegion] = useState("London");

  const handleSubmit = (e) => {
    e.preventDefault();

    const targetDate = new Date(date);
    
    const newsDate = new Date(targetDate);
    newsDate.setDate(newsDate.getDate() - 1);

    const newsDateString = newsDate.toISOString().split('T')[0];
   
    onGenerate({ 
      displayDate: date,       
      contentDate: newsDateString, 
      region 
    });
  };

  return (
    <nav className="bg-stone-900 border-b border-stone-800 p-4 sticky top-0 z-50 shadow-2xl">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto flex flex-wrap items-end justify-center gap-6">
        <div className="flex flex-col">
          <label className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mb-1">Target Date</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-stone-800 text-stone-200 border border-stone-700 p-2 rounded text-sm focus:ring-1 focus:ring-amber-500 outline-none"
          />
          <span className="text-[8px] text-amber-600 font-bold uppercase mt-1 tracking-tighter">
            * Reports will reflect events from the day prior
          </span>
        </div>

        <div className="flex flex-col">
          <label className="text-stone-500 text-[10px] uppercase font-bold tracking-widest mb-1">Edition Region</label>
          <input 
            type="text" 
            placeholder="e.g. Paris" 
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-stone-800 text-stone-200 border border-stone-700 p-2 rounded text-sm focus:ring-1 focus:ring-amber-500 outline-none"
          />
        </div>

        <button 
          type="submit"
          className="bg-amber-700 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded uppercase text-sm tracking-widest transition-all"
        >
          Generate Edition
        </button>
      </form>
    </nav>
  );
}