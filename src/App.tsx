/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ClickerConfig } from './types/clicker';
import { useAutoClicker } from './hooks/useAutoClicker';
import { SoundEffectType } from './utils/audio';
import { ClickerWindow } from './components/ClickerWindow';
import { TestingSandbox } from './components/TestingSandbox';
import { MacroManager } from './components/MacroManager';
import { ScriptExportModal } from './components/ScriptExportModal';
import { HotkeyModal } from './components/HotkeyModal';
import { TopNavigation } from './components/TopNavigation';
import { ClickRipplesLayer } from './components/ClickRipplesLayer';
import { Sparkles, Terminal, Activity, HelpCircle, Layers } from 'lucide-react';

const STORAGE_KEY = 'vaporclick_config_v1';

const DEFAULT_CONFIG: ClickerConfig = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 100, // 10 clicks per second
  jitter: false,
  jitterRange: 15,
  mouseButton: 'left',
  clickType: 'single',
  repeatType: 'infinite',
  repeatCount: 100,
  cursorPositionType: 'current',
  targetX: 640,
  targetY: 360,
  hotkey: 'F6',
};

export default function App() {
  const [config, setConfig] = useState<ClickerConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_CONFIG;
  });

  const [soundType, setSoundType] = useState<SoundEffectType>('mechanical');
  const [soundVolume, setSoundVolume] = useState<number>(0.5);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<'clicker' | 'sandbox' | 'macro' | 'export'>('clicker');
  const [isHotkeyModalOpen, setIsHotkeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Save config changes to localStorage
  const handleUpdateConfig = (updates: Partial<ClickerConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Initialize auto clicker engine hook
  const {
    isRunning,
    isPickingCoordinate,
    isRecordingMacro,
    currentMousePos,
    ripples,
    stats,
    isMacroRunning,
    activeMacro,
    macroStepIndex,
    startClicking,
    stopClicking,
    toggleClicking,
    setIsPickingCoordinate,
    setIsRecordingMacro,
    startMacro,
    stopMacro,
    resetStats,
  } = useAutoClicker({
    config,
    soundType,
    soundVolume,
    onConfigChange: handleUpdateConfig,
  });

  const handleSetCoordinates = (x: number, y: number) => {
    handleUpdateConfig({
      targetX: x,
      targetY: y,
      cursorPositionType: 'picked',
    });
  };

  return (
    <div className="min-h-screen bg-[#0d041a] text-slate-100 flex flex-col relative overflow-x-hidden">
      {/* Background Wallpaper with Vaporwave Styling */}
      <div
        className="fixed inset-0 pointer-events-none opacity-45 bg-cover bg-center z-0 transition-opacity"
        style={{
          backgroundImage: `url(/src/assets/images/vaporwave_desktop_bg_1792024953241.jpg)`,
        }}
      />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#0d041a]/85 via-[#140827]/75 to-[#0b0217]/95 z-0" />

      {/* CRT Scanline Overlay Effect */}
      {crtEnabled && (
        <div className="fixed inset-0 pointer-events-none z-30 crt-overlay opacity-75" />
      )}

      {/* Interactive Click Ripples, Crosshairs & Path Layer */}
      <ClickRipplesLayer
        ripples={ripples}
        cursorPositionType={config.cursorPositionType}
        targetX={config.targetX}
        targetY={config.targetY}
        isPickingCoordinate={isPickingCoordinate}
        mousePos={currentMousePos}
        activeMacro={activeMacro}
        isMacroRunning={isMacroRunning}
        macroStepIndex={macroStepIndex}
      />

      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <TopNavigation
        activeView={activeView}
        onSelectView={(view) => {
          if (view === 'export') {
            setIsExportModalOpen(true);
          } else {
            setActiveView(view);
          }
        }}
        isRunning={isRunning || isMacroRunning}
        hotkey={config.hotkey}
        onToggleClicking={toggleClicking}
        crtEnabled={crtEnabled}
        onToggleCrt={() => setCrtEnabled(!crtEnabled)}
        soundType={soundType}
        onToggleMute={() =>
          setSoundType(soundType === 'muted' ? 'mechanical' : 'muted')
        }
      />

      {/* Main App Content Viewport */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col justify-start">
        {/* Quick Kicker & Status Banner */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-purple-900/50">
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-wider font-mono bg-gradient-to-r from-[#ff71ce] via-[#fffb96] to-[#01cdfe] bg-clip-text text-transparent">
              V A P O R  C L I C K E R // オ ー ト ク リ ッ カ ー
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              High-precision Vaporwave auto clicker with milliseconds intervals, coordinate targeting & macro sequencing
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {/* Real-time CPS Counter Chip */}
            <div className="bg-[#1b0a33] border border-[#01cdfe]/60 px-3 py-1 flex items-center gap-2 shadow-[0_0_10px_rgba(1,205,254,0.3)]">
              <span className="text-slate-400">ACTIVE RATE:</span>
              <span className="text-[#05ffa1] font-bold text-sm tabular-nums">
                {stats.activeCPS} CPS
              </span>
            </div>

            {/* Current Hotkey trigger */}
            <button
              onClick={() => setIsHotkeyModalOpen(true)}
              className="bg-[#240d42] hover:bg-[#32135c] border border-[#ff71ce]/60 px-3 py-1 text-[#fffb96] font-bold transition-all shadow-[0_0_10px_rgba(255,113,206,0.3)] flex items-center gap-1.5"
            >
              <span>KEY:</span>
              <span className="text-[#ff71ce] underline">{config.hotkey}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Multi-Panel Workspace */}
        {activeView === 'clicker' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left Column: The Vapor Clicker Control Panel */}
            <div className="space-y-4">
              <ClickerWindow
                config={config}
                stats={stats}
                isRunning={isRunning}
                isPickingCoordinate={isPickingCoordinate}
                soundType={soundType}
                soundVolume={soundVolume}
                onUpdateConfig={handleUpdateConfig}
                onStart={startClicking}
                onStop={stopClicking}
                onPickCoordinate={() => setIsPickingCoordinate(true)}
                onOpenHotkeyModal={() => setIsHotkeyModalOpen(true)}
                onSoundTypeChange={setSoundType}
                onSoundVolumeChange={setSoundVolume}
              />
            </div>

            {/* Right Column: Built-in Testing Sandbox & Speedometer */}
            <div className="space-y-4">
              <TestingSandbox
                stats={stats}
                isRunning={isRunning}
                onSetCoordinates={handleSetCoordinates}
                onResetStats={resetStats}
              />

              {/* Quick Info & Tips Bar */}
              <div className="bg-[#130726]/90 border border-purple-900/60 p-3.5 text-slate-300 font-mono text-xs space-y-1.5">
                <div className="text-[#01cdfe] font-bold flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>VAPOR CLICKER PRO-TIPS</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-1">
                  <p>
                    • Press <strong className="text-white">[{config.hotkey}]</strong> on your keyboard to instantly trigger clicking on/off from anywhere in this window.
                  </p>
                  <p>
                    • Use <strong className="text-white">"Pick Coordinate"</strong> to lock onto specific target buttons or coordinates.
                  </p>
                  <p>
                    • Need to run this on games outside the browser? Click <strong className="text-[#05ffa1]">"Export Scripts"</strong> in the top menu to get AutoHotkey or Python code!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Dedicated Sandbox & Benchmark Focus */}
        {activeView === 'sandbox' && (
          <div className="space-y-6">
            <TestingSandbox
              stats={stats}
              isRunning={isRunning}
              onSetCoordinates={handleSetCoordinates}
              onResetStats={resetStats}
            />

            <div className="max-w-xl mx-auto">
              <ClickerWindow
                config={config}
                stats={stats}
                isRunning={isRunning}
                isPickingCoordinate={isPickingCoordinate}
                soundType={soundType}
                soundVolume={soundVolume}
                onUpdateConfig={handleUpdateConfig}
                onStart={startClicking}
                onStop={stopClicking}
                onPickCoordinate={() => setIsPickingCoordinate(true)}
                onOpenHotkeyModal={() => setIsHotkeyModalOpen(true)}
                onSoundTypeChange={setSoundType}
                onSoundVolumeChange={setSoundVolume}
              />
            </div>
          </div>
        )}

        {/* View 3: Macro Recorder View */}
        {activeView === 'macro' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <MacroManager
              isRecording={isRecordingMacro}
              isMacroRunning={isMacroRunning}
              currentStepIndex={macroStepIndex}
              onStartRecord={() => setIsRecordingMacro(true)}
              onStopRecord={() => setIsRecordingMacro(false)}
              onPlayMacro={startMacro}
              onStopMacro={stopMacro}
            />

            <TestingSandbox
              stats={stats}
              isRunning={isMacroRunning || isRunning}
              onSetCoordinates={handleSetCoordinates}
              onResetStats={resetStats}
            />
          </div>
        )}
      </main>

      {/* Global Modals */}
      <HotkeyModal
        isOpen={isHotkeyModalOpen}
        currentHotkey={config.hotkey}
        onSave={(newKey) => handleUpdateConfig({ hotkey: newKey })}
        onClose={() => setIsHotkeyModalOpen(false)}
      />

      <ScriptExportModal
        isOpen={isExportModalOpen}
        config={config}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Footer */}
      <footer className="relative z-10 py-4 px-6 border-t border-purple-900/60 bg-[#0b0314]/90 text-center text-[11px] font-mono text-slate-500">
        VAPOR CLICKER // HIGH PERFORMANCE RETRO AUTO CLICKER // PRESS {config.hotkey} TO TOGGLE
      </footer>
    </div>
  );
}
