#!/bin/bash

OS="$(uname -s)"

case "$OS" in
    CYGWIN*|MINGW*|MSYS*)
        # Windows - convert Windows path to proper format
        WIN_USER=$(cmd.exe /c "echo %USERNAME%" 2>/dev/null | tr -d '\r\n')
        printf 'sdk.dir=C\\:\\\\Users\\\\%s\\\\AppData\\\\Local\\\\Android\\\\Sdk\n' "$WIN_USER" > ./android/local.properties
        echo "local.properties written for user: $WIN_USER"
        ;;
    Darwin*)
        # Mac
        echo "sdk.dir=$HOME/Library/Android/sdk" > ./android/local.properties
        ;;
    Linux*)
        # Linux
        echo "sdk.dir=$HOME/Android/Sdk" > ./android/local.properties
        ;;
esac

echo "local.properties written!"

# Add location permission if it doesn't already exist
MANIFEST="./android/app/src/main/AndroidManifest.xml"
PERMISSION='<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>'

if ! grep -q "ACCESS_FINE_LOCATION" "$MANIFEST"; then
    sed -i '7a\    '"$PERMISSION" "$MANIFEST"
    echo "Permission added to AndroidManifest.xml"
else
    echo "Permission already exists, skipping..."
fi

# Install dependencies
echo "Installing npm dependencies..."
npm install

# Install special Expo modules that need expo install (not just npm i)
echo "Installing Expo managed dependencies..."
npx expo install expo-font
npx expo install expo-dev-client
npx expo install react-native-maps

echo "Setup done!"