@echo off
setlocal
set "NODE="
where node >nul 2>nul
if not errorlevel 1 set "NODE=node"
if defined NODE goto :run
if exist "C:\Users\Administrator\AppData\Local\OpenAI\Codex\runtimes\cua_node\b474a88d5d105afa\bin\node.exe" (
  set "NODE=C:\Users\Administrator\AppData\Local\OpenAI\Codex\runtimes\cua_node\b474a88d5d105afa\bin\node.exe"
  goto :run
)
for /f "delims=" %%N in ('dir /b /s "C:\Users\Administrator\AppData\Local\OpenAI\Codex\runtimes\node.exe" 2^>nul') do (
  if not defined NODE set "NODE=%%N"
)
if not defined NODE (
  echo [Leano] Node.js not found. 1>&2
  pause
  exit /b 1
)
:run
echo [Leano] Starting local server... keep this window open.
"%NODE%" "%~dp0server.js"
pause