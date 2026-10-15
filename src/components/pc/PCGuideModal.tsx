import React, { useState } from 'react';
import {
  X,
  Monitor,
  Terminal,
  Trash2,
  Copy,
  Check,
  CheckCircle,
  FileCode,
} from 'lucide-react';
import { triggerHaptic } from '../../utils/audio';

interface PCGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PCGuideModal: React.FC<PCGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedPath, setCopiedPath] = useState(false);
  const [copiedBuild, setCopiedBuild] = useState(false);

  if (!isOpen) return null;

  const uninstallPath = `%LOCALAPPDATA%\\Programs\\vapor-clicker\\Uninstall Vapor Clicker.exe`;
  const buildCommand = `npm run dist:win`;

  const handleCopyPath = () => {
    triggerHaptic(10);
    navigator.clipboard.writeText(uninstallPath);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  const handleCopyBuild = () => {
    triggerHaptic(10);
    navigator.clipboard.writeText(buildCommand);
    setCopiedBuild(true);
    setTimeout(() => setCopiedBuild(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-xl bg-[#140628] border-2 border-cyan-500/60 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(1,205,254,0.3)] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1e0a3b] border-b border-purple-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-[#01cdfe]" />
            <h3 className="text-base font-bold text-white font-mono">
              PC Desktop Guide &amp; Windows Diagnostics
            </h3>
          </div>
          <button
            onClick={() => {
              triggerHaptic(10);
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-black/30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs font-mono flex-1">
          {/* Section 1: Uninstaller on Windows */}
          <div className="p-4 rounded-2xl bg-[#1b0833] border border-purple-800/80 space-y-2.5">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>How to Uninstall on Windows:</span>
            </div>

            <p className="text-slate-300 leading-relaxed font-sans">
              If the uninstaller did not appear in Windows Settings &gt; Installed Apps, you can launch it directly from disk:
            </p>

            <div className="space-y-1.5 bg-[#0e041d] p-3 rounded-xl border border-purple-900">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold text-white">Direct Uninstaller Path:</span>
                <button
                  onClick={handleCopyPath}
                  className="flex items-center gap-1 text-[#01cdfe] hover:text-white"
                >
                  {copiedPath ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPath ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <code className="text-emerald-400 text-[11px] block select-all break-all">
                {uninstallPath}
              </code>
            </div>

            <p className="text-slate-400 text-[11px]">
              👉 <strong>Instructions:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800 text-white">Win + R</kbd>, paste the path above, and press <kbd className="px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800 text-white">Enter</kbd> to run the uninstaller.
            </p>

            <div className="text-[11px] text-amber-300 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/30">
              💡 <em>Note:</em> If you launched the standalone <strong>portable</strong> `.exe`, portable apps do not register in Add/Remove Programs by design. You can simply delete the downloaded `.exe` file!
            </div>
          </div>

          {/* Section 2: Blank Screen Resolution */}
          <div className="p-4 rounded-2xl bg-[#1b0833] border border-purple-800/80 space-y-2">
            <div className="flex items-center gap-2 text-[#05ffa1] font-bold text-sm">
              <CheckCircle className="w-4 h-4 text-[#05ffa1]" />
              <span>Blank Screen on Launch Resolved:</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">
              The original build referenced scripts with root paths (`/assets/...`). When Electron loaded `dist/index.html` via `win.loadFile()`, Chromium looked at the root of the file system (`C:\assets`), causing a 404 error that prevented the interface from loading.
            </p>
            <p className="text-cyan-300 text-[11px]">
              We configured <code className="bg-black/40 px-1 py-0.5 text-white rounded">base: &apos;./&apos;</code> in Vite, ensuring all assets load with relative paths in any desktop folder or Electron wrapper.
            </p>
          </div>

          {/* Section 3: Building Windows Installer */}
          <div className="p-4 rounded-2xl bg-[#1b0833] border border-purple-800/80 space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Terminal className="w-4 h-4 text-[#01cdfe]" />
              <span>Package Windows Installer (.exe):</span>
            </div>
            <div className="flex items-center justify-between bg-[#0e041d] p-2.5 rounded-xl border border-purple-900">
              <code className="text-[#fffb96] font-bold">{buildCommand}</code>
              <button
                onClick={handleCopyBuild}
                className="flex items-center gap-1 text-[#01cdfe] hover:text-white"
              >
                {copiedBuild ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBuild ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-slate-400 text-[11px]">
              The updated NSIS configuration in <code className="text-white">package.json</code> creates Start Menu shortcuts and properly registers the uninstaller in Windows Settings &gt; Apps.
            </p>
          </div>

          {/* Section 4: PC Automation & Script Formats */}
          <div className="p-4 rounded-2xl bg-[#1b0833] border border-purple-800/80 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <FileCode className="w-4 h-4 text-[#ff71ce]" />
              <span>Supported Desktop Automation Formats:</span>
            </div>
            <ul className="text-slate-300 list-disc list-inside space-y-1 font-sans text-[11px]">
              <li><strong>AutoHotkey (.ahk)</strong>: Native Windows macros with instant execution</li>
              <li><strong>Python (pyautogui)</strong>: Cross-platform script with millisecond timing</li>
              <li><strong>Windows Batch (.bat)</strong>: PowerShell-powered automated click loop</li>
              <li><strong>Bash (xdotool)</strong>: Linux desktop auto-clicker script</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0e041d] border-t border-purple-900 flex justify-end">
          <button
            onClick={() => {
              triggerHaptic(10);
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-white font-mono text-xs transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
