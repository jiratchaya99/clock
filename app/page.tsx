"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Battery,
  Signal,
} from "lucide-react";

export default function MobileWidgetsPage() {
  // State สำหรับ Stopwatch Widget
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatStopwatch = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      {/* ==================== MOBILE PHONE FRAME ==================== */}
      <div className="relative w-full max-w-[395px] h-[820px] bg-[#09090b] rounded-[50px] border-[8px] border-[#1f1f23] shadow-[0_0_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
        
        {/* Mobile Status Bar & Dynamic Island */}
        <div className="pt-3.5 pb-2 px-7 flex items-center justify-between text-xs font-semibold text-white select-none shrink-0 z-20">
          <span>9:41</span>
          {/* Dynamic Island */}
          <div className="w-24 h-6 bg-black rounded-full border border-zinc-900 flex items-center justify-end px-2">
            <div className="w-2 h-2 rounded-full bg-[#1a1a2e]" />
          </div>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-10">
          {/* App Header */}
          <div className="text-center mb-5 px-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-1.5">
              <span className="w-3.5 h-3.5 rounded-[4px] border border-white inline-block" />
              <span>Wigggle UI</span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-white leading-snug">
              Widgets for the Web
            </h1>
            <p className="text-[11px] text-zinc-400 mt-1">
              Copy-paste widgets for your next project.
            </p>
          </div>

          {/* ==================== 2-COLUMN MOBILE WIDGET GRID ==================== */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* 1. Date Card Widget */}
            <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[24px] p-4 flex flex-col items-center justify-center select-none">
              <div className="text-sm font-semibold tracking-wide mb-0.5">
                <span className="text-[#ef4444]">Tue</span>{" "}
                <span className="text-zinc-200">Nov</span>
              </div>
              <div className="text-[60px] leading-none font-bold tracking-tight text-white">
                04
              </div>
            </div>

            {/* 2. Live Football Score Widget */}
            <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[24px] p-3.5 flex flex-col justify-between select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-medium text-zinc-300">Live</span>
              </div>

              <div className="flex items-center justify-between px-0.5 my-auto">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-[#fde047] text-black font-black text-[9px] flex flex-col items-center justify-center leading-none border border-black">
                    <span>BVB</span>
                    <span className="text-[7px]">09</span>
                  </div>
                  <span className="text-lg font-bold text-white">4</span>
                </div>

                <div className="bg-zinc-800/80 text-zinc-300 text-[9px] font-semibold px-1.5 py-0.5 rounded -mt-5">
                  34&apos;
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-[#6cabdd] text-white font-bold text-[8px] flex items-center justify-center border border-white">
                    MCI
                  </div>
                  <span className="text-lg font-bold text-white">4</span>
                </div>
              </div>

              <div className="text-center text-[10px] font-medium text-zinc-400">
                UCL Final
              </div>
            </div>

            {/* 3. Analog Clock Widget */}
            <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[24px] p-3 flex items-center justify-center select-none">
              <div className="relative w-full h-full rounded-full flex items-center justify-center">
                {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, idx) => {
                  const angle = idx * 30;
                  return (
                    <div
                      key={num}
                      className="absolute inset-1 text-center"
                      style={{ transform: `rotate(${angle}deg)` }}
                    >
                      <span
                        className="inline-block text-[9px] font-semibold text-zinc-300"
                        style={{ transform: `rotate(-${angle}deg)` }}
                      >
                        {num}
                      </span>
                    </div>
                  );
                })}
                <div
                  className="absolute w-1 h-8 bg-white rounded-full origin-bottom bottom-1/2"
                  style={{ transform: "rotate(122deg)" }}
                />
                <div
                  className="absolute w-0.5 h-11 bg-zinc-300 rounded-full origin-bottom bottom-1/2"
                  style={{ transform: "rotate(305deg)" }}
                />
                <div
                  className="absolute w-[1px] h-12 bg-red-500 rounded-full origin-bottom bottom-1/2"
                  style={{ transform: "rotate(316deg)" }}
                />
                <div className="w-2 h-2 rounded-full bg-zinc-400 border border-[#111113] z-10" />
              </div>
            </div>

            {/* 4. Stock Ticker Widget (META) */}
            <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[24px] p-4 flex flex-col justify-between select-none">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold tracking-tight text-white">
                    732.17
                  </span>
                  <span className="text-emerald-500 text-sm">▲</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-medium text-emerald-500 mt-0.5">
                  <span>+2.76</span>
                  <span>+0.47%</span>
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-white tracking-wide">META</div>
                <div className="text-[10px] text-zinc-400 truncate">
                  Meta Platforms Inc
                </div>
              </div>
            </div>

            {/* 5. Detailed Weather Widget (Mumbai) */}
            <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[24px] p-3.5 flex flex-col justify-between select-none">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Mumbai</div>
                  <div className="text-[9px] text-zinc-400">Feels Like 36°</div>
                </div>
                <div className="text-lg font-bold text-white">35°</div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-200 px-0.5">
                <div className="flex items-center gap-0.5">
                  <ArrowUp className="w-3 h-3 text-white" />
                  <span>37°</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <ArrowDown className="w-3 h-3 text-white" />
                  <span>31°</span>
                </div>
              </div>

              <div className="bg-[#18181b] border border-zinc-800/80 rounded-xl p-1.5 grid grid-cols-5 gap-0.5 text-center">
                {[32, 37, 36, 38, 33].map((temp, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <Sun className="w-2.5 h-2.5 text-amber-400" />
                    <span className="text-[8px] font-medium text-zinc-300">{temp}°</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Stopwatch Dial Widget */}
            <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[24px] p-3 flex flex-col items-center justify-between select-none relative">
              <div className="relative w-24 h-24 rounded-full border border-zinc-800 flex items-center justify-center mt-0.5">
                {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n, idx) => {
                  const deg = idx * 30;
                  return (
                    <div
                      key={n}
                      className="absolute inset-0.5 text-center"
                      style={{ transform: `rotate(${deg}deg)` }}
                    >
                      <span
                        className="inline-block text-[7px] text-zinc-400"
                        style={{ transform: `rotate(-${deg}deg)` }}
                      >
                        {n}
                      </span>
                    </div>
                  );
                })}
                <div
                  className="absolute w-[1px] h-9 bg-red-500 origin-bottom bottom-1/2 transition-transform duration-75"
                  style={{ transform: `rotate(${(time / 1000) * 6}deg)` }}
                />
                <div className="bg-[#111113] px-1 rounded text-[11px] font-bold tracking-wider text-white z-10 mt-4">
                  {formatStopwatch(time)}
                </div>
              </div>

              <div className="w-full flex items-center justify-between px-0.5 -mt-3 z-20">
                <button
                  onClick={() => {
                    setIsRunning(false);
                    setTime(0);
                  }}
                  aria-label="Reset"
                  className="w-6 h-6 rounded-full bg-zinc-800/90 hover:bg-zinc-700 flex items-center justify-center text-zinc-300"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  aria-label="Start or Pause"
                  className="w-6 h-6 rounded-full bg-white hover:bg-zinc-200 flex items-center justify-center text-black"
                >
                  {isRunning ? (
                    <Pause className="w-3 h-3 fill-black" />
                  ) : (
                    <Play className="w-3 h-3 fill-black ml-0.5" />
                  )}
                </button>
              </div>
            </div>

            {/* 7. Stock Chart Widget (AAPL) */}
            <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[24px] p-4 flex flex-col justify-between select-none overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-red-500 text-[10px]">▼</span>
                  <span className="text-xs font-bold text-white">AAPL</span>
                </div>
                <span className="text-[10px] font-semibold text-red-500">-4.26</span>
              </div>

              <div className="w-full h-12 my-0.5">
                <svg viewBox="0 0 120 45" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="aaplGradMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,18 Q15,28 28,22 T55,26 T82,12 T105,28 L120,25 L120,45 L0,45 Z"
                    fill="url(#aaplGradMobile)"
                  />
                  <path
                    d="M0,18 Q15,28 28,22 T55,26 T82,12 T105,28 L120,25"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              <div className="text-right text-lg font-bold text-white tracking-tight">
                262.24
              </div>
            </div>

            {/* 8. 4-Day Forecast Widget */}
            <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[24px] p-4 flex flex-col justify-between select-none">
              {["Mon", "Tue", "Wed", "Thu"].map((day) => (
                <div key={day} className="flex items-center justify-between text-[11px] font-medium">
                  <span className="text-zinc-300 w-7">{day}</span>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-zinc-200 font-semibold">31°</span>
                  <span className="text-zinc-200 font-semibold">38°</span>
                </div>
              ))}
            </div>

            {/* 9. Cricket Score Widget (ODI 2) */}
            <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[24px] p-3.5 flex flex-col justify-between select-none">
              <div className="text-[10px] font-semibold text-zinc-400">ODI 2</div>

              <div className="space-y-2 my-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-2.5 rounded-[1px] bg-gradient-to-b from-orange-500 via-white to-green-600 inline-block" />
                    <span className="text-[10px] font-bold text-white">IND</span>
                  </div>
                  <div className="text-[10px] font-bold text-white">
                    387/3 <span className="text-[8px] font-normal text-zinc-400">(49)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-2.5 rounded-[1px] bg-blue-800 inline-block relative overflow-hidden">
                      <span className="w-1.5 h-1 bg-red-600 block" />
                    </span>
                    <span className="text-[10px] font-bold text-white">AUS</span>
                  </div>
                  <div className="text-[10px] font-bold text-white">
                    200/6 <span className="text-[8px] font-normal text-zinc-400">(30)</span>
                  </div>
                </div>
              </div>

              <div className="text-[9px] text-zinc-400 text-center leading-tight">
                AUS needs <span className="text-emerald-500 font-semibold">187</span> from{" "}
                <span className="text-emerald-500 font-semibold">120</span>
              </div>
            </div>

            {/* 10. World Clock Widget */}
            <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[24px] p-4 flex flex-col justify-between select-none">
              <div>
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span>Mumbai</span>
                  <Sun className="w-3.5 h-3.5 text-zinc-200" />
                </div>
                <div className="text-base font-bold text-white mt-0.5">8:15 AM</div>
              </div>

              <div className="h-[1px] bg-zinc-800/80 w-full" />

              <div>
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span>Vancouver</span>
                  <Moon className="w-3.5 h-3.5 text-zinc-200" />
                </div>
                <div className="text-base font-bold text-white mt-0.5">6:45 PM</div>
              </div>
            </div>

            {/* 11. Mini Calendar Widget (Nov 2025) */}
            <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[24px] p-3 flex flex-col justify-between select-none">
              <div className="flex items-center justify-between px-0.5">
                <ChevronLeft className="w-3 h-3 text-zinc-400" />
                <span className="text-[10px] font-bold text-white">Nov 2025</span>
                <ChevronRight className="w-3 h-3 text-zinc-400" />
              </div>

              <div className="grid grid-cols-7 gap-y-0.5 text-center text-[8px]">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
                  <span key={idx} className="text-zinc-500 font-semibold">
                    {d}
                  </span>
                ))}

                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={`empty-${i}`} />
                ))}

                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                  const isSelected = day === 4;
                  return (
                    <span
                      key={day}
                      className={`w-3.5 h-3.5 mx-auto flex items-center justify-center rounded-full text-[8px] ${
                        isSelected
                          ? "bg-white text-black font-bold"
                          : "text-zinc-300"
                      }`}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* 12. Simple Temperature Card Widget */}
            <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[24px] p-4 flex flex-col items-center justify-center text-center select-none">
              <div className="text-[42px] leading-none font-bold text-white tracking-tight">
                29°
              </div>
              <div className="text-xs font-semibold text-zinc-200 mt-2">
                Sunny
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">
                Tue Nov 22
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Home Indicator Bar */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
          <div className="w-32 h-1 bg-zinc-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}