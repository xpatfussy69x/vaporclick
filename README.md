# Vapor Clicker

An authentic 90s Vaporwave-styled auto-clicking utility and performance benchmark application.

![Vapor Clicker Screenshot](src/assets/images/vapor_clicker_screenshot_1792026866385.jpg)

## Features

- **Click Interval Controls**:
  - Milliseconds precision (down to 1ms).
  - Seconds, Minutes, and Hours inputs.
  - Quick interval presets (10ms, 50ms, 100ms, 250ms, 500ms).
  - **Humanizer Jitter**: Optional randomized interval variance ($\pm\text{ms}$) to simulate natural human variation.

- **Click Options**:
  - Mouse Buttons: **Left**, **Right**, or **Middle**.
  - Click Types: **Single**, **Double**, or **Triple** clicks.

- **Click Repeat Modes**:
  - Repeat until stopped (infinite mode).
  - Repeat exact count with live countdown progress.

- **Targeting & Coordinates**:
  - **Current Location**: Follows mouse cursor in real time.
  - **Pick Location**: Set fixed `(X, Y)` coordinates with an interactive reticle picker.
  - Visual target radar crosshairs and ripple animations.

- **Global Hotkeys**:
  - Default `F6` Start/Stop toggle.
  - Custom hotkey remapping (Space, F8, X, etc.) and `ESC` emergency stop.

- **Multi-Target Macro Recorder**:
  - Live click and waypoint sequence recorder.
  - Custom delays, button types, and visual waypoint path tracing.
  - Export and import macro profiles via JSON.

- **CPS Benchmark & Sandbox**:
  - Live speedometer gauge with peak CPS and rolling telemetry graph.
  - Rating tier evaluations (Casual, Pro Gamer, Turbo, Overclock, Lightspeed Max).
  - Interactive pixel canvas pad.

- **Desktop Script Exporters**:
  - 1-click export for **AutoHotkey (.ahk)**, **Python (`pyautogui`)**, **Browser Bookmarklet**, and **PowerShell** to run the clicker globally outside the browser.

- **Vaporwave Aesthetics & Audio**:
  - CRT scanlines toggle and retro Windows 95 3D bevels.
  - Synthesized Web Audio API sound effects (Cherry MX mechanical switch, 8-bit arcade beep, synth pop, vapor chime, or mute).

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## License
MIT
