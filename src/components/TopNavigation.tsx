import React from 'react';
import {
  Play,
  Square,
  Tv,
  Volume2,
  VolumeX,
  Monitor,
  HelpCircle,
} from 'lucide-react';
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
  onOpenPCGuide: () => void;
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
  onOpenPCGuide,
}) => {
  return (
    <header className="flex items-center justify-between gap-4 px-4 md:px-6 py-2.5 border-b border-purple-900/60 bg-[#0e041d]/95 backdrop-blur-md sticky top-0 z-40 select-none">
      {/* Zone 1: Wordmark & PC Badge */}
      <div className="flex items-center gap-2.5 shrink-0">
        <span className="text-lg md:text-xl font-extrabold tracking-widest bg-gradient-to-r from-[#ff71ce] via-[#b967ff] to-[#01cdfe] bg-clip-text text-transparent whitespace-nowrap font-mono">
          VAPOR CLICKER
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-[#01cdfe]/20 text-[#01cdfe] font-mono border border-[#01cdfe]/40 font-bold rounded">
          <Monitor className="w-3 h-3" />
          <span>PC EDITION</span>
        </span>
      </div>

      {/* Zone 2: Navigation Links */}
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

      {/* Zone 3: Actions & Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* PC Guide & Diagnostics Button */}
        <button
          onClick={onOpenPCGuide}
          className="p-1.5 md:px-2.5 md:py-1 rounded border bg-[#1b0a33] text-cyan-300 border-purple-800 hover:text-white hover:bg-[#250d45] transition flex items-center gap-1.5 text-xs font-mono"
          title="PC Windows Guide & Uninstaller Info"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#01cdfe]" />
          <span className="hidden sm:inline text-[11px]">PC Guide & Uninstall</span>
        </button>

        {/* CRT Scanline Toggle */}
        <button
          onClick={onToggleCrt}
          className={`p-1.5 rounded border transition-colors ${
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
          className={`p-1.5 rounded border transition-colors ${
            soundType !== 'muted'
              ? 'bg-[#ff71ce] text-black border-[#ff71ce]'
              : 'bg-[#1b0a33] text-slate-400 border-purple-800 hover:text-white'
          }`}
          title="Toggle Audio Feedback"
        >
          {soundType !== 'muted' ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4 text-rose-400" />
          )}
        </button>

        {/* Primary Start / Stop Button */}
        <button
          onClick={onToggleClicking}
          className={`px-4 py-1.5 rounded text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 border whitespace-nowrap shrink-0 ${
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
