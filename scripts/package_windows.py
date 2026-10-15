import urllib.request
import zipfile
import shutil
import os
import subprocess

def build():
    print("[1/5] Building web distribution...")
    os.system("npm run build")

    zip_url = "https://github.com/electron/electron/releases/download/v30.0.0/electron-v30.0.0-win32-x64.zip"
    zip_path = "electron_win.zip"
    build_dir = "build_win"

    if not os.path.exists(zip_path):
        print(f"[2/5] Downloading Electron win32-x64 runtime (~100MB)...")
        urllib.request.urlretrieve(zip_url, zip_path)
    else:
        print("[2/5] Using cached Electron zip...")

    if os.path.exists(build_dir):
        shutil.rmtree(build_dir)
    os.makedirs(build_dir, exist_ok=True)

    print("[3/5] Extracting Windows binaries...")
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(build_dir)

    print("[4/5] Injecting Vapor Clicker application...")
    app_dir = os.path.join(build_dir, "resources", "app")
    os.makedirs(app_dir, exist_ok=True)

    # Copy dist
    shutil.copytree("dist", os.path.join(app_dir, "dist"))
    
    # Copy electron entry
    os.makedirs(os.path.join(app_dir, "electron"), exist_ok=True)
    shutil.copy("electron/main.cjs", os.path.join(app_dir, "electron", "main.cjs"))

    # App package.json
    with open(os.path.join(app_dir, "package.json"), "w") as f:
        f.write('{"name": "vapor-clicker", "version": "1.0.0", "main": "electron/main.cjs"}')

    # Rename electron.exe -> VaporClicker.exe inside build_win
    src_exe = os.path.join(build_dir, "electron.exe")
    dst_exe = os.path.join(build_dir, "VaporClicker.exe")
    if os.path.exists(src_exe):
        os.rename(src_exe, dst_exe)

    print("[5/5] Compiling NSIS single-file installer (VaporClicker-Setup.exe)...")
    res = subprocess.run(["makensis", "scripts/installer.nsi"], capture_output=True, text=True)
    if res.returncode != 0:
        print("NSIS Error:", res.stderr)
        raise RuntimeError("makensis failed")
    
    print("NSIS output:", res.stdout[-300:])

    # Also build portable zip
    shutil.make_archive("VaporClicker-Portable", 'zip', build_dir)

    print("SUCCESS! Created:")
    print(" - VaporClicker-Setup.exe (Single-file Windows Installer)")
    print(" - VaporClicker-Portable.zip (Portable Standalone ZIP)")

if __name__ == "__main__":
    build()
