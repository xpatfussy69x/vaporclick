!include "MUI2.nsh"

Name "Vapor Clicker"
OutFile "../VaporClicker-Setup.exe"
InstallDir "$LOCALAPPDATA\Programs\VaporClicker"
RequestExecutionLevel user

!define MUI_ABORTWARNING
!define MUI_WELCOMEPAGE_TITLE "Welcome to Vapor Clicker"
!define MUI_WELCOMEPAGE_TEXT "This will install Vapor Clicker on your Windows computer.$\r$\n$\r$\nClick Next to continue."

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES

!define MUI_FINISHPAGE_RUN "$INSTDIR\VaporClicker.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch Vapor Clicker now"
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

Section "Install"
  SetOutPath "$INSTDIR"
  File /r "../build_win/*"

  CreateDirectory "$SMPROGRAMS\Vapor Clicker"
  CreateShortCut "$SMPROGRAMS\Vapor Clicker\Vapor Clicker.lnk" "$INSTDIR\VaporClicker.exe"
  CreateShortCut "$DESKTOP\Vapor Clicker.lnk" "$INSTDIR\VaporClicker.exe"
SectionEnd
