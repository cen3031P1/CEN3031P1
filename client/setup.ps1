$WIN_USER = $env:USERNAME
$sdkPath = "sdk.dir=C\:\\Users\\$env:USERNAME\\AppData\\Local\\Android\\Sdk"
Set-Content -Path android\local.properties -Value $sdkPath -Encoding ASCII

$manifest = "android\app\src\main\AndroidManifest.xml"
$lines = Get-Content $manifest
$newLine = '    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>'


# Only add if it doesn't already exist
if ($lines -notcontains $newLine.Trim()) {
    $lines = $lines[0..6] + $newLine + $lines[7..($lines.Length - 1)]
    $lines | Out-File -FilePath $manifest -Encoding utf8
    Write-Host "Permission added to AndroidManifest.xml"
} else {
    Write-Host "Permission already exists, skipping..."
}

# Install dependencies
Write-Host "Installing npm dependencies..."
npm install

# Install special Expo modules that need expo install (not just npm i)
Write-Host "Installing Expo managed dependencies..."
npx expo install expo-font
npx expo install expo-dev-client
npx expo install react-native-maps
npx expo install expo-task-manager
npx expo install

Write-Host "Done!"