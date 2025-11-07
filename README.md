## Chat App (React Native + Expo + Firebase)

A real-time mobile chat application built with React Native and Expo, as part of the CareerFoundry Full-Stack Web Development Program — Achievement 5: Building Native Applications with JavaScript.

The app enables users to chat in real time, share images, take photos, send their geolocation, and store messages securely in Google Firebase.

---

## Overview

- The app allows users to:
- Enter their name and choose a background color
- Send and receive text messages
- Pick images from the library and send them
- Take photos using the device’s camera and share them
- Share their current location (displayed as a map in the chat)
- Work offline — messages are cached locally and synced when back online
- Store chat data in Firebase Firestore and media in Firebase Storage

---

## 🛠️ Built With

- **React Native**
- **Expo CLI**
- **React Navigation (Native Stack)**
- **Android Emulator (Android Studio)**
- **JavaScript (ES6)**

---

## Features

### Start Screen

- Input for username
- Background color selection
- Button to start chatting
- Background image with accessible color option

### Chat Screen

- Real-time chat interface using Gifted Chat
- Displays messages, images, and shared locations
- Custom CustomActions component for:
  📸 Taking photos with the camera
  🖼️ Picking images from gallery
  📍 Sharing location
- Images and photos uploaded to Firebase Storage
- Location displayed via MapView in message bubbles
- Accessibility support (for the ActionSheet button)

---

## Project Structure

chat-app/
├── App.js
├── components/
│ ├── Start.js # Start screen (user input + color selection)
│ ├── Chat.js # Main chat screen
│ └── CustomActions.js # Custom ActionSheet (image/photo/location)
├── assets/
│ ├── background-image.png
│ └── icon.png
├── firebase/
│ └── config.js # Firebase initialization (Firestore + Storage)
├── package.json
└── README.md

## Installation & Setup

### 1. Clone the repository

git clone https://github.com/ghostmaruko/chat-app.git
cd new-chat-app

### 2. Install dependencies

npm install

### 3. Configure Firebase

Create a new Firebase project on Firebase Console

In your project folder, create a file:
/firebase/config.js
----------------------------------------------------
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_PROJECT_ID.appspot.com",
messagingSenderId: "XXXXXXX",
appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
----------------------------------------------------

### 4. Run the app

- npx expo start
- On Android emulator: press a
- On physical device: scan the QR code in Expo Go

### Permissions Required

This app uses the following permissions:

- CAMERA → to take photos
- MEDIA_LIBRARY → to pick images
- LOCATION → to share user’s geolocation

Expo will automatically request these permissions at runtime.

### Design

The layout and color scheme follow the official CareerFoundry Chat App design brief.
Background image and color palette are provided in the project’s assets.

Color options:

Name HEX
Dark #090C08
Purple #474056
Blue Gray #8A95A5
Green Gray #B9C6AE

### Testing Checklist

✅ Enter the chat and send text messages
✅ Pick and send an image from library
✅ Take and send a photo with the camera
✅ Share current geolocation (map preview appears)
✅ Verify messages appear in Firestore
✅ Verify uploaded images in Firebase Storage

### Documentation & Accessibility

    - Code includes comments explaining complex logic (Firebase upload, geolocation)
    - Action buttons include accessibility labels for screen readers
    - All assets and dependencies are included in the repo
    - README.md tested by cloning repo and following setup steps

### Learning Objectives

- Understand how to build React Native apps with Expo
- Implement navigation using @react-navigation/native
- Use Flexbox for mobile layout
- Work with ImageBackground and TouchableOpacity
- Pass params between screens (name, color)
- Apply custom styling to UI elements

### Bonus (Optional)

You can extend the app with:

🎙️ Audio recording & playback
📂 Cloud sync improvements
🌙 Dark mode support
