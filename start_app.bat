@echo off
echo Starting Web Application and API...

REM Uruchom aplikację Angular w nowym oknie
start cmd /k "cd %cd% && ng serve"

REM Uruchom API w innym nowym oknie (ścieżka względna do folderu API)
start cmd /k "cd %cd%\API\milionerzy_api && java -jar target\milionerzy_api-1.0.0.jar"

echo Both services are starting. Press any key to close this window.
pause

