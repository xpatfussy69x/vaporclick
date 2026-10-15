import React, { useState, useEffect } from 'react';
import {
  Gauge,
  Activity,
  RefreshCw,
  Grid,
} from 'lucide-react';
import { ClickStats } from '../types/clicker';

interface TestingSandboxProps {
  stats: ClickStats;
  isRunning: boolean;
  onSetCoordinates: (x: number, y: number) => void;
  onResetStats: () => void;
}

type SandboxTab = 'benchmark' | 'pixelpad';

export const TestingSandbox: React.FC<TestingSandboxProps> = ({
  stats,
  isRunning,
  onResetStats,
}) => {
  const [activeTab, setActiveTab] = useState<SandboxTab>('benchmark');

  // Benchmark rolling history
  const [cpsHistory, setCpsHistory] = useState<number[]>(new Array(24).fill(0));

  // Pixel Pad
  const [gridPixels, setGridPixels] = useState<boolean[]>(new Array(48).fill(false));

  // Update CPS history chart
  useEffect(() => {
    setCpsHistory((prev) => [...prev.slice(1), stats.activeCPS]);
  }, [stats.activeCPS]);

  // Toggle pixel pad cell
  const handlePixelClick = (index: number) => {
    setGridPixels((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  // Tier calculation based on CPS
  const getCPSTier = (cps: number) => {
    if (cps >= 200) return { title: 'LIGHTSPEED MAX', color: '#ff71ce' };
    if (cps >= 60) return { title: 'CYBER OVERCLOCK', color: '#01cdfe' };
    if (cps >= 25) return { title: 'TURBO FAST', color: '#05ffa1' };
    if (cps >= 10) return { title: 'PRO GAMER', color: '#fffb96' };
    if (cps >= 1) return { title: 'CASUAL CLICKER', color: '#b967ff' };
    return { title: 'IDLE / READY', color: '#94a3b8' };
  };

  const currentTier = getCPSTier(stats.activeCPS);

  return (
    <div className="w-full max-w-xl mx-auto bg-[#140827] border-2 border-[#01cdfe] shadow-[0_0_25px_rgba(1,205,254,0.35)] select-none">
      {/* Vaporwave Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#01cdfe] via-[#b967ff] to-[#ff71ce] text-black font-extrabold text-xs tracking-wider">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          <span>VAPOR TEST ARENA // LIVE BENCHMARK</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] bg-black/20 text-black px-1 font-bold">
            60 FPS SYNC
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#01cdfe]/40 bg-[#190933] text-xs font-mono">
        <button
          onClick={() => setActiveTab('benchmark')}
          className={`flex-1 py-2 px-3 text-center border-r border-[#01cdfe]/20 font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'benchmark'
              ? 'bg-[#01cdfe] text-black'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>CPS Speedometer</span>
        </button>

        <button
          onClick={() => setActiveTab('pixelpad')}
          className={`flex-1 py-2 px-3 text-center font-bold flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'pixelpad'
              ? 'bg-[#fffb96] text-black'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Pixel Pad</span>
        </button>
      </div>

      {/* TAB 1: BENCHMARK SPEEDOMETER */}
      {activeTab === 'benchmark' && (
        <div className="p-4 space-y-4 font-mono text-xs text-slate-200">
          <div className="grid grid-cols-3 gap-3 text-center">
            {/* Live CPS */}
            <div className="bg-[#1e0c38] border border-[#01cdfe]/40 p-3 relative overflow-hidden">
              <div className="text-[10px] text-slate-400">ACTIVE SPEED</div>
              <div className="text-3xl font-extrabold text-[#01cdfe] pt-1">
                {stats.activeCPS}
              </div>
              <div className="text-[10px] text-slate-500">CLICKS / SEC</div>
            </div>

            {/* Peak CPS */}
            <div className="bg-[#1e0c38] border border-[#ff71ce]/40 p-3">
              <div className="text-[10px] text-slate-400">PEAK RECORD</div>
              <div className="text-3xl font-extrabold text-[#ff71ce] pt-1">
                {stats.peakCPS}
              </div>
              <div className="text-[10px] text-slate-500">MAX CPS</div>
            </div>

            {/* Total Clicks */}
            <div className="bg-[#1e0c38] border border-[#05ffa1]/40 p-3">
              <div className="text-[10px] text-slate-400">REGISTERED</div>
              <div className="text-3xl font-extrabold text-[#05ffa1] pt-1">
                {stats.totalClicksExecuted}
              </div>
              <div className="text-[10px] text-slate-500">TOTAL HITS</div>
            </div>
          </div>

          {/* Speedometer Gauge Bar */}
          <div className="bg-[#0b0314] border border-purple-900/80 p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">RATING TIER:</span>
              <span
                className="font-extrabold tracking-wider"
                style={{ color: currentTier.color }}
              >
                ★ {currentTier.title} ★
              </span>
            </div>

            {/* Progress meter */}
            <div className="h-4 bg-[#1b0933] border border-purple-800 p-0.5 relative overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#05ffa1] via-[#01cdfe] to-[#ff71ce] transition-all duration-150"
                style={{
                  width: `${Math.min(100, (stats.activeCPS / 100) * 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>0 CPS</span>
              <span>25 CPS</span>
              <span>50 CPS</span>
              <span>75 CPS</span>
              <span>100+ CPS (MAX)</span>
            </div>
          </div>

          {/* Real-time CPS Rolling Chart */}
          <div className="bg-[#0b0314] border border-purple-900/80 p-3">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
              <span>REAL-TIME CPS TELEMETRY (ROLLING)</span>
              <span>1000ms WINDOW</span>
            </div>

            <div className="h-20 flex items-end gap-1 pt-2">
              {cpsHistory.map((val, i) => {
                const maxVal = Math.max(10, ...cpsHistory);
                const heightPercent = Math.max(4, (val / maxVal) * 100);
                return (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-[#ff71ce] to-[#01cdfe] hover:brightness-125 transition-all"
                    style={{ height: `${heightPercent}%` }}
                    title={`${val} CPS`}
                  />
                );
              })}
            </div>
          </div>

          {/* Reset Action */}
          <div className="flex justify-between items-center pt-1">
            <span className="text-[10px] text-slate-400">
              Session active: {stats.elapsedSeconds}s
            </span>
            <button
              onClick={onResetStats}
              className="px-3 py-1 bg-[#2b104d] hover:bg-[#3d176d] border border-purple-800 text-[11px] text-slate-300 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Benchmark Counters</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: PIXEL PAD */}
      {activeTab === 'pixelpad' && (
        <div className="p-4 space-y-3 font-mono text-xs text-slate-200">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              Pixels toggle on click. Point your auto clicker here to draw!
            </span>
            <button
              onClick={() => setGridPixels(new Array(48).fill(false))}
              className="text-[#ff71ce] hover:underline"
            >
              Clear Pad
            </button>
          </div>

          <div className="grid grid-cols-12 gap-1 bg-[#090212] p-2 border border-purple-900">
            {gridPixels.map((active, i) => (
              <div
                key={i}
                onClick={() => handlePixelClick(i)}
                className={`aspect-square border cursor-pointer transition-colors ${
                  active
                    ? 'bg-[#ff71ce] border-[#ff71ce] shadow-[0_0_6px_#ff71ce]'
                    : 'bg-[#190933] border-purple-950 hover:border-[#01cdfe]'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
