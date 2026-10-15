import React, { useState, useEffect } from 'react';
import { Keyboard, X, Check } from 'lucide-react';

interface HotkeyModalProps {
  isOpen: boolean;
  currentHotkey: string;
  onSave: (hotkey: string) => void;
  onClose: () => void;
}

export const HotkeyModal: React.FC<HotkeyModalProps> = ({
  isOpen,
  currentHotkey,
  onSave,
  onClose,
}) => {
  const [listening, setListening] = useState(false);
  const [tempKey, setTempKey] = useState(currentHotkey);

  useEffect(() => {
    if (isOpen) {
      setTempKey(currentHotkey);
      setListening(false);
    }
  }, [isOpen, currentHotkey]);

  useEffect(() => {
    if (!listening) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      let keyName = e.key;
      if (keyName === ' ') keyName = 'Space';
      if (keyName.startsWith('Arrow')) keyName = keyName.replace('Arrow', '');

      // Keep standard uppercase for letters or F-keys
      if (keyName.length === 1) keyName = keyName.toUpperCase();

      setTempKey(keyName);
      setListening(false);
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [listening]);

  if (!isOpen) return null;

  const quickPresets = ['F6', 'F8', 'F7', 'Space', 'X', 'C', 'Q'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-[#1d0b36] border-2 border-[#ff71ce] shadow-[0_0_30px_rgba(255,113,206,0.4)] text-white">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#ff71ce] via-[#b967ff] to-[#01cdfe] text-black font-bold text-sm select-none">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4" />
            <span>HOTKEY CONFIGURATION</span>
          </div>
          <button
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center bg-[#c0c0c0] hover:bg-white text-black border border-black text-xs font-mono active:translate-y-px"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 font-mono">
          <p className="text-xs text-slate-300">
            Press any keyboard key to assign it as the global Start / Stop hotkey.
          </p>

          {/* Capture Box */}
          <div className="text-center p-4 bg-[#0d041a] border border-[#ff71ce]/40 rounded-sm">
            <div className="text-xs text-[#01cdfe] mb-1">CURRENT ASSIGNMENT</div>
            <div className="text-3xl font-extrabold text-[#fffb96] tracking-wider py-2">
              {tempKey}
            </div>
            {listening ? (
              <div className="text-xs text-[#ff71ce] animate-pulse">
                [PRESS ANY KEY NOW...]
              </div>
            ) : (
              <button
                onClick={() => setListening(true)}
                className="mt-2 px-3 py-1 bg-[#ff71ce] hover:bg-[#ff85d5] text-black text-xs font-bold uppercase transition-colors"
              >
                Click to Rebind
              </button>
            )}
          </div>

          {/* Preset buttons */}
          <div>
            <div className="text-xs text-slate-400 mb-2">QUICK PRESETS:</div>
            <div className="flex flex-wrap gap-2">
              {quickPresets.map((key) => (
                <button
                  key={key}
                  onClick={() => setTempKey(key)}
                  className={`px-2.5 py-1 text-xs border transition-colors ${
                    tempKey === key
                      ? 'bg-[#01cdfe] text-black border-[#01cdfe] font-bold'
                      : 'bg-[#2b104d] text-slate-200 border-[#ff71ce]/30 hover:border-[#01cdfe]'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-purple-900/60">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#311752] hover:bg-[#3f1f68] text-xs font-bold text-slate-300 border border-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(tempKey);
                onClose();
              }}
              className="px-5 py-1.5 bg-gradient-to-r from-[#ff71ce] to-[#01cdfe] hover:opacity-95 text-xs font-bold text-black flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,113,206,0.4)]"
            >
              <Check className="w-3.5 h-3.5" />
              Apply Hotkey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
