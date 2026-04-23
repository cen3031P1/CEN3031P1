import 'dotenv/config'

export default {
  "expo": {
    "name": "gator-fit",
    "slug": "client",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./app/assets/images/gfit_logo.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./app/assets/images/gfit_logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "bundleIdentifier": "com.csilva1.client",
      "supportsTablet": true
    },
    "android": {
      "package": "com.csilva1.client",
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE"
      },
      "permissions": [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "ACCESS_BACKGROUND_LOCATION",
      "FOREGROUND_SERVICE",
      "FOREGROUND_SERVICE_LOCATION"
      ]
    },
    "web": {
      "favicon": "./app/assets/images/gfit_logo.png"
    },
    "plugins": [
      "expo-font",
      "expo-dev-client",
      [
        "react-native-maps",
        {
          "androidGoogleMapsApiKey": process.env.GOOGLE_API_KEY,
          "iosGoogleMapsApiKey": process.env.GOOGLE_API_KEY
        }
      ]
    ],
    "extra": {
    "googleMapsApiKey": process.env.GOOGLE_API_KEY,
      "eas": {
        "projectId": "5c5f0b40-474a-4da5-9653-01f6a1ebf98b"
      }
    }
  }
}