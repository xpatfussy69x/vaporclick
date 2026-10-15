import React, { useState } from 'react';
import { Minus, Square, X, HelpCircle } from 'lucide-react';
import { triggerHaptic } from '../../utils/audio';

interface PCWindowHeaderProps {
  hotkey: string;
  isRunning: boolean;
  activeCPS: number;
  onOpenHelpModal: () => void;
}

export const PCWindowHeader: React.FC<PCWindowHeaderProps> = ({
  hotkey,
  isRunning,
  activeCPS,
  onOpenHelpModal,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <div className="w-full bg-[#16062d] border-b border-[#ff71ce]/40 px-3 py-1.5 flex items-center justify-between text-xs font-mono select-none shadow-sm z-30">
      {/* Left: Window Brand & Tag */}
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-gradient-to-tr from-[#ff71ce] to-[#01cdfe] flex items-center justify-center text-[10px] text-black font-extrabold shadow-sm">
          ⚡
        </div>
        <span className="font-bold text-white tracking-wide">
          Vapor Clicker [PC Desktop Edition]
        </span>
        <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/80 text-cyan-300 border border-purple-700 hidden sm:inline">
          x64
        </span>
      </div>

      {/* Center: Live Status & Hotkey */}
      <div className="flex items-center gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 bg-[#0e041d] px-2.5 py-0.5 rounded border border-purple-900">
          <span
            className={`w-2 h-2 rounded-full ${
              isRunning ? 'bg-[#05ffa1] shadow-[0_0_8px_#05ffa1]' : 'bg-slate-500'
            }`}
          />
          <span className="text-slate-300">
            {isRunning ? (
              <span className="text-[#05ffa1] font-bold">{activeCPS} CPS ACTIVE</span>
            ) : (
              <span>READY [{hotkey}]</span>
            )}
          </span>
        </div>
      </div>

      {/* Right: Help Guide & Retro Window Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            triggerHaptic(10);
            onOpenHelpModal();
          }}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#240d42] hover:bg-[#32135c] text-cyan-300 border border-purple-800 text-[10px] font-bold transition"
          title="PC Troubleshooting, Packaging & Uninstaller Info"
        >
          <HelpCircle className="w-3 h-3 text-[#01cdfe]" />
          <span className="hidden sm:inline">PC Guide & Uninstall</span>
        </button>

        {/* Windows style control buttons */}
        <div className="flex items-center gap-1 ml-1">
          <button
            onClick={() => triggerHaptic(5)}
            className="w-5 h-5 rounded bg-[#210940] hover:bg-[#32135c] text-slate-400 hover:text-white flex items-center justify-center text-[10px] border border-purple-800"
            title="Minimize"
          >
            <Minus className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => {
              triggerHaptic(5);
              setIsMaximized(!isMaximized);
            }}
            className="w-5 h-5 rounded bg-[#210940] hover:bg-[#32135c] text-slate-400 hover:text-white flex items-center justify-center text-[10px] border border-purple-800"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            <Square className="w-2.5 h-2.5" />
          </button>
          <button
            onClick={() => triggerHaptic(10)}
            className="w-5 h-5 rounded bg-[#210940] hover:bg-rose-700 text-slate-400 hover:text-white flex items-center justify-center text-[10px] border border-purple-800"
            title="Close"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
