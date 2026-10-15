import { useState, useEffect, useRef, useCallback } from 'react';
import { ClickerConfig, ClickStats, ClickRipple, MouseButtonType, MacroSequence } from '../types/clicker';
import { playClickSound, playStartStopSound, SoundEffectType } from '../utils/audio';
import { getTotalIntervalMs } from '../utils/exporters';

export interface UseAutoClickerProps {
  config: ClickerConfig;
  soundType: SoundEffectType;
  soundVolume: number;
  onConfigChange?: (newConfig: Partial<ClickerConfig>) => void;
}

export function useAutoClicker({
  config,
  soundType,
  soundVolume,
  onConfigChange,
}: UseAutoClickerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPickingCoordinate, setIsPickingCoordinate] = useState(false);
  const [isRecordingMacro, setIsRecordingMacro] = useState(false);
  const [currentMousePos, setCurrentMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<ClickRipple[]>([]);
  const [activeMacro, setActiveMacro] = useState<MacroSequence | null>(null);
  const [macroStepIndex, setMacroStepIndex] = useState<number>(0);
  const [isMacroRunning, setIsMacroRunning] = useState<boolean>(false);

  const [stats, setStats] = useState<ClickStats>({
    totalClicksExecuted: 0,
    sessionClicks: 0,
    activeCPS: 0,
    peakCPS: 0,
    startTime: null,
    elapsedSeconds: 0,
  });

  // Track clicks within sliding window to calculate exact live CPS
  const recentClickTimestamps = useRef<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isRunningRef = useRef(false);
  const sessionClicksRef = useRef(0);
  const macroTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const macroStepIndexRef = useRef(0);

  // Synchronize ref
  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  // Track mouse coordinates across the document
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      currentPosRef.current = { x: e.clientX, y: e.clientY };
      setCurrentMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle Pick Coordinate tool
  useEffect(() => {
    if (!isPickingCoordinate) return;

    const handlePickClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const x = Math.round(e.clientX);
      const y = Math.round(e.clientY);
      if (onConfigChange) {
        onConfigChange({
          targetX: x,
          targetY: y,
          cursorPositionType: 'picked',
        });
      }
      setIsPickingCoordinate(false);
      playClickSound('synth-blip', soundVolume);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPickingCoordinate(false);
      }
    };

    window.addEventListener('click', handlePickClick, { capture: true, once: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('click', handlePickClick, { capture: true });
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPickingCoordinate, onConfigChange, soundVolume]);

  // Fire a synthetic click event on DOM element and register ripple + audio
  const executeSingleClick = useCallback(
    (x: number, y: number, button: MouseButtonType, clickType: 'single' | 'double' | 'triple') => {
      const buttonCode = button === 'right' ? 2 : button === 'middle' ? 1 : 0;
      const targetElement = document.elementFromPoint(x, y) || document.body;

      const clickIterations = clickType === 'double' ? 2 : clickType === 'triple' ? 3 : 1;

      for (let i = 0; i < clickIterations; i++) {
        const mouseEventInit: MouseEventInit = {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: x,
          clientY: y,
          button: buttonCode,
          buttons: button === 'right' ? 2 : button === 'middle' ? 4 : 1,
        };

        targetElement.dispatchEvent(new MouseEvent('mousedown', mouseEventInit));
        targetElement.dispatchEvent(new MouseEvent('mouseup', mouseEventInit));

        if (button === 'left') {
          targetElement.dispatchEvent(new MouseEvent('click', mouseEventInit));
          if (clickType === 'double' && i === 1) {
            targetElement.dispatchEvent(new MouseEvent('dblclick', mouseEventInit));
          }
        } else if (button === 'right') {
          targetElement.dispatchEvent(new MouseEvent('contextmenu', mouseEventInit));
        } else if (button === 'middle') {
          targetElement.dispatchEvent(new MouseEvent('auxclick', mouseEventInit));
        }
      }

      // Add visual ripple
      const rippleId = Math.random().toString(36).substring(2, 9);
      const color =
        button === 'right'
          ? '#01cdfe'
          : button === 'middle'
          ? '#fffb96'
          : '#ff71ce';

      setRipples((prev) => [
        ...prev.slice(-15),
        { id: rippleId, x, y, color, button },
      ]);

      // Play audio
      playClickSound(soundType, soundVolume);

      // Record CPS stats
      const now = performance.now();
      recentClickTimestamps.current.push(now);
      sessionClicksRef.current += clickIterations;

      setStats((prev) => {
        const total = prev.totalClicksExecuted + clickIterations;
        const session = prev.sessionClicks + clickIterations;
        return {
          ...prev,
          totalClicksExecuted: total,
          sessionClicks: session,
        };
      });
    },
    [soundType, soundVolume]
  );

  // CPS Calculation Loop
  useEffect(() => {
    const cpsInterval = setInterval(() => {
      const now = performance.now();
      // Keep only clicks within last 1 second (1000ms)
      recentClickTimestamps.current = recentClickTimestamps.current.filter(
        (t) => now - t <= 1000
      );
      const currentCPS = recentClickTimestamps.current.length;

      setStats((prev) => {
        const newPeak = Math.max(prev.peakCPS, currentCPS);
        const elapsed = prev.startTime ? Math.floor((now - prev.startTime) / 1000) : 0;
        return {
          ...prev,
          activeCPS: currentCPS,
          peakCPS: newPeak,
          elapsedSeconds: elapsed,
        };
      });
    }, 200);

    return () => clearInterval(cpsInterval);
  }, []);

  // Main clicking loop
  const triggerNextClick = useCallback(() => {
    if (!isRunningRef.current) return;

    // Check repeat count condition
    if (config.repeatType === 'count') {
      if (sessionClicksRef.current >= config.repeatCount) {
        setIsRunning(false);
        playStartStopSound(false);
        return;
      }
    }

    // Determine target location
    let targetX = config.targetX;
    let targetY = config.targetY;
    if (config.cursorPositionType === 'current') {
      targetX = currentPosRef.current.x;
      targetY = currentPosRef.current.y;
    }

    // Execute click
    executeSingleClick(targetX, targetY, config.mouseButton, config.clickType);

    // Schedule next click with optional jitter
    let interval = getTotalIntervalMs(config);
    if (config.jitter && config.jitterRange > 0) {
      const jitterOffset = (Math.random() * 2 - 1) * config.jitterRange;
      interval = Math.max(1, Math.round(interval + jitterOffset));
    }

    timerRef.current = setTimeout(triggerNextClick, interval);
  }, [config, executeSingleClick]);

  // Start Clicking
  const startClicking = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    isRunningRef.current = true;
    sessionClicksRef.current = 0;
    playStartStopSound(true);

    setStats((prev) => ({
      ...prev,
      sessionClicks: 0,
      startTime: performance.now(),
    }));

    let initialInterval = getTotalIntervalMs(config);
    if (config.jitter && config.jitterRange > 0) {
      const jitterOffset = (Math.random() * 2 - 1) * config.jitterRange;
      initialInterval = Math.max(1, Math.round(initialInterval + jitterOffset));
    }

    timerRef.current = setTimeout(triggerNextClick, initialInterval);
  }, [config, isRunning, triggerNextClick]);

  // Stop Clicking
  const stopClicking = useCallback(() => {
    if (!isRunning) return;
    setIsRunning(false);
    isRunningRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    playStartStopSound(false);
  }, [isRunning]);

  // Toggle Clicking
  const toggleClicking = useCallback(() => {
    if (isRunning) {
      stopClicking();
    } else {
      startClicking();
    }
  }, [isRunning, startClicking, stopClicking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (macroTimeoutRef.current) clearTimeout(macroTimeoutRef.current);
    };
  }, []);

  // Global Hotkey Listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing in inputs or textareas unless it is F-keys or ESC
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea';

      if (e.key === 'Escape') {
        if (isRunning) {
          e.preventDefault();
          stopClicking();
        }
        if (isMacroRunning) {
          e.preventDefault();
          stopMacro();
        }
        if (isPickingCoordinate) {
          e.preventDefault();
          setIsPickingCoordinate(false);
        }
        return;
      }

      // Check if hotkey matches
      const targetKey = config.hotkey.toLowerCase();
      const pressedKey = e.key.toLowerCase();
      const pressedCode = e.code.toLowerCase();

      const isMatch =
        pressedKey === targetKey ||
        pressedCode === targetKey ||
        (targetKey === 'space' && e.code === 'Space') ||
        (targetKey === 'f6' && (e.key === 'F6' || e.code === 'F6'));

      if (isMatch) {
        if (isInput && !e.key.startsWith('F')) {
          // If typing regular letters into input, don't trigger hotkey
          return;
        }
        e.preventDefault();
        toggleClicking();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [config.hotkey, isRunning, isMacroRunning, isPickingCoordinate, stopClicking, toggleClicking]);

  // Macro Playback Engine
  const executeMacroStep = useCallback(
    (sequence: MacroSequence, stepIdx: number) => {
      if (!sequence.steps.length) return;
      const step = sequence.steps[stepIdx];
      if (!step) return;

      executeSingleClick(step.x, step.y, step.button, step.clickType);
      macroStepIndexRef.current = stepIdx;
      setMacroStepIndex(stepIdx);

      // Determine next step
      const nextIdx = stepIdx + 1;
      if (nextIdx < sequence.steps.length) {
        macroTimeoutRef.current = setTimeout(() => {
          executeMacroStep(sequence, nextIdx);
        }, step.delayMs || 250);
      } else {
        // End of sequence - check repeat
        macroTimeoutRef.current = setTimeout(() => {
          executeMacroStep(sequence, 0);
        }, step.delayMs || 250);
      }
    },
    [executeSingleClick]
  );

  const startMacro = useCallback(
    (sequence: MacroSequence) => {
      if (!sequence.steps.length) return;
      stopClicking();
      setIsMacroRunning(true);
      setActiveMacro(sequence);
      setMacroStepIndex(0);
      macroStepIndexRef.current = 0;
      playStartStopSound(true);
      executeMacroStep(sequence, 0);
    },
    [executeMacroStep, stopClicking]
  );

  const stopMacro = useCallback(() => {
    setIsMacroRunning(false);
    if (macroTimeoutRef.current) {
      clearTimeout(macroTimeoutRef.current);
      macroTimeoutRef.current = null;
    }
    playStartStopSound(false);
  }, []);

  const resetStats = useCallback(() => {
    setStats({
      totalClicksExecuted: 0,
      sessionClicks: 0,
      activeCPS: 0,
      peakCPS: 0,
      startTime: null,
      elapsedSeconds: 0,
    });
    sessionClicksRef.current = 0;
    recentClickTimestamps.current = [];
  }, []);

  return {
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
    executeSingleClick,
  };
}
