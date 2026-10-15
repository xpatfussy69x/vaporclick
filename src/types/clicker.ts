export type MouseButtonType = 'left' | 'right' | 'middle';
export type ClickType = 'single' | 'double' | 'triple';
export type RepeatType = 'infinite' | 'count';
export type CursorPositionType = 'current' | 'picked';

export interface ClickerConfig {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  jitter: boolean;
  jitterRange: number; // in ms
  mouseButton: MouseButtonType;
  clickType: ClickType;
  repeatType: RepeatType;
  repeatCount: number;
  cursorPositionType: CursorPositionType;
  targetX: number;
  targetY: number;
  hotkey: string;
}

export interface MacroStep {
  id: string;
  x: number;
  y: number;
  delayMs: number;
  button: MouseButtonType;
  clickType: ClickType;
}

export interface MacroSequence {
  name: string;
  repeatTimes: number; // 0 for infinite
  steps: MacroStep[];
}

export interface ClickRipple {
  id: string;
  x: number;
  y: number;
  color: string;
  button: MouseButtonType;
}

export interface ClickStats {
  totalClicksExecuted: number;
  sessionClicks: number;
  activeCPS: number;
  peakCPS: number;
  startTime: number | null;
  elapsedSeconds: number;
}
