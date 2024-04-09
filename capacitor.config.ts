import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'DailyTasks',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    "GoogleAuth": {
      "scopes": [
        "profile",
        "email"
      ],
      "clientId": "334552631074-p1ek35mnsjaa3ptq524od78rnq0vqhe5.apps.googleusercontent.com",
      "androidClientId": "334552631074-p1ek35mnsjaa3ptq524od78rnq0vqhe5.apps.googleusercontent.com",
      "serverClientId": "334552631074-p1ek35mnsjaa3ptq524od78rnq0vqhe5.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true
    }
  }
};

export default config;
