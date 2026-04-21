#!/bin/bash

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

sed -i '7a\<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>' ./android/app/src/main/AndroidManifest.xml

echo "Setup done!"