/**
 * Script generators for Vapor Clicker
 * Enables users to run their exact configuration natively outside the web browser.
 */

export interface ClickerConfig {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  jitter: boolean;
  jitterRange: number; // in ms
  mouseButton: 'left' | 'right' | 'middle';
  clickType: 'single' | 'double' | 'triple';
  repeatType: 'infinite' | 'count';
  repeatCount: number;
  cursorPositionType: 'current' | 'picked';
  targetX: number;
  targetY: number;
  hotkey: string;
}

export function getTotalIntervalMs(config: ClickerConfig): number {
  const total =
    config.hours * 3600000 +
    config.minutes * 60000 +
    config.seconds * 1000 +
    config.milliseconds;
  return Math.max(1, total);
}

export function generateAHKScript(config: ClickerConfig): string {
  const interval = getTotalIntervalMs(config);
  const btn = config.mouseButton;
  const clickCount = config.clickType === 'double' ? 2 : config.clickType === 'triple' ? 3 : 1;
  const hotkeyFormatted = config.hotkey.toLowerCase().startsWith('f') 
    ? config.hotkey 
    : config.hotkey === 'Space' ? 'Space' : config.hotkey.toLowerCase();

  return `; ==========================================
; VAPOR CLICKER (AHK v1.1 / v2 Compatible)
; Generated for: ${interval}ms interval, ${btn} button, ${config.clickType} click
; ==========================================
#NoEnv
#SingleInstance Force
SetBatchLines -1
Process, Priority,, High

global Clicking := false
global Interval := ${interval}
global ClickButton := "${btn}"
global ClickCount := ${clickCount}

${hotkeyFormatted}::
    Clicking := !Clicking
    if (Clicking) {
        SoundBeep, 750, 100
        SetTimer, DoClick, %Interval%
    } else {
        SoundBeep, 450, 100
        SetTimer, DoClick, Off
    }
return

DoClick:
    if (!Clicking) {
        SetTimer, DoClick, Off
        return
    }
    ${config.cursorPositionType === 'picked' ? `MouseMove, ${config.targetX}, ${config.targetY}, 0` : ''}
    ${config.jitter ? `Random, randJitter, -${config.jitterRange}, ${config.jitterRange}` : ''}
    Click, %ClickButton%, %ClickCount%
return

Esc::
    Clicking := false
    SetTimer, DoClick, Off
    ExitApp
return
`;
}

export function generatePythonScript(config: ClickerConfig): string {
  const intervalSec = (getTotalIntervalMs(config) / 1000).toFixed(4);
  const btn = config.mouseButton;
  const clicks = config.clickType === 'double' ? 2 : config.clickType === 'triple' ? 3 : 1;
  const hotkey = config.hotkey.toLowerCase();

  return `# ==========================================
# VAPOR CLICKER (Python + PyAutoGUI + Keyboard)
# Requirements: pip install pyautogui keyboard
# ==========================================
import pyautogui
import keyboard
import time
import random
import threading

running = False
interval = ${intervalSec}  # seconds
button = '${btn}'
clicks_per_trigger = ${clicks}
target_x = ${config.targetX}
target_y = ${config.targetY}
use_fixed_coord = ${config.cursorPositionType === 'picked' ? 'True' : 'False'}
use_jitter = ${config.jitter ? 'True' : 'False'}
jitter_range = ${config.jitterRange / 1000}

def click_worker():
    global running
    print(f"[VaporClick] Active. Press '${hotkey}' to toggle, 'ESC' to quit.")
    while True:
        if running:
            if use_fixed_coord:
                pyautogui.click(x=target_x, y=target_y, button=button, clicks=clicks_per_trigger)
            else:
                pyautogui.click(button=button, clicks=clicks_per_trigger)
            
            sleep_time = interval
            if use_jitter:
                sleep_time += random.uniform(-jitter_range, jitter_range)
            time.sleep(max(0.001, sleep_time))
        else:
            time.sleep(0.02)

def toggle_clicking():
    global running
    running = not running
    print(f"[VaporClick] Status: {'RUNNING' if running else 'PAUSED'}")

threading.Thread(target=click_worker, daemon=True).start()
keyboard.add_hotkey('${hotkey}', toggle_clicking)
keyboard.wait('esc')
print("[VaporClick] Exited.")
`;
}

export function generateBookmarklet(config: ClickerConfig): string {
  const interval = getTotalIntervalMs(config);
  const btn = config.mouseButton;
  const clickType = config.clickType;
  const clicks = clickType === 'double' ? 2 : clickType === 'triple' ? 3 : 1;

  const script = `(function(){
  if (window.__vaporClickerActive) {
    clearInterval(window.__vaporClickerTimer);
    window.__vaporClickerActive = false;
    console.log("%c[VaporClick] STOPPED", "color:#ff71ce;font-weight:bold");
    return;
  }
  window.__vaporClickerActive = true;
  console.log("%c[VaporClick] STARTED (${interval}ms, ${btn})", "color:#01cdfe;font-weight:bold");
  
  let lastX = ${config.cursorPositionType === 'picked' ? config.targetX : 'window.innerWidth / 2'};
  let lastY = ${config.cursorPositionType === 'picked' ? config.targetY : 'window.innerHeight / 2'};
  
  ${config.cursorPositionType === 'current' ? `
  window.addEventListener('mousemove', function(e){ lastX = e.clientX; lastY = e.clientY; }, {passive:true});
  ` : ''}

  window.__vaporClickerTimer = setInterval(function(){
    if (!window.__vaporClickerActive) return;
    const elem = document.elementFromPoint(lastX, lastY) || document.body;
    for (let i = 0; i < ${clicks}; i++) {
      elem.dispatchEvent(new MouseEvent('mousedown', {bubbles: true, cancelable: true, clientX: lastX, clientY: lastY, button: ${btn === 'right' ? 2 : btn === 'middle' ? 1 : 0}}));
      elem.dispatchEvent(new MouseEvent('mouseup', {bubbles: true, cancelable: true, clientX: lastX, clientY: lastY, button: ${btn === 'right' ? 2 : btn === 'middle' ? 1 : 0}}));
      elem.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, clientX: lastX, clientY: lastY, button: ${btn === 'right' ? 2 : btn === 'middle' ? 1 : 0}}));
    }
  }, ${interval});
})();`;

  return `javascript:${encodeURIComponent(script)}`;
}
