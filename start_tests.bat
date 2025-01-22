@echo off
echo Starting Tests...

REM Uruchom testy Angular w nowym oknie
start cmd /k "cd %cd% && ng test"

echo Tests are starting. Press any key to close this window.
pause
