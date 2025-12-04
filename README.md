## Chat App (React Native + Expo + Firebase)

A real-time mobile chat application built with React Native and Expo, developed as part of the CareerFoundry Full-Stack Web Development Program — Achievement 5: Building Native Applications with JavaScript.

The app enables users to chat in real time, share images, take photos, send their geolocation, and store messages securely in Google Firebase.

---

## Overview

- Enter your name and choose a background color
- Send and receive text messages
- Pick and send images
- Take photos using the device’s camera
- Share your current location (displayed on a map)
- Offline support — messages are cached locally
- Chat data stored in Firebase Firestore + media in Firebase Storage
- Anonymous authentication via Firebase Auth

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
- Fully styled according to CareerFoundry design brief

### Chat Screen

- Real-time chat interface using Gifted Chat
- Supports:
  📸 Taking photos with the camera
  🖼️ Picking images from gallery
  📍 Sharing geolocation (MapView bubble)
- Custom ActionSheet with accessible buttons
- Local caching for offline usage
- Firebase Storage integration for media

### Work in Progress: Chatbot Simulation

We are actively developing an optional chatbot mode that simulates a real conversation partner.

This upcoming feature will:

- Automatically reply to messages
- Provide simple conversational logic
- Help users test the chat experience without a second device
- Be fully integrated into the existing Gifted Chat interface

The bot is being implemented using local JS logic and can later be enhanced with AI-based responses.

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

### 4. Run the app

npx expo start

- Press a for Android emulator
- Scan QR code with Expo Go on mobile

---

### Permissions Required

This app uses the following permissions:

- CAMERA → to take photos
- MEDIA_LIBRARY → to pick images
- LOCATION → to share user’s geolocation

Expo will automatically request these permissions at runtime.

---

### Design

The layout and color scheme follow the official CareerFoundry Chat App design brief.
Background image and color palette are provided in the project’s assets.

Color options:

Name HEX
Dark #090C08
Purple #474056
Blue Gray #8A95A5
Green Gray #B9C6AE

---

### Testing Checklist

✅ Enter the chat and send text messages
✅ Pick and send an image from library
✅ Take and send a photo with the camera
✅ Share current geolocation (map preview appears)
✅ Verify messages appear in Firestore
✅ Verify uploaded images in Firebase Storage

---

### Documentation & Accessibility

    - Code includes comments explaining complex logic (Firebase upload, geolocation)
    - Action buttons include accessibility labels for screen readers
    - All assets and dependencies are included in the repo
    - README.md tested by cloning repo and following setup steps

---

### Learning Objectives

- Code includes explanatory comments
- Accessible ActionSheet buttons
- Setup verified on fresh installations

---

### Bonus (Optional)

You can extend the app with:

🎙️ Audio recording & playback
📂 Cloud sync improvements
🌙 Dark mode support

---

## Demo (GIF)

<!-- ![App Demo](./screenshot/chat.gif) -->

<p align="center">
  <img src="./screenshot/chat.gif" width="350" />
</p>
