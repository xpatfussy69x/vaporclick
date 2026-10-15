import React from 'react';
import { ClickRipple, CursorPositionType, MacroSequence } from '../types/clicker';

interface ClickRipplesLayerProps {
  ripples: ClickRipple[];
  cursorPositionType: CursorPositionType;
  targetX: number;
  targetY: number;
  isPickingCoordinate: boolean;
  mousePos: { x: number; y: number };
  activeMacro: MacroSequence | null;
  isMacroRunning: boolean;
  macroStepIndex: number;
}

export const ClickRipplesLayer: React.FC<ClickRipplesLayerProps> = ({
  ripples,
  cursorPositionType,
  targetX,
  targetY,
  isPickingCoordinate,
  mousePos,
  activeMacro,
  isMacroRunning,
  macroStepIndex,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* 1. Dynamic click ripple circles */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full border-2 animate-ripple pointer-events-none"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: '40px',
            height: '40px',
            borderColor: ripple.color,
            boxShadow: `0 0 12px ${ripple.color}`,
          }}
        />
      ))}

      {/* 2. Fixed Picked Coordinate Reticle */}
      {cursorPositionType === 'picked' && targetX > 0 && targetY > 0 && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200"
          style={{ left: `${targetX}px`, top: `${targetY}px` }}
        >
          {/* Outer pulsing ring */}
          <div className="w-10 h-10 border-2 border-[#fffb96] rounded-full animate-ping opacity-60" />
          {/* Inner crosshair reticle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border border-[#fffb96] rounded-full flex items-center justify-center shadow-[0_0_10px_#fffb96]">
              <div className="w-1.5 h-1.5 bg-[#ff71ce] rounded-full" />
            </div>
            {/* Crosshair lines */}
            <div className="absolute w-8 h-[1px] bg-[#fffb96]/80" />
            <div className="absolute h-8 w-[1px] bg-[#fffb96]/80" />
          </div>
          {/* Coordinate label */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#0b0314]/90 border border-[#fffb96] px-1.5 py-0.5 text-[9px] text-[#fffb96] font-mono whitespace-nowrap font-bold shadow-md">
            X:{targetX} Y:{targetY}
          </div>
        </div>
      )}

      {/* 3. Coordinate Picker Active Reticle */}
      {isPickingCoordinate && (
        <div
          className="fixed pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        >
          <div className="w-12 h-12 border-2 border-dashed border-[#ff71ce] rounded-full animate-spin flex items-center justify-center" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#01cdfe] rounded-full" />
          </div>
          <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-[#120524] border border-[#ff71ce] px-2 py-1 text-[10px] text-[#05ffa1] font-mono font-bold whitespace-nowrap shadow-[0_0_12px_rgba(255,113,206,0.5)]">
            CLICK ANYWHERE TO LOCK [X: {mousePos.x}, Y: {mousePos.y}]
          </div>
        </div>
      )}

      {/* 4. Active Macro Sequence Visual Path */}
      {isMacroRunning && activeMacro && activeMacro.steps.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {activeMacro.steps.map((step, idx) => {
            const nextStep = activeMacro.steps[(idx + 1) % activeMacro.steps.length];
            const isCurrent = macroStepIndex === idx;
            return (
              <g key={step.id}>
                {/* Connecting line to next point */}
                <line
                  x1={step.x}
                  y1={step.y}
                  x2={nextStep.x}
                  y2={nextStep.y}
                  stroke="#b967ff"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
                {/* Point circle */}
                <circle
                  cx={step.x}
                  cy={step.y}
                  r={isCurrent ? 10 : 6}
                  fill={isCurrent ? '#05ffa1' : '#ff71ce'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className={isCurrent ? 'animate-pulse' : ''}
                />
                <text
                  x={step.x + 12}
                  y={step.y + 4}
                  fill="#ffffff"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  #{idx + 1}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
};
