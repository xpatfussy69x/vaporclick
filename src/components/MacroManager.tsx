import React, { useState, useEffect } from 'react';
import {
  ListPlus,
  Play,
  Square,
  Trash2,
  Download,
  Upload,
  Plus,
  CircleDot,
  MousePointer,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { MacroSequence, MacroStep, MouseButtonType, ClickType } from '../types/clicker';

interface MacroManagerProps {
  isRecording: boolean;
  isMacroRunning: boolean;
  currentStepIndex: number;
  onStartRecord: () => void;
  onStopRecord: () => void;
  onPlayMacro: (sequence: MacroSequence) => void;
  onStopMacro: () => void;
}

export const MacroManager: React.FC<MacroManagerProps> = ({
  isRecording,
  isMacroRunning,
  currentStepIndex,
  onStartRecord,
  onStopRecord,
  onPlayMacro,
  onStopMacro,
}) => {
  const [sequence, setSequence] = useState<MacroSequence>({
    name: 'Vapor Wave Path 01',
    repeatTimes: 0,
    steps: [
      {
        id: 'step-1',
        x: 400,
        y: 350,
        delayMs: 300,
        button: 'left',
        clickType: 'single',
      },
      {
        id: 'step-2',
        x: 650,
        y: 420,
        delayMs: 250,
        button: 'left',
        clickType: 'single',
      },
      {
        id: 'step-3',
        x: 520,
        y: 280,
        delayMs: 400,
        button: 'right',
        clickType: 'double',
      },
    ],
  });

  // Intercept clicks on window when recording is active
  useEffect(() => {
    if (!isRecording) return;

    let lastClickTime = performance.now();

    const handleRecordClick = (e: MouseEvent) => {
      // Don't record clicks on the macro manager controls themselves
      const target = e.target as HTMLElement;
      if (target.closest('.macro-control-panel')) return;

      const now = performance.now();
      const delay = Math.min(5000, Math.max(50, Math.round(now - lastClickTime)));
      lastClickTime = now;

      const newStep: MacroStep = {
        id: Math.random().toString(36).substring(2, 9),
        x: Math.round(e.clientX),
        y: Math.round(e.clientY),
        delayMs: delay,
        button: e.button === 2 ? 'right' : e.button === 1 ? 'middle' : 'left',
        clickType: 'single',
      };

      setSequence((prev) => ({
        ...prev,
        steps: [...prev.steps, newStep],
      }));
    };

    window.addEventListener('click', handleRecordClick, { capture: true });
    return () => window.removeEventListener('click', handleRecordClick, { capture: true });
  }, [isRecording]);

  const addManualStep = () => {
    const newStep: MacroStep = {
      id: Math.random().toString(36).substring(2, 9),
      x: 500,
      y: 300,
      delayMs: 250,
      button: 'left',
      clickType: 'single',
    };
    setSequence((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
  };

  const removeStep = (id: string) => {
    setSequence((prev) => ({
      ...prev,
      steps: prev.steps.filter((s) => s.id !== id),
    }));
  };

  const updateStep = (id: string, updates: Partial<MacroStep>) => {
    setSequence((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const clearAllSteps = () => {
    setSequence((prev) => ({
      ...prev,
      steps: [],
    }));
  };

  const exportMacroJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(sequence, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${sequence.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.steps)) {
          setSequence(parsed);
        }
      } catch {
        alert('Invalid Macro JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  // Presets
  const loadPreset = (type: 'triangle' | 'rapid' | 'fourCorners') => {
    if (type === 'triangle') {
      setSequence({
        name: 'Vapor Triangle Sweep',
        repeatTimes: 0,
        steps: [
          { id: '1', x: 450, y: 220, delayMs: 200, button: 'left', clickType: 'single' },
          { id: '2', x: 620, y: 450, delayMs: 200, button: 'left', clickType: 'single' },
          { id: '3', x: 280, y: 450, delayMs: 200, button: 'right', clickType: 'single' },
        ],
      });
    } else if (type === 'rapid') {
      setSequence({
        name: 'Burst Double Tap',
        repeatTimes: 0,
        steps: [
          { id: '1', x: 500, y: 350, delayMs: 100, button: 'left', clickType: 'double' },
          { id: '2', x: 500, y: 350, delayMs: 150, button: 'left', clickType: 'single' },
        ],
      });
    } else if (type === 'fourCorners') {
      setSequence({
        name: 'Perimeter Patrol',
        repeatTimes: 0,
        steps: [
          { id: '1', x: 200, y: 200, delayMs: 300, button: 'left', clickType: 'single' },
          { id: '2', x: 700, y: 200, delayMs: 300, button: 'left', clickType: 'single' },
          { id: '3', x: 700, y: 550, delayMs: 300, button: 'left', clickType: 'single' },
          { id: '4', x: 200, y: 550, delayMs: 300, button: 'left', clickType: 'single' },
        ],
      });
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-[#140827] border-2 border-[#b967ff] shadow-[0_0_25px_rgba(185,103,255,0.35)] macro-control-panel select-none">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#b967ff] via-[#ff71ce] to-[#01cdfe] text-black font-extrabold text-xs tracking-wider">
        <div className="flex items-center gap-2">
          <ListPlus className="w-4 h-4" />
          <span>MACRO RECORDER & MULTI-TARGET SEQUENCE</span>
        </div>
        <span className="text-[10px] bg-black/20 text-black px-1 font-bold">
          {sequence.steps.length} WAYPOINTS
        </span>
      </div>

      <div className="p-4 space-y-4 font-mono text-xs text-slate-200">
        {/* Record & Playback Bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {/* Record Button */}
            <button
              onClick={isRecording ? onStopRecord : onStartRecord}
              className={`px-3 py-1.5 font-bold flex items-center gap-1.5 border text-xs transition-all ${
                isRecording
                  ? 'bg-red-500 text-white border-red-400 animate-pulse'
                  : 'bg-[#2b104d] text-rose-300 border-rose-500/50 hover:bg-rose-950/60'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>{isRecording ? 'RECORDING... (CLICK TO STOP)' : 'Record Live Clicks'}</span>
            </button>

            {/* Play/Stop Button */}
            {isMacroRunning ? (
              <button
                onClick={onStopMacro}
                className="px-4 py-1.5 bg-[#ff2a6d] hover:bg-rose-600 text-white font-bold flex items-center gap-1.5 border border-[#ff71ce] shadow-[0_0_12px_rgba(255,42,109,0.5)]"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Macro</span>
              </button>
            ) : (
              <button
                onClick={() => onPlayMacro(sequence)}
                disabled={!sequence.steps.length || isRecording}
                className="px-4 py-1.5 bg-gradient-to-r from-[#05ffa1] to-[#01cdfe] hover:brightness-110 text-black font-bold flex items-center gap-1.5 border border-[#05ffa1] shadow-[0_0_12px_rgba(5,255,161,0.4)] disabled:opacity-40"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Macro</span>
              </button>
            )}
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1 text-[10px]">
            <span className="text-slate-400">Presets:</span>
            <button
              onClick={() => loadPreset('triangle')}
              className="px-1.5 py-0.5 bg-[#250d42] border border-purple-800 text-slate-300 hover:text-white"
            >
              Triangle
            </button>
            <button
              onClick={() => loadPreset('rapid')}
              className="px-1.5 py-0.5 bg-[#250d42] border border-purple-800 text-slate-300 hover:text-white"
            >
              Double Tap
            </button>
            <button
              onClick={() => loadPreset('fourCorners')}
              className="px-1.5 py-0.5 bg-[#250d42] border border-purple-800 text-slate-300 hover:text-white"
            >
              Box Patrol
            </button>
          </div>
        </div>

        {/* Step list table */}
        <div className="bg-[#0b0314] border border-[#b967ff]/40 p-2 max-h-56 overflow-y-auto space-y-1.5">
          {sequence.steps.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              No waypoints recorded yet. Click "Record Live Clicks" or "Add Waypoint".
            </div>
          ) : (
            sequence.steps.map((step, idx) => (
              <div
                key={step.id}
                className={`p-2 flex items-center justify-between gap-2 border transition-colors ${
                  isMacroRunning && currentStepIndex === idx
                    ? 'bg-[#b967ff]/30 border-[#05ffa1] shadow-[0_0_8px_#05ffa1]'
                    : 'bg-[#18092d] border-purple-900/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#05ffa1] font-bold w-5">
                    #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-slate-400">X:</span>
                    <input
                      type="number"
                      value={step.x}
                      onChange={(e) =>
                        updateStep(step.id, { x: parseInt(e.target.value) || 0 })
                      }
                      className="w-14 bg-black/60 border border-purple-800 px-1 text-center text-[#01cdfe]"
                    />
                    <span className="text-slate-400">Y:</span>
                    <input
                      type="number"
                      value={step.y}
                      onChange={(e) =>
                        updateStep(step.id, { y: parseInt(e.target.value) || 0 })
                      }
                      className="w-14 bg-black/60 border border-purple-800 px-1 text-center text-[#01cdfe]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  {/* Delay */}
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Delay:</span>
                    <input
                      type="number"
                      value={step.delayMs}
                      onChange={(e) =>
                        updateStep(step.id, {
                          delayMs: Math.max(10, parseInt(e.target.value) || 100),
                        })
                      }
                      className="w-14 bg-black/60 border border-purple-800 px-1 text-center text-[#fffb96]"
                    />
                    <span className="text-slate-500 text-[10px]">ms</span>
                  </div>

                  {/* Button */}
                  <select
                    value={step.button}
                    onChange={(e) =>
                      updateStep(step.id, {
                        button: e.target.value as MouseButtonType,
                      })
                    }
                    className="bg-black/60 border border-purple-800 text-[10px] px-1 py-0.5 text-slate-300 focus:outline-hidden"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="middle">Middle</option>
                  </select>

                  {/* Click Type */}
                  <select
                    value={step.clickType}
                    onChange={(e) =>
                      updateStep(step.id, {
                        clickType: e.target.value as ClickType,
                      })
                    }
                    className="bg-black/60 border border-purple-800 text-[10px] px-1 py-0.5 text-slate-300 focus:outline-hidden"
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                  </select>

                  {/* Delete */}
                  <button
                    onClick={() => removeStep(step.id)}
                    className="p-1 text-slate-500 hover:text-red-400"
                    title="Remove Waypoint"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer controls: Add, Clear, Export, Import */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-purple-900/60 text-[11px]">
          <div className="flex items-center gap-2">
            <button
              onClick={addManualStep}
              className="px-2.5 py-1 bg-[#2b104d] hover:bg-[#3d176d] border border-purple-800 text-slate-200 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Waypoint</span>
            </button>
            <button
              onClick={clearAllSteps}
              className="px-2 py-1 text-slate-400 hover:text-rose-300"
            >
              Clear All
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportMacroJSON}
              className="px-2.5 py-1 bg-[#1a0833] hover:bg-[#280c4e] border border-[#b967ff]/40 text-slate-300 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <label className="px-2.5 py-1 bg-[#1a0833] hover:bg-[#280c4e] border border-[#b967ff]/40 text-slate-300 flex items-center gap-1 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Load JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
