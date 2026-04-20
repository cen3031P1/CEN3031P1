import 'dotenv/config'

export default {
  "expo": {
    "name": "gator-fit",
    "slug": "gator-fit",
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
      }
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