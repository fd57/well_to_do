import 'dotenv/config';

export default {
  "expo": {
    "name": "well_to_do",
    "slug": "well_to_do",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      // databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      // measurementId: process.env.MEASUREMENT_ID,
      "eas": {
        "projectId": "67c749a6-6c15-4256-828f-6f8e6d1b2cdd"
      },
    },
    "owner": "fdesai",
    "updates": {
      "url": "https://u.expo.dev/67c749a6-6c15-4256-828f-6f8e6d1b2cdd"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    },
  }
}
