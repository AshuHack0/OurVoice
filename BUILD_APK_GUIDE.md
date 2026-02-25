# 📱 OurVoice - Build APK Guide

## 🎯 Production API Configuration

Your app is now configured to use the production API:

**Production API URL:** `https://our-voice-backend.vercel.app/api/v1`

✅ API service updated  
✅ App.json configured  
✅ Android package set: `com.ourvoice.app`

---

## 🚀 Build APK Options

You have **3 options** to build your APK:

### Option 1: EAS Build (Recommended) ⭐
### Option 2: Local Build with Android Studio
### Option 3: Development Build

---

## ⭐ Option 1: EAS Build (Recommended)

**Best for:** Production-ready APK with signing

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo
```bash
eas login
```
Enter your Expo account credentials (or create one at https://expo.dev)

### Step 3: Configure EAS
```bash
cd /Users/ashutosh/codes/OurVoice
eas build:configure
```

This creates `eas.json` file.

### Step 4: Build APK
```bash
# Build APK (for testing/distribution)
eas build -p android --profile preview

# OR build AAB (for Google Play Store)
eas build -p android --profile production
```

### Step 5: Download APK
- Build will run on Expo's servers
- You'll get a link to download the APK
- Or check: https://expo.dev/accounts/[your-account]/projects/ourvoice/builds

**Build Time:** 10-20 minutes  
**Output:** Production-ready APK

---

## 🔨 Option 2: Local Build with Android Studio

**Best for:** Full control, custom configurations

### Prerequisites
1. **Android Studio** installed
2. **Java JDK 17** installed
3. **Android SDK** configured

### Step 1: Install Dependencies
```bash
cd /Users/ashutosh/codes/OurVoice
npm install
```

### Step 2: Prebuild Android Project
```bash
npx expo prebuild --platform android
```

This generates the `android/` folder.

### Step 3: Build APK
```bash
cd android
./gradlew assembleRelease
```

### Step 4: Find Your APK
```bash
# APK location:
android/app/build/outputs/apk/release/app-release.apk
```

### Step 5: Sign APK (Optional but Recommended)

#### Generate Keystore
```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore ourvoice-release-key.keystore \
  -alias ourvoice-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

#### Configure Signing
Create `android/gradle.properties`:
```properties
MYAPP_RELEASE_STORE_FILE=ourvoice-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=ourvoice-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your_store_password
MYAPP_RELEASE_KEY_PASSWORD=your_key_password
```

Update `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

Rebuild:
```bash
./gradlew assembleRelease
```

**Build Time:** 5-10 minutes  
**Output:** `app-release.apk`

---

## 🧪 Option 3: Development Build

**Best for:** Quick testing with development features

### Step 1: Create Development Build
```bash
cd /Users/ashutosh/codes/OurVoice
eas build --profile development --platform android
```

### Step 2: Install on Device
```bash
# After build completes, install APK
adb install path/to/your-app.apk
```

**Note:** Development builds include debugging tools and are larger.

---

## 📦 Quick Start (Easiest Method)

### Using EAS Build (5 minutes setup)

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Go to project
cd /Users/ashutosh/codes/OurVoice

# 3. Login
eas login

# 4. Configure (first time only)
eas build:configure

# 5. Build APK
eas build -p android --profile preview

# 6. Wait for build (10-20 min)
# You'll get a download link!
```

---

## 🎯 Recommended: EAS Build with Preview Profile

Create `eas.json` (if not exists):

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

Then run:
```bash
eas build -p android --profile preview
```

---

## 📱 Install APK on Device

### Method 1: Direct Install (USB)
```bash
# Enable USB debugging on phone
# Connect phone via USB
adb install app-release.apk
```

### Method 2: Share APK
1. Upload APK to Google Drive / Dropbox
2. Share link with users
3. Users download and install
4. May need to enable "Install from Unknown Sources"

### Method 3: QR Code (EAS Build)
- EAS provides QR code after build
- Scan with phone to download
- Install directly

---

## ⚙️ Build Configuration Summary

### Current Settings
```json
{
  "name": "OurVoice",
  "version": "1.0.0",
  "package": "com.ourvoice.app",
  "versionCode": 1,
  "api": "https://our-voice-backend.vercel.app/api/v1"
}
```

### Permissions
- ✅ INTERNET
- ✅ ACCESS_NETWORK_STATE

---

## 🔍 Testing Your Build

### Before Building
```bash
# Test in development mode
npm start

# Test on Android emulator
npm run android

# Verify API connection
# Check if data loads from production API
```

### After Building
1. Install APK on real device
2. Test all features:
   - ✅ Daily questions load
   - ✅ Submit responses
   - ✅ View community responses
   - ✅ Vote on polls
   - ✅ Network connectivity
3. Check production API logs on Vercel

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules
npm install
```

### API Not Connecting
1. Check API is live: https://our-voice-backend.vercel.app/
2. Verify CORS settings on backend
3. Check internet permission in app.json

### APK Won't Install
1. Enable "Install from Unknown Sources"
2. Check Android version compatibility
3. Ensure APK is not corrupted

### Gradle Build Errors
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

---

## 📊 Build Comparison

| Feature | EAS Build | Local Build | Dev Build |
|---------|-----------|-------------|-----------|
| Setup Time | 5 min | 30 min | 5 min |
| Build Time | 15 min | 10 min | 15 min |
| Signing | Auto | Manual | Auto |
| Size | Optimized | Optimized | Large |
| Best For | Production | Custom | Testing |

---

## 🎯 Recommended Workflow

### For First Build
1. ✅ Use **EAS Build** (easiest)
2. ✅ Profile: `preview` (APK output)
3. ✅ Download and test
4. ✅ Share with testers

### For Production
1. ✅ Use **EAS Build**
2. ✅ Profile: `production` (AAB for Play Store)
3. ✅ Submit to Google Play
4. ✅ Or use `preview` for direct distribution

---

## 📝 Step-by-Step: EAS Build (Complete)

```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Navigate to project
cd /Users/ashutosh/codes/OurVoice

# 3. Login to Expo account
eas login
# Enter email and password

# 4. Configure EAS (first time)
eas build:configure
# Select: Android
# This creates eas.json

# 5. Build APK for testing
eas build -p android --profile preview
# Wait 10-20 minutes

# 6. Download APK
# Check your email or visit:
# https://expo.dev/accounts/[your-username]/projects/ourvoice/builds

# 7. Install on device
# Download APK to phone and install
# Or use: adb install downloaded-app.apk
```

---

## 🚀 Production Checklist

Before building for production:

- [ ] ✅ API URL updated to production
- [ ] ✅ Test all features in dev mode
- [ ] ✅ Update version in app.json
- [ ] ✅ Update app icons
- [ ] ✅ Test on real device
- [ ] ✅ Check permissions
- [ ] ✅ Verify CORS on backend
- [ ] ✅ Test network error handling
- [ ] ✅ Build and test APK
- [ ] ✅ Get feedback from testers

---

## 📞 Need Help?

### Common Commands
```bash
# Check Expo CLI version
expo --version

# Check EAS CLI version
eas --version

# View build status
eas build:list

# Cancel running build
eas build:cancel

# View build logs
eas build:view [build-id]
```

### Useful Links
- Expo Docs: https://docs.expo.dev/
- EAS Build: https://docs.expo.dev/build/introduction/
- Android Build: https://docs.expo.dev/build-reference/android-builds/

---

## ✅ Summary

**Your app is ready to build!**

### Quick Build (Recommended)
```bash
npm install -g eas-cli
cd /Users/ashutosh/codes/OurVoice
eas login
eas build:configure
eas build -p android --profile preview
```

**Wait 15 minutes → Download APK → Install → Test!**

### Production API
✅ **https://our-voice-backend.vercel.app/api/v1**

### Package
✅ **com.ourvoice.app**

**You're all set to build your APK!** 🎉
