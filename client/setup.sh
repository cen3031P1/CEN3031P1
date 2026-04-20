#!/bin/bash

#!/bin/bash

OS="$(uname -s)"

case "$OS" in
    Linux*|Darwin*)
        # Mac/Linux path
        SDK_PATH="$HOME/Library/Android/sdk"
        ;;
    CYGWIN*|MINGW*|MSYS*)
        # Windows (Git Bash)
        WIN_USER=$(cmd.exe /c "echo %USERNAME%" 2>/dev/null | tr -d '\r')
        SDK_PATH="C:\\\\Users\\\\${WIN_USER}\\\\AppData\\\\Local\\\\Android\\\\Sdk"
        ;;
esac

if [ ! -f ./android/local.properties ]; then
    echo "sdk.dir=$SDK_PATH" >> ./android/local.properties
    echo "Created local.properties with SDK path: $SDK_PATH"
else
    echo "local.properties already exists, skipping..."
fi

sed -i '7a\<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>' ./android/app/src/main/AndroidManifest.xml

echo "Setup done!"