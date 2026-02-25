#!/bin/bash

echo "🔍 Finding your computer's IP address..."
echo ""

# Try different methods to get IP
IP=""

# Method 1: en0 (WiFi)
IP=$(ipconfig getifaddr en0 2>/dev/null)

# Method 2: en1 (Ethernet)
if [ -z "$IP" ]; then
    IP=$(ipconfig getifaddr en1 2>/dev/null)
fi

# Method 3: Parse ifconfig
if [ -z "$IP" ]; then
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
fi

if [ -z "$IP" ]; then
    echo "❌ Could not automatically detect IP address"
    echo ""
    echo "Please find your IP manually:"
    echo "1. Open System Settings → Network"
    echo "2. Click on your active connection"
    echo "3. Look for 'IP Address'"
    echo ""
    echo "Then update these files:"
    echo "  - services/api.ts (line 15)"
    echo "  - ../ourVoiceBackend/.env (CORS_ORIGIN)"
else
    echo "✅ Your IP Address: $IP"
    echo ""
    echo "📝 Update these files with your IP:"
    echo ""
    echo "1. services/api.ts"
    echo "   Change line 15 to:"
    echo "   android: 'http://$IP:8085/api/v1',"
    echo ""
    echo "2. ../ourVoiceBackend/.env"
    echo "   Change CORS_ORIGIN to:"
    echo "   CORS_ORIGIN=http://localhost:8081,exp://$IP:8081,http://$IP:8085"
    echo ""
    echo "3. Restart backend: cd ../ourVoiceBackend && npm run dev"
    echo "4. Restart app: npx expo start --clear"
    echo ""
    echo "🧪 Test from your Android device browser:"
    echo "   http://$IP:8085/api/health"
fi

echo ""
