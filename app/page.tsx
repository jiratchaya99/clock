"use client";

import React, { useState, useEffect, useRef } from "react";
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
  AlarmClock,
  Timer,
  LayoutGrid,
  Plus,
  Trash2,
  BellRing,
  X,
} from "lucide-react";

interface AlarmItem {
  id: number;
  time: string;
  label: string;
  enabled: boolean;
}

export default function FullScreenMobilePage() {
  const [activeTab, setActiveTab] = useState<"home" | "alarm" | "timer">("home");
  const [now, setNow] = useState<Date>(new Date());

  // ==================== ALARM STATE ====================
  const [alarms, setAlarms] = useState<AlarmItem[]>([
    { id: 1, time: "07:00", label: "ตื่นนอน / ไปทำงาน", enabled: true },
    { id: 2, time: "08:30", label: "ประชุมทีมเช้า", enabled: false },
  ]);
  const [newAlarmTime, setNewAlarmTime] = useState("09:00");
  const [newAlarmLabel, setNewAlarmLabel] = useState("");
  const [showAddAlarm, setShowAddAlarm] = useState(false);
  const [ringingMessage, setRingingMessage] = useState<string | null>(null);
  const lastTriggeredMinuteRef = useRef<string>("");

  // ==================== COUNTDOWN TIMER STATE ====================
  const [timerInputMin, setTimerInputMin] = useState(1);
  const [timerInputSec, setTimerInputSec] = useState(0);
  const [timerRemainingSec, setTimerRemainingSec] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // ==================== STOPWATCH WIDGET STATE ====================
  const [swTime, setSwTime] = useState(0);
  const [isSwRunning, setIsSwRunning] = useState(false);

  const playBeepSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // ข้ามหากเบราว์เซอร์บล็อกเสียงอัตโนมัติ
    }
  };

  useEffect(() => {
    const clockInterval = setInterval(() => {
      const current = new Date();
      setNow(current);

      const hh = current.getHours().toString().padStart(2, "0");
      const mm = current.getMinutes().toString().padStart(2, "0");
      const ss = current.getSeconds();
      const currentHHMM = `${hh}:${mm}`;

      if (ss === 0 && lastTriggeredMinuteRef.current !== currentHHMM) {
        const matchedAlarm = alarms.find((a) => a.enabled && a.time === currentHHMM);
        if (matchedAlarm) {
          lastTriggeredMinuteRef.current = currentHHMM;
          setRingingMessage(`ปลุก: ${matchedAlarm.label || matchedAlarm.time}`);
          playBeepSound();
        }
      }
    }, 1000);

    return () => clearInterval(clockInterval);
  }, [alarms]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerRemainingSec > 0) {
      interval = setInterval(() => {
        setTimerRemainingSec((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setRingingMessage("หมดเวลาที่ตั้งไว้แล้ว!");
            playBeepSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerRemainingSec]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSwRunning) {
      interval = setInterval(() => {
        setSwTime((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isSwRunning]);

  const statusBarTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const secondsDeg = now.getSeconds() * 6;
  const minutesDeg = now.getMinutes() * 6 + now.getSeconds() * 0.1;
  const hoursDeg = ((now.getHours() % 12) + now.getMinutes() / 60) * 30;

  const formatStopwatch = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleAddAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlarmTime) return;
    setAlarms((prev) => [
      ...prev,
      {
        id: Date.now(),
        time: newAlarmTime,
        label: newAlarmLabel.trim() || "นาฬิกาปลุก",
        enabled: true,
      },
    ]);
    setNewAlarmLabel("");
    setShowAddAlarm(false);
  };

  const toggleAlarm = (id: number) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const deleteAlarm = (id: number) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  const applyTimerPreset = (mins: number, secs: number = 0) => {
    setIsTimerRunning(false);
    setTimerInputMin(mins);
    setTimerInputSec(secs);
    setTimerRemainingSec(mins * 60 + secs);
  };

  const activeAlarmCount = alarms.filter((a) => a.enabled).length;

  return (
    <div className="min-h-screen w-full max-w-[430px] mx-auto flex flex-col bg-[#09090b]/80 pb-24">
      {/* ==================== TOP STATUS BAR ==================== */}
      <header className="sticky top-0 z-30 bg-[#09090b]/90 backdrop-blur-md pt-3 pb-2.5 px-5 flex items-center justify-between text-xs font-semibold text-white select-none">
        <span className="w-12">{statusBarTime}</span>

        {/* Pill แสดงสถานะปลุกหรือ Timer กำลังเดิน */}
        <button
          onClick={() => setActiveTab(isTimerRunning ? "timer" : "alarm")}
          className="h-6 px-3 bg-zinc-900 rounded-full border border-zinc-800 flex items-center justify-center gap-2 transition-colors hover:border-zinc-700"
        >
          {isTimerRunning ? (
            <>
              <Timer className="w-3 h-3 text-amber-400 animate-pulse" />
              <span className="text-[11px] font-bold text-amber-400">
                {formatTimer(timerRemainingSec)}
              </span>
            </>
          ) : activeAlarmCount > 0 ? (
            <>
              <AlarmClock className="w-3 h-3 text-emerald-400" />
              <span className="text-[11px] text-zinc-300">{activeAlarmCount} ปลุก</span>
            </>
          ) : (
            <span className="text-[11px] text-zinc-400">Wigggle UI</span>
          )}
        </button>

        <div className="flex items-center gap-1.5 w-12 justify-end">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4" />
        </div>
      </header>

      {/* ==================== RINGING ALERT BANNER ==================== */}
      {ringingMessage && (
        <div className="mx-4 mt-2 p-3 rounded-2xl bg-red-500 text-white flex items-center justify-between shadow-lg animate-bounce z-30">
          <div className="flex items-center gap-2.5">
            <BellRing className="w-5 h-5 animate-ping" />
            <div>
              <div className="text-xs font-bold">{ringingMessage}</div>
              <div className="text-[10px] text-red-100">แตะปุ่มปิดเพื่อหยุดแจ้งเตือน</div>
            </div>
          </div>
          <button
            onClick={() => setRingingMessage(null)}
            className="bg-white text-red-600 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-zinc-100"
          >
            ปิด
          </button>
        </div>
      )}

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1 px-4 pt-3">
        {/* -------------------- TAB 1: HOME WIDGETS -------------------- */}
        {activeTab === "home" && (
          <>
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                <span className="w-3.5 h-3.5 rounded-[4px] border border-white inline-block" />
                <span>Wigggle UI</span>
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-white mt-0.5">
                Widgets & Clock
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* 1. Date Card Widget */}
              <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[26px] p-4 flex flex-col items-center justify-center select-none">
                <div className="text-sm font-semibold tracking-wide mb-0.5">
                  <span className="text-[#ef4444]">
                    {now.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>{" "}
                  <span className="text-zinc-200">
                    {now.toLocaleDateString("en-US", { month: "short" })}
                  </span>
                </div>
                <div className="text-[62px] leading-none font-bold tracking-tight text-white">
                  {now.getDate().toString().padStart(2, "0")}
                </div>
              </div>

              {/* 2. Quick Alarm Shortcut Card */}
              <div
                onClick={() => setActiveTab("alarm")}
                className="cursor-pointer aspect-square bg-[#111113] border border-[#222225] hover:border-zinc-700 rounded-[26px] p-4 flex flex-col justify-between select-none transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">นาฬิกาปลุก</span>
                  <AlarmClock className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {alarms.find((a) => a.enabled)?.time || "--:--"}
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {alarms.find((a) => a.enabled)?.label || "ไม่มีปลุกที่เปิดอยู่"}
                  </div>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">
                  แตะเพื่อตั้งเวลาปลุก →
                </div>
              </div>

              {/* 3. Live Analog Clock Widget */}
              <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[26px] p-3.5 flex items-center justify-center select-none">
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
                          className="inline-block text-[10px] font-semibold text-zinc-300"
                          style={{ transform: `rotate(-${angle}deg)` }}
                        >
                          {num}
                        </span>
                      </div>
                    );
                  })}
                  <div
                    className="absolute w-1.5 h-9 bg-white rounded-full origin-bottom bottom-1/2"
                    style={{ transform: `rotate(${hoursDeg}deg)` }}
                  />
                  <div
                    className="absolute w-1 h-12 bg-zinc-300 rounded-full origin-bottom bottom-1/2"
                    style={{ transform: `rotate(${minutesDeg}deg)` }}
                  />
                  <div
                    className="absolute w-[1.5px] h-14 bg-red-500 rounded-full origin-bottom bottom-1/2"
                    style={{ transform: `rotate(${secondsDeg}deg)` }}
                  />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 border-2 border-[#111113] z-10" />
                </div>
              </div>

              {/* 4. Stopwatch Dial Widget */}
              <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[26px] p-3.5 flex flex-col items-center justify-between select-none relative">
                <div className="relative w-28 h-28 rounded-full border border-zinc-800 flex items-center justify-center mt-0.5">
                  {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n, idx) => {
                    const deg = idx * 30;
                    return (
                      <div
                        key={n}
                        className="absolute inset-0.5 text-center"
                        style={{ transform: `rotate(${deg}deg)` }}
                      >
                        <span
                          className="inline-block text-[8px] text-zinc-400"
                          style={{ transform: `rotate(-${deg}deg)` }}
                        >
                          {n}
                        </span>
                      </div>
                    );
                  })}
                  <div
                    className="absolute w-[1.5px] h-10 bg-red-500 origin-bottom bottom-1/2"
                    style={{ transform: `rotate(${(swTime / 1000) * 6}deg)` }}
                  />
                  <div className="bg-[#111113] px-1.5 rounded text-xs font-bold tracking-wider text-white z-10 mt-5">
                    {formatStopwatch(swTime)}
                  </div>
                </div>

                <div className="w-full flex items-center justify-between px-0.5 -mt-3 z-20">
                  <button
                    onClick={() => {
                      setIsSwRunning(false);
                      setSwTime(0);
                    }}
                    aria-label="Reset Stopwatch"
                    className="w-7 h-7 rounded-full bg-zinc-800/90 hover:bg-zinc-700 flex items-center justify-center text-zinc-300"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsSwRunning(!isSwRunning)}
                    aria-label="Start Stopwatch"
                    className="w-7 h-7 rounded-full bg-white hover:bg-zinc-200 flex items-center justify-center text-black"
                  >
                    {isSwRunning ? (
                      <Pause className="w-3.5 h-3.5 fill-black" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 5. Stock Ticker Widget (META) */}
              <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[26px] p-4 flex flex-col justify-between select-none">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold tracking-tight text-white">732.17</span>
                    <span className="text-emerald-500 text-base">▲</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium text-emerald-500 mt-0.5">
                    <span>+2.76</span>
                    <span>+0.47%</span>
                  </div>
                </div>
                <div>
                  <div className="text-base font-bold text-white tracking-wide">META</div>
                  <div className="text-[11px] text-zinc-400 truncate">Meta Platforms Inc</div>
                </div>
              </div>

              {/* 6. Detailed Weather Widget (Mumbai) */}
              <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[26px] p-3.5 flex flex-col justify-between select-none">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Mumbai</div>
                    <div className="text-[10px] text-zinc-400">Feels Like 36°</div>
                  </div>
                  <div className="text-xl font-bold text-white">35°</div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-200 px-0.5">
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
                      <Sun className="w-3 h-3 text-amber-400" />
                      <span className="text-[9px] font-medium text-zinc-300">{temp}°</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Live Football Score Widget */}
              <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[26px] p-4 flex flex-col justify-between select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-medium text-zinc-300">Live</span>
                </div>

                <div className="flex items-center justify-between px-0.5 my-auto">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-9 h-9 rounded-full bg-[#fde047] text-black font-black text-[10px] flex flex-col items-center justify-center leading-none border border-black">
                      <span>BVB</span>
                      <span className="text-[7px]">09</span>
                    </div>
                    <span className="text-xl font-bold text-white">4</span>
                  </div>
                  <div className="bg-zinc-800/80 text-zinc-300 text-[10px] font-semibold px-2 py-0.5 rounded -mt-5">
                    34&apos;
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-9 h-9 rounded-full bg-[#6cabdd] text-white font-bold text-[9px] flex items-center justify-center border border-white">
                      MCI
                    </div>
                    <span className="text-xl font-bold text-white">4</span>
                  </div>
                </div>
                <div className="text-center text-[11px] font-medium text-zinc-400">UCL Final</div>
              </div>

              {/* 8. Stock Chart Widget (AAPL) */}
              <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[26px] p-4 flex flex-col justify-between select-none overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-red-500 text-xs">▼</span>
                    <span className="text-sm font-bold text-white">AAPL</span>
                  </div>
                  <span className="text-xs font-semibold text-red-500">-4.26</span>
                </div>

                <div className="w-full h-14 my-0.5">
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

                <div className="text-right text-xl font-bold text-white tracking-tight">262.24</div>
              </div>

              {/* 9. World Clock Widget */}
              <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[26px] p-4 flex flex-col justify-between select-none">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Mumbai</span>
                    <Sun className="w-3.5 h-3.5 text-zinc-200" />
                  </div>
                  <div className="text-lg font-bold text-white mt-0.5">8:15 AM</div>
                </div>
                <div className="h-[1px] bg-zinc-800/80 w-full" />
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Vancouver</span>
                    <Moon className="w-3.5 h-3.5 text-zinc-200" />
                  </div>
                  <div className="text-lg font-bold text-white mt-0.5">6:45 PM</div>
                </div>
              </div>

              {/* 10. Mini Calendar Widget */}
              <div className="aspect-square bg-[#111113] border border-[#222225] rounded-[26px] p-3.5 flex flex-col justify-between select-none">
                <div className="flex items-center justify-between px-0.5">
                  <ChevronLeft className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[11px] font-bold text-white">Nov 2025</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <div className="grid grid-cols-7 gap-y-0.5 text-center text-[8px]">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
                    <span key={idx} className="text-zinc-500 font-semibold">{d}</span>
                  ))}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                    <span
                      key={day}
                      className={`w-4 h-4 mx-auto flex items-center justify-center rounded-full text-[8px] ${
                        day === 4 ? "bg-white text-black font-bold" : "text-zinc-300"
                      }`}
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* -------------------- TAB 2: ALARM CLOCK APP -------------------- */}
        {activeTab === "alarm" && (
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">นาฬิกาปลุก</h2>
                <p className="text-xs text-zinc-400">
                  เวลาปัจจุบัน{" "}
                  {now.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </p>
              </div>
              <button
                onClick={() => setShowAddAlarm(!showAddAlarm)}
                className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-colors"
                aria-label="เพิ่มเวลาปลุก"
              >
                {showAddAlarm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
            </div>

            {showAddAlarm && (
              <form
                onSubmit={handleAddAlarm}
                className="bg-[#161619] border border-zinc-800 rounded-2xl p-4 space-y-3"
              >
                <div className="text-xs font-semibold text-zinc-300">ตั้งเวลาปลุกใหม่</div>
                <input
                  type="time"
                  value={newAlarmTime}
                  onChange={(e) => setNewAlarmTime(e.target.value)}
                  required
                  className="w-full bg-[#09090b] border border-zinc-700 rounded-xl px-3 py-2 text-2xl font-bold text-white text-center focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="ป้ายกำกับ (เช่น ตื่นนอน, กินยา)"
                  value={newAlarmLabel}
                  onChange={(e) => setNewAlarmLabel(e.target.value)}
                  className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs py-2.5 rounded-xl transition-colors"
                >
                  บันทึกเวลาปลุก
                </button>
              </form>
            )}

            <div className="space-y-2.5">
              {alarms.length === 0 ? (
                <div className="text-center py-12 text-xs text-zinc-500">
                  ยังไม่มีรายการนาฬิกาปลุก กดปุ่ม + ด้านบนเพื่อเพิ่ม
                </div>
              ) : (
                alarms.map((alarm) => (
                  <div
                    key={alarm.id}
                    className={`bg-[#111113] border rounded-2xl p-4 flex items-center justify-between transition-colors ${
                      alarm.enabled ? "border-zinc-700" : "border-[#1f1f22] opacity-60"
                    }`}
                  >
                    <div>
                      <div className="text-3xl font-bold tracking-tight text-white">
                        {alarm.time}
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">{alarm.label}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleAlarm(alarm.id)}
                        aria-label="Toggle Alarm"
                        className={`w-12 h-7 rounded-full p-1 transition-colors ${
                          alarm.enabled ? "bg-emerald-500" : "bg-zinc-700"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            alarm.enabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => deleteAlarm(alarm.id)}
                        aria-label="Delete Alarm"
                        className="text-zinc-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => {
                setRingingMessage("ทดสอบเสียงนาฬิกาปลุก!");
                playBeepSound();
              }}
              className="w-full py-2.5 rounded-xl border border-zinc-800 text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              ทดสอบเสียงปลุก
            </button>
          </div>
        )}

        {/* -------------------- TAB 3: COUNTDOWN TIMER APP -------------------- */}
        {activeTab === "timer" && (
          <div className="space-y-5 pt-1">
            <div>
              <h2 className="text-xl font-bold text-white">ตัวนับเวลาถอยหลัง</h2>
              <p className="text-xs text-zinc-400">ตั้งเวลาถอยหลังพร้อมเสียงแจ้งเตือน</p>
            </div>

            <div className="bg-[#111113] border border-[#222225] rounded-3xl p-6 flex flex-col items-center justify-center">
              <div className="w-48 h-48 rounded-full border-4 border-zinc-800 flex flex-col items-center justify-center relative">
                <span className="text-4xl font-extrabold tracking-wider text-white">
                  {formatTimer(timerRemainingSec)}
                </span>
                <span className="text-xs text-zinc-400 mt-1">
                  {isTimerRunning ? "กำลังนับถอยหลัง..." : "พร้อมทำงาน"}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-6 w-full">
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerRemainingSec(timerInputMin * 60 + timerInputSec);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
                >
                  รีเซ็ต
                </button>
                <button
                  onClick={() => {
                    if (timerRemainingSec > 0) setIsTimerRunning(!isTimerRunning);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isTimerRunning
                      ? "bg-amber-500 hover:bg-amber-400 text-black"
                      : "bg-emerald-500 hover:bg-emerald-400 text-black"
                  }`}
                >
                  {isTimerRunning ? "หยุดชั่วคราว" : "เริ่มจับเวลา"}
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-zinc-400 mb-2">ตั้งเวลาด่วน</div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "10 วิ", m: 0, s: 10 },
                  { label: "1 นาที", m: 1, s: 0 },
                  { label: "5 นาที", m: 5, s: 0 },
                  { label: "15 นาที", m: 15, s: 0 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => applyTimerPreset(preset.m, preset.s)}
                    className="py-2 rounded-xl bg-[#111113] border border-zinc-800 hover:border-zinc-600 text-xs font-medium text-zinc-200 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#111113] border border-[#222225] rounded-2xl p-4">
              <div className="text-xs font-semibold text-zinc-400 mb-2">กำหนดเวลาเอง</div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-[10px] text-zinc-500 block mb-1">นาที</label>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={timerInputMin}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value));
                      applyTimerPreset(val, timerInputSec);
                    }}
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-3 py-1.5 text-sm font-bold text-white text-center"
                  />
                </div>
                <span className="text-lg font-bold text-zinc-500 mt-4">:</span>
                <div className="flex-1">
                  <label className="text-[10px] text-zinc-500 block mb-1">วินาที</label>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={timerInputSec}
                    onChange={(e) => {
                      const val = Math.min(59, Math.max(0, Number(e.target.value)));
                      applyTimerPreset(timerInputMin, val);
                    }}
                    className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-3 py-1.5 text-sm font-bold text-white text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==================== FIXED BOTTOM NAVIGATION BAR ==================== */}
      <nav className="fixed bottom-0 inset-x-0 max-w-[430px] mx-auto bg-[#0d0d10]/95 backdrop-blur-md border-t border-zinc-800/80 py-2.5 px-6 flex items-center justify-around z-30">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === "home" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-medium">หน้าหลัก</span>
        </button>

        <button
          onClick={() => setActiveTab("alarm")}
          className={`flex flex-col items-center gap-1 transition-colors relative ${
            activeTab === "alarm" ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <AlarmClock className="w-5 h-5" />
          <span className="text-[10px] font-medium">นาฬิกาปลุก</span>
          {activeAlarmCount > 0 && (
            <span className="absolute -top-0.5 right-1 w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("timer")}
          className={`flex flex-col items-center gap-1 transition-colors relative ${
            activeTab === "timer" ? "text-amber-400" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Timer className="w-5 h-5" />
          <span className="text-[10px] font-medium">จับเวลา</span>
          {isTimerRunning && (
            <span className="absolute -top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>
      </nav>
    </div>
  );
}