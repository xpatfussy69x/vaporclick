/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ClickerConfig } from './types/clicker';
import { useAutoClicker } from './hooks/useAutoClicker';
import { SoundEffectType, triggerHaptic } from './utils/audio';

import { ClickerWindow } from './components/ClickerWindow';
import { TestingSandbox } from './components/TestingSandbox';
import { MacroManager } from './components/MacroManager';
import { ScriptExportModal } from './components/ScriptExportModal';
import { HotkeyModal } from './components/HotkeyModal';
import { TopNavigation } from './components/TopNavigation';
import { ClickRipplesLayer } from './components/ClickRipplesLayer';
import { PCWindowHeader } from './components/pc/PCWindowHeader';
import { PCGuideModal } from './components/pc/PCGuideModal';

const STORAGE_KEY = 'vaporclick_pc_config_v1';

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
      // fallback to defaults on parse failure
    }
    return DEFAULT_CONFIG;
  });

  const [soundType, setSoundType] = useState<SoundEffectType>('mechanical');
  const [soundVolume, setSoundVolume] = useState<number>(0.5);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);

  // Active workspace view
  const [activeView, setActiveView] = useState<'clicker' | 'sandbox' | 'macro' | 'export'>('clicker');

  // Modals state
  const [isHotkeyModalOpen, setIsHotkeyModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isPCGuideOpen, setIsPCGuideOpen] = useState<boolean>(false);

  // Persist configuration updates defensively
  const handleUpdateConfig = useCallback((updates: Partial<ClickerConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  // Initialize auto clicker engine
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

  // Global hotkey listener for PC desktop (e.g. F6)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent triggering if user is currently typing in an input element
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      if (e.key.toUpperCase() === config.hotkey.toUpperCase()) {
        e.preventDefault();
        triggerHaptic(15);
        toggleClicking();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config.hotkey, toggleClicking]);

  const handleSetCoordinates = useCallback((x: number, y: number) => {
    handleUpdateConfig({
      targetX: x,
      targetY: y,
      cursorPositionType: 'picked',
    });
  }, [handleUpdateConfig]);

  return (
    <div className="min-h-screen bg-[#0d041a] text-slate-100 flex flex-col relative overflow-x-hidden font-sans">
      {/* PC Windows Titlebar */}
      <PCWindowHeader
        hotkey={config.hotkey}
        isRunning={isRunning || isMacroRunning}
        activeCPS={stats.activeCPS}
        onOpenHelpModal={() => setIsPCGuideOpen(true)}
      />

      {/* Retro Vaporwave Wallpaper Layer */}
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

      {/* Interactive Click Ripples, Crosshairs & Macro Path Layer */}
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

      {/* Top Bar Navigation */}
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
        onOpenPCGuide={() => setIsPCGuideOpen(true)}
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
              High-precision desktop auto clicker for Windows, macOS &amp; Linux with millisecond intervals, coordinate targeting &amp; macro sequencing
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
              title="Click to rebind hotkey"
            >
              <span>KEY:</span>
              <span className="text-[#ff71ce] underline">{config.hotkey}</span>
            </button>
          </div>
        </div>

        {/* View 1: Main Clicker Workspace */}
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
            </div>
          </div>
        )}

        {/* View 2: Dedicated Sandbox & CPS Benchmark */}
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
        onSave={(newKey: string) => handleUpdateConfig({ hotkey: newKey })}
        onClose={() => setIsHotkeyModalOpen(false)}
      />

      <ScriptExportModal
        isOpen={isExportModalOpen}
        config={config}
        onClose={() => setIsExportModalOpen(false)}
      />

      <PCGuideModal
        isOpen={isPCGuideOpen}
        onClose={() => setIsPCGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="relative z-10 py-4 px-6 border-t border-purple-900/60 bg-[#0b0314]/90 text-center text-[11px] font-mono text-slate-500">
        VAPOR CLICKER PC // HIGH PERFORMANCE RETRO AUTO CLICKER // PRESS [{config.hotkey}] TO TOGGLE
      </footer>
    </div>
  );
}
