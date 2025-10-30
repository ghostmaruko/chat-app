# Chat App (React Native + Expo)

A simple **mobile chat application** built with **React Native** and **Expo** as part of the CareerFoundry Full-Stack Web Development Program — Achievement 5.1: _Building Native Applications with JavaScript_.

This is the **first milestone** of the Chat App project.  
In this task, the focus is on creating the **Start Screen** and setting up navigation to the **Chat Screen**.

---

## Overview

The app allows users to:

- Enter their **name**
- Choose a **background color** for the chat screen
- Navigate to the chat interface (implemented in later Achievements)

The **Chat Screen** displays the user’s name in the header and applies the selected background color to the chat interface.

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

- `TextInput` for user’s name
- Four color options for chat background (using `TouchableOpacity`)
- “Start Chatting” button that navigates to the chat screen
- Background image (`ImageBackground`) as per the design brief

### Chat Screen

- Displays user’s name in navigation bar
- Background color changes based on selected color
- Simple text placeholder for chat UI (to be implemented in next exercise)

---

## Project Structure

chat-app/
├── App.js
├── components/
│ ├── Start.js # Start screen (name input + color selection)
│ └── Chat.js # Chat screen (receives name and color)
├── assets/
│ └── background-image.png
├── package.json
└── README.md

## Installation & Setup

### 1. Clone the repository

git clone https://github.com/<your-username>/chat-app.git
cd new-chat-app

### 2. Install dependencies

npm install

### 3. Start Expo

npx expo start

### 4. Run the app

- On Android emulator: press a
- On physical device: scan the QR code in Expo Go

### Design

The layout and color scheme follow the official CareerFoundry Chat App design brief.
Background image and color palette are provided in the project’s assets.

Color options:

Name            HEX
Dark            #090C08
Purple          #474056
Blue Gray       #8A95A5
Green Gray      #B9C6AE


### Learning Objectives

- Understand how to build React Native apps with Expo
- Implement navigation using @react-navigation/native
- Use Flexbox for mobile layout
- Work with ImageBackground and TouchableOpacity
- Pass params between screens (name, color)
- Apply custom styling to UI elements