"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
  Github,
} from "lucide-react";

export default function WigggleUIPage() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(
    null,
  );
  const [isLightTheme, setIsLightTheme] = useState(false);
  const stopwatchStartedAt = useRef<number | null>(null);

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    updateTime();
    const interval = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const startedAt = stopwatchStartedAt.current;
    if (!isRunning || startedAt === null) {
      return;
    }

    const interval = window.setInterval(() => {
      setTime(performance.now() - startedAt);
    }, 25);
    return () => window.clearInterval(interval);
  }, [isRunning]);

  const formatStopwatch = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  const calendarDate = now
    ? new Date(
        now.getFullYear(),
        now.getMonth() + calendarMonthOffset,
        1,
      )
    : null;
  const daysInCalendarMonth = calendarDate
    ? new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth() + 1,
        0,
      ).getDate()
    : 0;
  const calendarStartDay = calendarDate?.getDay() ?? 0;
  const isCurrentCalendarMonth =
    calendarDate !== null &&
    now !== null &&
    calendarDate.getFullYear() === now.getFullYear() &&
    calendarDate.getMonth() === now.getMonth();
  const formatWorldTime = (date: Date | null, timeZone: string) =>
    date
      ? date.toLocaleTimeString("en-US", {
          timeZone,
          hour: "numeric",
          minute: "2-digit",
        })
      : "--:--";
  const isDaytimeIn = (date: Date | null, timeZone: string) => {
    if (!date) {
      return false;
    }

    const hour = Number(
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "numeric",
        hourCycle: "h23",
      }).format(date),
    );
    return hour >= 6 && hour < 18;
  };
  const mumbaiIsDaytime = isDaytimeIn(now, "Asia/Kolkata");
  const vancouverIsDaytime = isDaytimeIn(now, "America/Vancouver");
  const hourHandRotation = now
    ? ((now.getHours() % 12) + now.getMinutes() / 60) * 30
    : 0;
  const minuteHandRotation = now
    ? (now.getMinutes() + now.getSeconds() / 60) * 6
    : 0;
  const secondHandRotation = now ? now.getSeconds() * 6 : 0;

  return (
    <div
      data-theme={isLightTheme ? "light" : "dark"}
      className="min-h-screen flex flex-col justify-between pb-16"
    >
      {/* ==================== NAVBAR ==================== */}
      <header className="w-full max-w-[1280px] mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
            <div className="w-5 h-5 rounded-[5px] border-2 border-white flex items-center justify-center" />
            <span>Wigggle UI</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-zinc-400">
            <a href="#widgets" className="hover:text-white transition-colors">
              Widgets
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-medium bg-[#18181b] hover:bg-[#222226] border border-zinc-800 px-3.5 py-2 rounded-lg transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>Give us a Star</span>
          </a>
          <button
            aria-label={`Switch to ${isLightTheme ? "dark" : "light"} theme`}
            onClick={() => setIsLightTheme((current) => !current)}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
          >
            {isLightTheme ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-[54px] font-extrabold tracking-tight leading-[1.12] text-white">
          The first ever collection of Widgets for the Web.
        </h1>
        <p className="mt-5 text-zinc-400 text-base sm:text-lg max-w-xl mx-auto font-normal">
          An open-source curated collection of copy-paste widgets for your next project.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="#widgets"
            className="bg-[#ededed] hover:bg-white text-black font-semibold text-sm px-6 py-2.5 rounded-lg transition-all shadow-sm"
          >
            Get Started
          </a>
          <a
            href="#widgets"
            className="text-zinc-300 hover:text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            View Widgets
          </a>
        </div>
      </section>

      {/* ==================== WIDGETS GRID ==================== */}
      <main id="widgets" className="w-full max-w-[1260px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* 1. Date Card Widget */}
          <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[28px] p-5 flex flex-col items-center justify-center select-none hover:border-zinc-700 transition-colors">
            <div className="text-lg font-semibold tracking-wide mb-1">
              <span className="text-[#ef4444]">
                {now?.toLocaleDateString("en-US", { weekday: "short" }) ?? "--"}
              </span>{" "}
              <span className="text-zinc-200">
                {now?.toLocaleDateString("en-US", { month: "short" }) ?? "---"}
              </span>
            </div>
            <div className="text-[76px] leading-none font-bold tracking-tight text-white">
              {now?.toLocaleDateString("en-US", { day: "2-digit" }) ?? "--"}
            </div>
          </div>

          {/* 2. Live Football Score Widget */}
          <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[28px] p-5 flex flex-col justify-between select-none hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-zinc-300">Live</span>
            </div>

            <div className="flex items-center justify-between px-1 my-auto">
              {/* Team 1: BVB */}
              <div className="flex flex-col items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#fde047] text-black font-black text-[11px] flex flex-col items-center justify-center leading-none border-2 border-black outline outline-1 outline-[#fde047]">
                  <span>BVB</span>
                  <span className="text-[8px]">09</span>
                </div>
                <span className="text-2xl font-bold text-white">4</span>
              </div>

              {/* Match Time */}
              <div className="bg-zinc-800/80 text-zinc-300 text-[11px] font-semibold px-2 py-0.5 rounded-md -mt-6">
                34&apos;
              </div>

              {/* Team 2: Man City */}
              <div className="flex flex-col items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#6cabdd] text-white font-bold text-[10px] flex items-center justify-center border-2 border-white">
                  MCI
                </div>
                <span className="text-2xl font-bold text-white">4</span>
              </div>
            </div>

            <div className="text-center text-xs font-medium text-zinc-400">
              UCL Final
            </div>
          </div>

          {/* 3. Analog Clock Widget */}
          <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[28px] p-4 flex items-center justify-center select-none hover:border-zinc-700 transition-colors">
            <div className="relative w-full h-full rounded-full flex items-center justify-center">
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, idx) => {
                const angle = idx * 30;
                return (
                  <div
                    key={num}
                    className="absolute inset-1.5 text-center"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <span
                      className="inline-block text-[11px] font-semibold text-zinc-300"
                      style={{ transform: `rotate(-${angle}deg)` }}
                    >
                      {num}
                    </span>
                  </div>
                );
              })}
              {/* Hour Hand */}
              <div
                className="absolute w-1.5 h-10 bg-white rounded-full origin-bottom bottom-1/2"
                style={{ transform: `rotate(${hourHandRotation}deg)` }}
              />
              {/* Minute Hand */}
              <div
                className="absolute w-1 h-14 bg-zinc-300 rounded-full origin-bottom bottom-1/2"
                style={{ transform: `rotate(${minuteHandRotation}deg)` }}
              />
              {/* Second Hand */}
              <div
                className="absolute w-[1.5px] h-16 bg-red-500 rounded-full origin-bottom bottom-1/2"
                style={{ transform: `rotate(${secondHandRotation}deg)` }}
              />
              {/* Center Dot */}
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 border-2 border-[#111113] z-10" />
            </div>
          </div>

          {/* 4. Stock Ticker Widget (META) */}
          <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[28px] p-5 flex flex-col justify-between select-none hover:border-zinc-700 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[28px] font-bold tracking-tight text-white">
                  732.17
                </span>
                <span className="text-emerald-500 text-lg">▲</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-emerald-500 mt-1">
                <span>+2.76</span>
                <span>+0.47%</span>
              </div>
            </div>

            <div>
              <div className="text-lg font-bold text-white tracking-wide">META</div>
              <div className="text-xs text-zinc-400 truncate">
                Meta Platforms Inc
              </div>
            </div>
          </div>

          {/* 5. Detailed Weather Widget (Mumbai) */}
          <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[28px] p-4 flex flex-col justify-between select-none hover:border-zinc-700 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-white">Mumbai</div>
                <div className="text-[11px] text-zinc-400">Feels Like 36°</div>
              </div>
              <div className="text-2xl font-bold text-white">35°</div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-zinc-200 px-1">
              <div className="flex items-center gap-1">
                <ArrowUp className="w-3.5 h-3.5 text-white" />
                <span>37°</span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowDown className="w-3.5 h-3.5 text-white" />
                <span>31°</span>
              </div>
            </div>

            <div className="bg-[#18181b] border border-zinc-800/80 rounded-2xl p-2 grid grid-cols-5 gap-1 text-center">
              {[32, 37, 36, 38, 33].map((temp, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-medium text-zinc-300">{temp}°</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Stopwatch Dial Widget */}
          <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[28px] p-4 flex flex-col items-center justify-between select-none hover:border-zinc-700 transition-colors relative">
            <div className="relative w-32 h-32 rounded-full border border-zinc-800 flex items-center justify-center mt-1">
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n, idx) => {
                const deg = idx * 30;
                return (
                  <div
                    key={n}
                    className="absolute inset-1 text-center"
                    style={{ transform: `rotate(${deg}deg)` }}
                  >
                    <span
                      className="inline-block text-[9px] text-zinc-400"
                      style={{ transform: `rotate(-${deg}deg)` }}
                    >
                      {n}
                    </span>
                  </div>
                );
              })}
              {/* Needle */}
              <div
                className="absolute w-[1.5px] h-12 bg-red-500 origin-bottom bottom-1/2 transition-transform duration-75"
                style={{ transform: `rotate(${((time / 1000) % 60) * 6}deg)` }}
              />
              <div className="bg-[#111113] px-1.5 py-0.5 rounded text-xs font-bold tracking-wider text-white z-10 mt-6">
                {formatStopwatch(time)}
              </div>
            </div>

            {/* Controls */}
            <div className="w-full flex items-center justify-between px-1 -mt-4 z-20">
              <button
                onClick={() => {
                  setIsRunning(false);
                  setTime(0);
                  stopwatchStartedAt.current = null;
                }}
                aria-label="Reset stopwatch"
                className="w-7 h-7 rounded-full bg-zinc-800/90 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (isRunning) {
                    if (stopwatchStartedAt.current !== null) {
                      setTime(performance.now() - stopwatchStartedAt.current);
                    }
                    stopwatchStartedAt.current = null;
                    setIsRunning(false);
                    return;
                  }

                  stopwatchStartedAt.current = performance.now() - time;
                  setIsRunning(true);
                }}
                aria-label={isRunning ? "Pause stopwatch" : "Start stopwatch"}
                className="w-7 h-7 rounded-full bg-white hover:bg-zinc-200 flex items-center justify-center text-black transition-colors"
              >
                {isRunning ? (
                  <Pause className="w-3.5 h-3.5 fill-black" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                )}
              </button>
            </div>
          </div>

          {/* ==================== ROW 2 ==================== */}

          {/* 7. Stock Chart Widget (AAPL) */}
          <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[28px] p-5 flex flex-col justify-between select-none hover:border-zinc-700 transition-colors overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-red-500 text-xs">▼</span>
                <span className="text-sm font-bold text-white">AAPL</span>
              </div>
              <span className="text-xs font-semibold text-red-500">-4.26</span>
            </div>

            {/* Area Sparkline SVG */}
            <div className="w-full h-16 my-1">
              <svg viewBox="0 0 120 45" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="aaplGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,18 Q15,28 28,22 T55,26 T82,12 T105,28 L120,25 L120,45 L0,45 Z"
                  fill="url(#aaplGrad)"
                />
                <path
                  d="M0,18 Q15,28 28,22 T55,26 T82,12 T105,28 L120,25"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            <div className="text-right text-2xl font-bold text-white tracking-tight">
              262.24
            </div>
          </div>

          {/* 8. 4-Day Forecast Widget */}
          <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[28px] p-5 flex flex-col justify-between select-none hover:border-zinc-700 transition-colors">
            {["Mon", "Tue", "Wed", "Thu"].map((day) => (
              <div key={day} className="flex items-center justify-between text-xs font-medium">
                <span className="text-zinc-300 w-9">{day}</span>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-zinc-200 font-semibold">31°</span>
                <span className="text-zinc-200 font-semibold">38°</span>
              </div>
            ))}
          </div>

          {/* 9. Cricket Score Widget (ODI 2) */}
          <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[28px] p-5 flex flex-col justify-between select-none hover:border-zinc-700 transition-colors">
            <div className="text-xs font-semibold text-zinc-400">ODI 2</div>

            <div className="space-y-3 my-auto">
              {/* IND */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-3 rounded-[2px] bg-gradient-to-b from-orange-500 via-white to-green-600 inline-block" />
                  <span className="text-xs font-bold text-white">IND</span>
                </div>
                <div className="text-xs font-bold text-white">
                  387/3 <span className="text-[10px] font-normal text-zinc-400">(49)</span>
                </div>
              </div>

              {/* AUS */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-3 rounded-[2px] bg-blue-800 inline-block relative overflow-hidden">
                    <span className="w-2 h-1.5 bg-red-600 block" />
                  </span>
                  <span className="text-xs font-bold text-white">AUS</span>
                </div>
                <div className="text-xs font-bold text-white">
                  200/6 <span className="text-[10px] font-normal text-zinc-400">(30)</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 text-center">
              AUS needs <span className="text-emerald-500 font-semibold">187</span> from{" "}
              <span className="text-emerald-500 font-semibold">120</span>
            </div>
          </div>

          {/* 10. World Clock Widget */}
          <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[28px] p-5 flex flex-col justify-between select-none hover:border-zinc-700 transition-colors">
            {/* City 1 */}
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Mumbai</span>
                {mumbaiIsDaytime ? (
                  <Sun className="w-4 h-4 text-zinc-200" />
                ) : (
                  <Moon className="w-4 h-4 text-zinc-200" />
                )}
              </div>
              <div className="text-xl font-bold text-white mt-1">
                {formatWorldTime(now, "Asia/Kolkata")}
              </div>
            </div>

            <div className="h-[1px] bg-zinc-800/80 w-full" />

            {/* City 2 */}
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Vancouver</span>
                {vancouverIsDaytime ? (
                  <Sun className="w-4 h-4 text-zinc-200" />
                ) : (
                  <Moon className="w-4 h-4 text-zinc-200" />
                )}
              </div>
              <div className="text-xl font-bold text-white mt-1">
                {formatWorldTime(now, "America/Vancouver")}
              </div>
            </div>
          </div>

          {/* 11. Mini Calendar Widget */}
          <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[28px] p-4 flex flex-col justify-between select-none hover:border-zinc-700 transition-colors">
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => {
                  setCalendarMonthOffset((month) => month - 1);
                  setSelectedCalendarDate(null);
                }}
                className="text-zinc-400 hover:text-white"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-white">
                {calendarDate?.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                }) ?? "---"}
              </span>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => {
                  setCalendarMonthOffset((month) => month + 1);
                  setSelectedCalendarDate(null);
                }}
                className="text-zinc-400 hover:text-white"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center text-[9px] mt-1">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
                <span key={idx} className="text-zinc-500 font-semibold">
                  {d}
                </span>
              ))}

              {Array.from({ length: calendarStartDay }).map((_, i) => (
                <span key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInCalendarMonth }, (_, i) => i + 1).map((day) => {
                const isSelected = selectedCalendarDate
                  ? selectedCalendarDate.getFullYear() === calendarDate?.getFullYear() &&
                    selectedCalendarDate.getMonth() === calendarDate?.getMonth() &&
                    selectedCalendarDate.getDate() === day
                  : isCurrentCalendarMonth && day === now?.getDate();
                return (
                  <button
                    type="button"
                    key={day}
                    aria-label={calendarDate ? `${calendarDate.toLocaleDateString("en-US", { month: "long" })} ${day}` : `Day ${day}`}
                    aria-pressed={isSelected}
                    onClick={() => {
                      if (calendarDate) {
                        setSelectedCalendarDate(
                          new Date(
                            calendarDate.getFullYear(),
                            calendarDate.getMonth(),
                            day,
                          ),
                        );
                      }
                    }}
                    className={`w-4 h-4 mx-auto flex items-center justify-center rounded-full text-[9px] font-medium ${
                      isSelected
                        ? "bg-white text-black font-bold"
                        : "text-zinc-300 hover:bg-zinc-800"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 12. Simple Temperature Card Widget */}
          <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[28px] p-5 flex flex-col items-center justify-center text-center select-none hover:border-zinc-700 transition-colors">
            <div className="text-[54px] leading-none font-bold text-white tracking-tight">
              29°
            </div>
            <div className="text-base font-semibold text-zinc-200 mt-3">
              Sunny
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              {now?.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }) ?? "---"}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}