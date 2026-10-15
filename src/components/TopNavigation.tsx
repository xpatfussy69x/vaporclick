import React from 'react';
import { Play, Square, Tv, Volume2, VolumeX } from 'lucide-react';
import { SoundEffectType } from '../utils/audio';

interface TopNavigationProps {
  activeView: 'clicker' | 'sandbox' | 'macro' | 'export';
  onSelectView: (view: 'clicker' | 'sandbox' | 'macro' | 'export') => void;
  isRunning: boolean;
  hotkey: string;
  onToggleClicking: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  soundType: SoundEffectType;
  onToggleMute: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeView,
  onSelectView,
  isRunning,
  hotkey,
  onToggleClicking,
  crtEnabled,
  onToggleCrt,
  soundType,
  onToggleMute,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-purple-900/60 bg-[#0e041d]/90 backdrop-blur-md sticky top-0 z-40 select-none">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xl font-extrabold tracking-widest bg-gradient-to-r from-[#ff71ce] via-[#b967ff] to-[#01cdfe] bg-clip-text text-transparent whitespace-nowrap font-mono">
          VAPOR CLICKER
        </span>
        <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 bg-[#ff71ce]/20 text-[#ff71ce] font-mono border border-[#ff71ce]/40 font-bold">
          AUTO CLICKER
        </span>
      </div>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-medium text-slate-300">
        <button
          onClick={() => onSelectView('clicker')}
          className={`hover:text-[#01cdfe] transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'clicker'
              ? 'text-[#01cdfe] font-bold underline underline-offset-4'
              : ''
          }`}
        >
          Auto Clicker
        </button>
        <button
          onClick={() => onSelectView('sandbox')}
          className={`hover:text-[#ff71ce] transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'sandbox'
              ? 'text-[#ff71ce] font-bold underline underline-offset-4'
              : ''
          }`}
        >
          CPS Benchmark
        </button>
        <button
          onClick={() => onSelectView('macro')}
          className={`hover:text-[#b967ff] transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'macro'
              ? 'text-[#b967ff] font-bold underline underline-offset-4'
              : ''
          }`}
        >
          Macro Recorder
        </button>
        <button
          onClick={() => onSelectView('export')}
          className={`hover:text-[#05ffa1] transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'export'
              ? 'text-[#05ffa1] font-bold underline underline-offset-4'
              : ''
          }`}
        >
          Export Scripts
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        {/* CRT Scanline Toggle */}
        <button
          onClick={onToggleCrt}
          className={`p-1.5 border transition-colors ${
            crtEnabled
              ? 'bg-[#01cdfe] text-black border-[#01cdfe]'
              : 'bg-[#1b0a33] text-slate-400 border-purple-800 hover:text-white'
          }`}
          title="Toggle CRT Scanlines"
        >
          <Tv className="w-4 h-4" />
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={onToggleMute}
          className={`p-1.5 border transition-colors ${
            soundType !== 'muted'
              ? 'bg-[#ff71ce] text-black border-[#ff71ce]'
              : 'bg-[#1b0a33] text-slate-400 border-purple-800 hover:text-white'
          }`}
          title="Toggle Audio Feedback"
        >
          {soundType !== 'muted' ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Primary Toggle Button */}
        <button
          onClick={onToggleClicking}
          className={`px-4 py-1.5 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 border whitespace-nowrap shrink-0 ${
            isRunning
              ? 'bg-gradient-to-r from-[#ff71ce] to-[#ff2a6d] text-white border-[#ff71ce] shadow-[0_0_15px_rgba(255,113,206,0.6)] animate-pulse'
              : 'bg-gradient-to-r from-[#05ffa1] to-[#01cdfe] text-black border-[#05ffa1] hover:brightness-110 shadow-[0_0_12px_rgba(5,255,161,0.4)]'
          }`}
        >
          {isRunning ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop [{hotkey}]</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start [{hotkey}]</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
