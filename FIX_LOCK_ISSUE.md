# Fix Next.js Lock File Issue

## Problem
Next.js shows: "Unable to acquire lock at .next/dev/lock, is another instance of next dev running?"

## Solutions

### Solution 1: Kill the Process (Recommended)

**Windows Command Prompt:**
```cmd
taskkill /F /PID 12416
```

**Or kill all Node processes:**
```cmd
taskkill /F /IM node.exe
```

**PowerShell:**
```powershell
Stop-Process -Id 12416 -Force
```

**Git Bash:**
```bash
cmd //c "taskkill /F /PID 12416"
```

### Solution 2: Remove Lock File

**Windows:**
```cmd
del /F /Q ".next\dev\lock"
```

**Git Bash:**
```bash
rm -rf .next/dev/lock
```

### Solution 3: Delete .next Folder (Nuclear Option)

If nothing else works:
```bash
rm -rf .next
```

Then restart:
```bash
npm run dev
```

### Solution 4: Find and Kill All Node Processes

**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /F /PID <PID_NUMBER>
```

**Or kill all Node:**
```cmd
taskkill /F /IM node.exe
```

## Quick Fix Script

Create a file `kill-node.bat`:
```batch
@echo off
echo Killing Node.js processes...
taskkill /F /IM node.exe
echo Removing lock file...
if exist ".next\dev\lock" del /F /Q ".next\dev\lock"
echo Done! You can now run: npm run dev
pause
```

## After Fixing

1. Remove lock file or kill process
2. Restart dev server:
   ```bash
   npm run dev
   ```

## Prevention

- Always stop the dev server properly (Ctrl+C)
- Don't run multiple instances of `npm run dev`
- Close terminal windows properly

