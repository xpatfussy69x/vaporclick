import React, { useState } from 'react';
import { X, Copy, Check, Code, FileText, Terminal, Globe } from 'lucide-react';
import { ClickerConfig } from '../types/clicker';
import {
  generateAHKScript,
  generatePythonScript,
  generateBookmarklet,
  getTotalIntervalMs,
} from '../utils/exporters';

interface ScriptExportModalProps {
  isOpen: boolean;
  config: ClickerConfig;
  onClose: () => void;
}

type ScriptFormat = 'ahk' | 'python' | 'bookmarklet' | 'powershell';

export const ScriptExportModal: React.FC<ScriptExportModalProps> = ({
  isOpen,
  config,
  onClose,
}) => {
  const [format, setFormat] = useState<ScriptFormat>('ahk');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getScriptContent = () => {
    switch (format) {
      case 'ahk':
        return generateAHKScript(config);
      case 'python':
        return generatePythonScript(config);
      case 'bookmarklet':
        return generateBookmarklet(config);
      case 'powershell': {
        const interval = getTotalIntervalMs(config);
        return `# VaporClick PowerShell Auto-Clicker
$interval = ${interval}
Add-Type -AssemblyName System.Windows.Forms
Write-Host "Press Ctrl+C to stop auto-clicking."
while ($true) {
    [System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
    Start-Sleep -Milliseconds $interval
}`;
      }
      default:
        return '';
    }
  };

  const currentCode = getScriptContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-2xl bg-[#140827] border-2 border-[#01cdfe] shadow-[0_0_35px_rgba(1,205,254,0.4)] text-white">
        {/* Title Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#01cdfe] via-[#b967ff] to-[#ff71ce] text-black font-extrabold text-xs tracking-wider">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            <span>EXPORT OP AUTO CLICKER FOR DESKTOP & WEB</span>
          </div>
          <button
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center bg-[#c0c0c0] hover:bg-white text-black border border-black text-xs font-mono"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 font-mono text-xs">
          <div className="text-slate-300 text-xs">
            Want your OP Clicker to work globally across games, desktop windows, or other browser tabs?
            Export your exact current interval ({getTotalIntervalMs(config)}ms), button ({config.mouseButton}), and hotkey ({config.hotkey})!
          </div>

          {/* Format Selector */}
          <div className="flex border border-purple-900 bg-[#0d041a] p-1 gap-1">
            <button
              onClick={() => setFormat('ahk')}
              className={`flex-1 py-1.5 px-2 text-center flex items-center justify-center gap-1.5 transition-colors ${
                format === 'ahk'
                  ? 'bg-[#ff71ce] text-black font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>AutoHotkey (.ahk)</span>
            </button>

            <button
              onClick={() => setFormat('python')}
              className={`flex-1 py-1.5 px-2 text-center flex items-center justify-center gap-1.5 transition-colors ${
                format === 'python'
                  ? 'bg-[#01cdfe] text-black font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Python (PyAutoGUI)</span>
            </button>

            <button
              onClick={() => setFormat('bookmarklet')}
              className={`flex-1 py-1.5 px-2 text-center flex items-center justify-center gap-1.5 transition-colors ${
                format === 'bookmarklet'
                  ? 'bg-[#05ffa1] text-black font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Browser Console</span>
            </button>

            <button
              onClick={() => setFormat('powershell')}
              className={`flex-1 py-1.5 px-2 text-center flex items-center justify-center gap-1.5 transition-colors ${
                format === 'powershell'
                  ? 'bg-[#fffb96] text-black font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>PowerShell</span>
            </button>
          </div>

          {/* Code Viewer */}
          <div className="relative">
            <pre className="p-3 bg-[#070110] border border-purple-900 text-[#05ffa1] font-mono text-[11px] h-64 overflow-y-auto select-text leading-relaxed">
              {currentCode}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2.5 right-2.5 px-3 py-1.5 bg-[#ff71ce] hover:bg-[#ff85d5] text-black font-bold text-xs flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,113,206,0.5)] transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Script</span>
                </>
              )}
            </button>
          </div>

          {/* Quick instructions */}
          <div className="p-2.5 bg-[#18092d] border border-purple-900/60 text-[11px] text-slate-300 space-y-1">
            <span className="text-[#01cdfe] font-bold">HOW TO RUN:</span>
            {format === 'ahk' && (
              <p>
                Save as <code className="text-[#fffb96]">clicker.ahk</code> and double click to run. Press{' '}
                <strong className="text-white">{config.hotkey}</strong> anywhere in Windows to start/stop.
              </p>
            )}
            {format === 'python' && (
              <p>
                Run <code className="text-[#fffb96]">pip install pyautogui keyboard</code> then execute with Python. Press{' '}
                <strong className="text-white">{config.hotkey}</strong> to toggle.
              </p>
            )}
            {format === 'bookmarklet' && (
              <p>
                Open DevTools Console (F12) on any web game (e.g. Cookie Clicker) and paste this snippet to auto-click right there!
              </p>
            )}
            {format === 'powershell' && (
              <p>Open Windows PowerShell and paste the script to begin sending automated clicks.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
