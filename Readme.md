# App info

- Chat app for mobile devices built using react native.

<span>
<img alt="Screenshot of ChatApp homescreen" src="/assets/homescreen.jpg"/> <img alt="Chat interface" src="/assets/chat.jpg"/>
</span>

# Key features

- A page where users can enter their name and choose a background color for the chat screen
  before joining the chat.
- A page displaying the conversation, as well as an input field and submit button.
- The app provides users with three additional communication features: sending images, audio and location data.
- The apps stores picutres taken with camera in the device media library
- Data gets stored online and offline.

# Technologies used

1. React Native
2. Google firebase
3. Expo
4. React Native Gifted Chat

# Dependencies

- "@react-navigation/native": "^6.1.8",
- "@react-navigation/native-stack": "^6.9.14",
- "@react-native-async-storage/async-storage": "1.18.2",
- "@react-native-community/netinfo": "9.3.10",
- "expo": "~49.0.13",
- "expo-status-bar": "~1.6.0",
- "firebase": "^10.3.1",
- "react": "18.2.0",
- "react-native": "0.72.5",
- "react-native-gifted-chat": "^2.4.0",
- "react-native-media-query": "^2.0.1",
- "react-native-safe-area-context": "4.6.3",
- "react-native-screens": "~3.22.0",
- "expo-location": "~16.1.0",
- "react-native-maps": "1.7.1",
- "expo-media-library": "~15.4.1",
- "expo-image-picker": "~14.3.2",
- "expo-av": "~13.4.1

# Notes for local development Environment (Expo)

- Install node 16.19.0 : `nvm install 16.19.0`
- Install Expo : `npm install -g expo-cli`
- Install Expo Go App from play-store or Apple store to run the app on your device or install an emulator if you want to test on a virtual device (Android Studio recommended but not mandatory)
- Start expo: `expo start`

## Setting up Google's Firebase Database

### Messages database

1. Sign-up or sign in to Firebase (https://firebase.google.com/) and create a project
2. npm install firebase to add firebase connection into your project directory
3. Copy the Firebase Config from the project setting tab and paste into you App.js file
4. In order to allow read and write access to the database - navigate to the rules tab in the console and change the code from `allow read, write: if false;` to `allow read, write: if true;` then click `Publish`.

### Media database

- Head to firebase, select your project and select `Build` and then `Storage` from the left-hand menu.
- A popup will apprear, Keep everything on default and press Next, then Done
- Go to the Rules tab, change `allow read, write: if false;` to `allow read, write: if true`, and click `Publish`

# Testing this project

1. Setup the `local dev environment` as explained above
2. Download this folder
3. open the terminal or Powershel and move into this folder
4. Start expo with the comman: expo start
