# Clear Browser Storage Instructions

## Quick Fix: Clear LocalStorage

### Method 1: Using Browser Console (Easiest - 10 seconds!)
1. Open your browser (Chrome/Edge/Firefox)
2. Press **F12** to open Developer Tools
3. Click the **Console** tab
4. Copy and paste this command:
   ```javascript
   localStorage.clear(); sessionStorage.clear(); location.reload();
   ```
5. Press **Enter**
6. Your page will refresh with clean storage!

### Method 2: Manual Clear (Also Easy!)
1. Press **F12** to open Developer Tools
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. In the left sidebar:
   - Click **Local Storage** → `http://localhost:5173`
   - Right-click and select **Clear**
   - Click **Session Storage** → `http://localhost:5173`
   - Right-click and select **Clear**
4. Refresh the page (**F5** or **Ctrl+R**)

### Method 3: Incognito/Private Window
1. Open a new **Incognito Window** (Ctrl+Shift+N in Chrome)
2. Go to `http://localhost:5173`
3. Register with your email now!

## What This Does:
- ✅ Clears all cached user data
- ✅ Removes old login tokens
- ✅ Resets authentication state
- ✅ Allows fresh registration

## After Clearing:
Now you can register with the same email because:
- MongoDB is clear (already done ✅)
- Browser storage is clear (you'll do this now ✅)
- Firebase still has the user (this is okay, just use the same password or a different email)

## Bonus: Clear Everything Script
If you want to clear everything including cookies:
```javascript
// Paste this in the Console:
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
location.reload();
```

---
**Recommended**: Use **Method 1** (paste the command in Console) - it's the fastest!
