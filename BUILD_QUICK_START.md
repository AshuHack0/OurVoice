# 🚀 Quick Start - Build APK

## ⚡ Fastest Way (5 Minutes Setup)

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Navigate to Project
```bash
cd /Users/ashutosh/codes/OurVoice
```

### Step 3: Login to Expo
```bash
eas login
```
*Create account at https://expo.dev if you don't have one*

### Step 4: Build APK
```bash
eas build -p android --profile preview
```

### Step 5: Wait & Download
- Build takes **10-20 minutes**
- You'll get an **email** with download link
- Or check: https://expo.dev (Your Projects → OurVoice → Builds)

### Step 6: Install on Phone
1. Download APK to your phone
2. Enable "Install from Unknown Sources"
3. Open APK file and install
4. Done! 🎉

---

## 📱 What's Configured

✅ **Production API:** https://our-voice-backend.vercel.app/api/v1  
✅ **Package Name:** com.ourvoice.app  
✅ **Version:** 1.0.0  
✅ **Permissions:** Internet access  

---

## 🎯 Alternative: Local Build

If you have Android Studio installed:

```bash
# Generate android folder
npx expo prebuild --platform android

# Build APK
cd android
./gradlew assembleRelease

# Find APK at:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 🐛 Troubleshooting

### "eas: command not found"
```bash
npm install -g eas-cli
```

### "Not logged in"
```bash
eas login
```

### Build Failed
```bash
# Check build logs
eas build:list
# Click on failed build for details
```

### API Not Working
- Verify: https://our-voice-backend.vercel.app/
- Check internet connection on phone
- Ensure CORS is set to `*` on backend

---

## ✅ Quick Checklist

- [ ] EAS CLI installed
- [ ] Logged into Expo account
- [ ] In OurVoice directory
- [ ] Run `eas build -p android --profile preview`
- [ ] Wait for build to complete
- [ ] Download APK
- [ ] Install on phone
- [ ] Test the app!

---

## 📞 Need Full Guide?

See `BUILD_APK_GUIDE.md` for detailed instructions.

---

**Ready to build? Run this now:**

```bash
npm install -g eas-cli && cd /Users/ashutosh/codes/OurVoice && eas login && eas build -p android --profile preview
```

**That's it! Your APK will be ready in 15-20 minutes!** 🚀
