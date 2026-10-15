import React from 'react';
import {
  Play,
  Square,
  Crosshair,
  Volume2,
  VolumeX,
  Keyboard,
  Clock,
  MousePointer,
  Repeat,
  MapPin,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ClickerConfig, ClickStats } from '../types/clicker';
import { SoundEffectType } from '../utils/audio';
import { getTotalIntervalMs } from '../utils/exporters';

interface ClickerWindowProps {
  config: ClickerConfig;
  stats: ClickStats;
  isRunning: boolean;
  isPickingCoordinate: boolean;
  soundType: SoundEffectType;
  soundVolume: number;
  onUpdateConfig: (partial: Partial<ClickerConfig>) => void;
  onStart: () => void;
  onStop: () => void;
  onPickCoordinate: () => void;
  onOpenHotkeyModal: () => void;
  onSoundTypeChange: (type: SoundEffectType) => void;
  onSoundVolumeChange: (vol: number) => void;
}

export const ClickerWindow: React.FC<ClickerWindowProps> = ({
  config,
  stats,
  isRunning,
  isPickingCoordinate,
  soundType,
  soundVolume,
  onUpdateConfig,
  onStart,
  onStop,
  onPickCoordinate,
  onOpenHotkeyModal,
  onSoundTypeChange,
  onSoundVolumeChange,
}) => {
  const totalInterval = getTotalIntervalMs(config);
  const theoreticalCPS = (1000 / totalInterval).toFixed(1);

  return (
    <div className="w-full max-w-xl mx-auto bg-[#140827] border-2 border-[#ff71ce] shadow-[0_0_25px_rgba(255,113,206,0.35)] select-none">
      {/* Vaporwave Windows 95 Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#ff71ce] via-[#b967ff] to-[#01cdfe] text-black font-extrabold text-xs tracking-wider">
        <div className="flex items-center gap-2">
          <span className="font-spacemono">⚡</span>
          <span>OP AUTO CLICKER v3.2 [VAPORWAVE EDITION]</span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px]">
          <span className="px-1.5 py-0.5 bg-black/20 text-black font-bold">
            {isRunning ? 'CLICKING ACTIVE' : 'SYSTEM IDLE'}
          </span>
          <div className="w-4 h-4 bg-[#c0c0c0] border border-black flex items-center justify-center font-bold text-black text-xs leading-none">
            _
          </div>
          <div className="w-4 h-4 bg-[#c0c0c0] border border-black flex items-center justify-center font-bold text-black text-xs leading-none">
            □
          </div>
          <div className="w-4 h-4 bg-[#c0c0c0] border border-black flex items-center justify-center font-bold text-black text-xs leading-none">
            ×
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3.5 text-slate-200 font-mono text-xs">
        {/* GROUP 1: CLICK INTERVAL */}
        <div className="border border-[#ff71ce]/50 p-3 bg-[#1d0b38]/70 relative">
          <div className="absolute -top-2.5 left-3 px-2 bg-[#140827] text-[#01cdfe] text-[11px] font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>CLICK INTERVAL</span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1">
            {/* Hours */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400">Hours</label>
              <input
                type="number"
                min="0"
                max="99"
                value={config.hours}
                onChange={(e) =>
                  onUpdateConfig({ hours: Math.max(0, parseInt(e.target.value) || 0) })
                }
                className="bg-[#0b0314] border border-[#ff71ce]/40 px-2 py-1 text-center font-bold text-[#fffb96] text-sm focus:border-[#01cdfe] focus:outline-hidden"
              />
            </div>
            {/* Mins */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400">Mins</label>
              <input
                type="number"
                min="0"
                max="59"
                value={config.minutes}
                onChange={(e) =>
                  onUpdateConfig({ minutes: Math.max(0, parseInt(e.target.value) || 0) })
                }
                className="bg-[#0b0314] border border-[#ff71ce]/40 px-2 py-1 text-center font-bold text-[#fffb96] text-sm focus:border-[#01cdfe] focus:outline-hidden"
              />
            </div>
            {/* Secs */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400">Secs</label>
              <input
                type="number"
                min="0"
                max="59"
                value={config.seconds}
                onChange={(e) =>
                  onUpdateConfig({ seconds: Math.max(0, parseInt(e.target.value) || 0) })
                }
                className="bg-[#0b0314] border border-[#ff71ce]/40 px-2 py-1 text-center font-bold text-[#fffb96] text-sm focus:border-[#01cdfe] focus:outline-hidden"
              />
            </div>
            {/* Milliseconds */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-[#ff71ce] font-bold">Milliseconds</label>
              <input
                type="number"
                min="1"
                max="9999"
                value={config.milliseconds}
                onChange={(e) =>
                  onUpdateConfig({
                    milliseconds: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
                className="bg-[#0b0314] border border-[#ff71ce] px-2 py-1 text-center font-bold text-[#05ffa1] text-sm focus:border-[#01cdfe] focus:outline-hidden shadow-[inset_0_0_6px_rgba(255,113,206,0.3)]"
              />
            </div>
          </div>

          {/* Quick Millisecond Presets & Calculated Rate */}
          <div className="mt-2.5 pt-2 border-t border-purple-900/60 flex items-center justify-between flex-wrap gap-2 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Speed:</span>
              <span className="text-[#05ffa1] font-bold">
                {theoreticalCPS} CPS
              </span>
              <span className="text-slate-500">({totalInterval}ms)</span>
            </div>
            <div className="flex items-center gap-1">
              {[10, 50, 100, 250, 500].map((ms) => (
                <button
                  key={ms}
                  onClick={() =>
                    onUpdateConfig({
                      hours: 0,
                      minutes: 0,
                      seconds: 0,
                      milliseconds: ms,
                    })
                  }
                  className={`px-1.5 py-0.5 text-[10px] border transition-colors ${
                    totalInterval === ms
                      ? 'bg-[#01cdfe] text-black border-[#01cdfe] font-bold'
                      : 'bg-[#2b104d] text-slate-300 border-purple-800 hover:border-[#ff71ce]'
                  }`}
                >
                  {ms}ms
                </button>
              ))}
            </div>
          </div>

          {/* Jitter variance toggle */}
          <div className="mt-2 flex items-center justify-between text-[11px] pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={config.jitter}
                onChange={(e) => onUpdateConfig({ jitter: e.target.checked })}
                className="accent-[#ff71ce] w-3.5 h-3.5"
              />
              <span>Humanizer Jitter (Random Variance)</span>
            </label>
            {config.jitter && (
              <div className="flex items-center gap-1.5 text-slate-400">
                <span>±</span>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={config.jitterRange}
                  onChange={(e) =>
                    onUpdateConfig({
                      jitterRange: Math.max(1, parseInt(e.target.value) || 10),
                    })
                  }
                  className="w-12 bg-[#0b0314] border border-[#ff71ce]/50 px-1 py-0.5 text-center text-[#fffb96] text-[11px]"
                />
                <span>ms</span>
              </div>
            )}
          </div>
        </div>

        {/* GROUP 2: CLICK OPTIONS */}
        <div className="border border-[#01cdfe]/50 p-3 bg-[#1d0b38]/70 relative">
          <div className="absolute -top-2.5 left-3 px-2 bg-[#140827] text-[#ff71ce] text-[11px] font-bold flex items-center gap-1">
            <MousePointer className="w-3.5 h-3.5" />
            <span>CLICK OPTIONS</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            {/* Mouse Button */}
            <div>
              <div className="text-[10px] text-slate-400 mb-1.5">Mouse button:</div>
              <div className="grid grid-cols-3 gap-1">
                {(['left', 'right', 'middle'] as const).map((btn) => (
                  <button
                    key={btn}
                    onClick={() => onUpdateConfig({ mouseButton: btn })}
                    className={`py-1 text-center capitalize text-xs border transition-colors ${
                      config.mouseButton === btn
                        ? 'bg-[#ff71ce] text-black border-[#ff71ce] font-bold shadow-[0_0_8px_rgba(255,113,206,0.5)]'
                        : 'bg-[#271044] text-slate-300 border-purple-800 hover:border-purple-600'
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>

            {/* Click Type */}
            <div>
              <div className="text-[10px] text-slate-400 mb-1.5">Click type:</div>
              <div className="grid grid-cols-3 gap-1">
                {(['single', 'double', 'triple'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => onUpdateConfig({ clickType: type })}
                    className={`py-1 text-center capitalize text-xs border transition-colors ${
                      config.clickType === type
                        ? 'bg-[#01cdfe] text-black border-[#01cdfe] font-bold shadow-[0_0_8px_rgba(1,205,254,0.5)]'
                        : 'bg-[#271044] text-slate-300 border-purple-800 hover:border-purple-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GROUP 3: CLICK REPEAT */}
        <div className="border border-[#b967ff]/50 p-3 bg-[#1d0b38]/70 relative">
          <div className="absolute -top-2.5 left-3 px-2 bg-[#140827] text-[#05ffa1] text-[11px] font-bold flex items-center gap-1">
            <Repeat className="w-3.5 h-3.5" />
            <span>CLICK REPEAT</span>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
              <input
                type="radio"
                name="repeatType"
                checked={config.repeatType === 'infinite'}
                onChange={() => onUpdateConfig({ repeatType: 'infinite' })}
                className="accent-[#05ffa1] w-3.5 h-3.5"
              />
              <span>Repeat until stopped</span>
            </label>

            <div className="flex items-center gap-2 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="radio"
                  name="repeatType"
                  checked={config.repeatType === 'count'}
                  onChange={() => onUpdateConfig({ repeatType: 'count' })}
                  className="accent-[#05ffa1] w-3.5 h-3.5"
                />
                <span>Repeat</span>
              </label>
              <input
                type="number"
                min="1"
                max="1000000"
                value={config.repeatCount}
                disabled={config.repeatType !== 'count'}
                onChange={(e) =>
                  onUpdateConfig({
                    repeatCount: Math.max(1, parseInt(e.target.value) || 100),
                  })
                }
                className="w-20 bg-[#0b0314] border border-[#b967ff]/60 px-2 py-0.5 text-center text-[#fffb96] font-bold disabled:opacity-40"
              />
              <span className="text-slate-400">times</span>

              {config.repeatType === 'count' && isRunning && (
                <span className="text-[11px] text-[#ff71ce] ml-auto">
                  [{stats.sessionClicks} / {config.repeatCount}]
                </span>
              )}
            </div>
          </div>
        </div>

        {/* GROUP 4: CURSOR POSITION */}
        <div className="border border-[#fffb96]/50 p-3 bg-[#1d0b38]/70 relative">
          <div className="absolute -top-2.5 left-3 px-2 bg-[#140827] text-[#fffb96] text-[11px] font-bold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>CURSOR POSITION</span>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white">
              <input
                type="radio"
                name="cursorPositionType"
                checked={config.cursorPositionType === 'current'}
                onChange={() => onUpdateConfig({ cursorPositionType: 'current' })}
                className="accent-[#fffb96] w-3.5 h-3.5"
              />
              <span>Current location (follows cursor dynamically)</span>
            </label>

            <div className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="radio"
                  name="cursorPositionType"
                  checked={config.cursorPositionType === 'picked'}
                  onChange={() => onUpdateConfig({ cursorPositionType: 'picked' })}
                  className="accent-[#fffb96] w-3.5 h-3.5"
                />
                <span>Pick location:</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[10px]">X:</span>
                <input
                  type="number"
                  value={config.targetX}
                  disabled={config.cursorPositionType !== 'picked'}
                  onChange={(e) =>
                    onUpdateConfig({ targetX: parseInt(e.target.value) || 0 })
                  }
                  className="w-16 bg-[#0b0314] border border-[#fffb96]/60 px-1 py-0.5 text-center text-[#01cdfe] font-bold disabled:opacity-40"
                />

                <span className="text-slate-400 text-[10px]">Y:</span>
                <input
                  type="number"
                  value={config.targetY}
                  disabled={config.cursorPositionType !== 'picked'}
                  onChange={(e) =>
                    onUpdateConfig({ targetY: parseInt(e.target.value) || 0 })
                  }
                  className="w-16 bg-[#0b0314] border border-[#fffb96]/60 px-1 py-0.5 text-center text-[#01cdfe] font-bold disabled:opacity-40"
                />

                <button
                  onClick={onPickCoordinate}
                  className={`px-2.5 py-1 text-[11px] font-bold flex items-center gap-1 border transition-all ${
                    isPickingCoordinate
                      ? 'bg-[#ff71ce] text-black border-[#ff71ce] animate-pulse'
                      : 'bg-[#371661] text-[#fffb96] border-[#fffb96]/60 hover:border-[#fffb96] hover:bg-[#481d7f]'
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  {isPickingCoordinate ? 'Click to Lock Target...' : 'Pick coordinate'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY ACTION BUTTONS (START / STOP / HOTKEY) */}
        <div className="pt-2 grid grid-cols-2 gap-3">
          {/* START BUTTON */}
          <button
            onClick={onStart}
            disabled={isRunning}
            className={`py-3 px-4 text-center font-extrabold text-sm uppercase flex items-center justify-center gap-2 border-2 transition-all ${
              isRunning
                ? 'bg-[#0f241d] border-[#05ffa1]/30 text-[#05ffa1]/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#05ffa1] to-[#01cdfe] text-black border-[#05ffa1] hover:brightness-110 active:translate-y-px shadow-[0_0_15px_rgba(5,255,161,0.4)]'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>START ({config.hotkey})</span>
          </button>

          {/* STOP BUTTON */}
          <button
            onClick={onStop}
            disabled={!isRunning}
            className={`py-3 px-4 text-center font-extrabold text-sm uppercase flex items-center justify-center gap-2 border-2 transition-all ${
              !isRunning
                ? 'bg-[#290d22] border-[#ff71ce]/30 text-[#ff71ce]/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#ff71ce] to-[#ff2a6d] text-white border-[#ff71ce] hover:brightness-110 active:translate-y-px shadow-[0_0_20px_rgba(255,113,206,0.6)] animate-pulse'
            }`}
          >
            <Square className="w-4 h-4 fill-current" />
            <span>STOP ({config.hotkey})</span>
          </button>
        </div>

        {/* UTILITY FOOTER: HOTKEY REBIND + SOUND + TELEMETRY */}
        <div className="pt-2 border-t border-purple-900/60 flex items-center justify-between flex-wrap gap-2 text-[11px]">
          {/* Hotkey configuration */}
          <button
            onClick={onOpenHotkeyModal}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#250d42] hover:bg-[#34135e] text-slate-300 border border-purple-800 transition-colors"
          >
            <Keyboard className="w-3.5 h-3.5 text-[#01cdfe]" />
            <span>Hotkey: </span>
            <span className="text-[#fffb96] font-bold">{config.hotkey}</span>
          </button>

          {/* Sound Effect Selector */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                onSoundTypeChange(soundType === 'muted' ? 'mechanical' : 'muted')
              }
              className="p-1 hover:text-[#ff71ce] text-slate-300"
              title="Toggle sound"
            >
              {soundType === 'muted' ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#05ffa1]" />
              )}
            </button>

            <select
              value={soundType}
              onChange={(e) => onSoundTypeChange(e.target.value as SoundEffectType)}
              className="bg-[#0b0314] border border-purple-800 text-slate-300 px-2 py-0.5 text-[11px] focus:outline-hidden"
            >
              <option value="mechanical">Cherry MX Switch</option>
              <option value="retro-beep">8-Bit Arcade Beep</option>
              <option value="synth-blip">Synth Pop</option>
              <option value="vapor-chime">Vaporwave Chime</option>
              <option value="muted">Muted</option>
            </select>

            {soundType !== 'muted' && (
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={soundVolume}
                onChange={(e) => onSoundVolumeChange(parseFloat(e.target.value))}
                className="w-16 accent-[#ff71ce] h-1"
                title="Volume"
              />
            )}
          </div>
        </div>

        {/* STATUS BAR */}
        <div className="bg-[#0b0314] border border-purple-900 px-2.5 py-1 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isRunning
                  ? 'bg-[#05ffa1] shadow-[0_0_8px_#05ffa1]'
                  : 'bg-slate-600'
              }`}
            />
            <span className={isRunning ? 'text-[#05ffa1] font-bold' : ''}>
              {isRunning
                ? `ACTIVE // ${stats.activeCPS} CPS`
                : 'READY // PRESS HOTKEY TO LAUNCH'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span>Session: {stats.sessionClicks}</span>
            <span>Total: {stats.totalClicksExecuted}</span>
            <span>Peak: {stats.peakCPS} CPS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
