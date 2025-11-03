import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import tinycolor from "tinycolor2"; // npm install tinycolor2

const backgroundImage = require("../assets/Background Image.png");

const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const [bgColor, setBgColor] = useState(colors[0]);

  // calcola se lo sfondo è scuro o chiaro
  const isDark = tinycolor(bgColor).isDark();

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      accessible={true}
      accessibilityLabel="Background image showing abstract design for the start screen"
    >
      {/* Title - leggibile da TalkBack */}
      <Text
        style={styles.title}
        accessible={true}
        accessibilityLabel="Chat App title"
        accessibilityRole="header"
      >
        Chat App
      </Text>

      {/* Main Box */}
      <View
        style={[styles.box, { backgroundColor: "rgba(255,255,255,0.9)" }]}
        accessible={true}
        accessibilityLabel="Main box containing name input, color options, and start button"
      >
        {/* Name input */}
        <TextInput
          style={[styles.input, { color: "#000" }]} // sempre testo nero
          value={name}
          onChangeText={setName}
          placeholder="Your Name"
          placeholderTextColor="#757083"
          accessible={true}
          accessibilityLabel="Enter your name"
          accessibilityHint="Type your name to identify yourself in the chat"
        />

        {/* Choose color */}
        <Text
          style={styles.chooseColor}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel="Choose Background Color"
        >
          Choose Background Color:
        </Text>

        <View
          style={styles.colorWrapper}
          accessible={true}
          accessibilityLabel="Color selection options"
        >
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                bgColor === color && styles.selected,
              ]}
              onPress={() => setBgColor(color)}
              activeOpacity={0.8}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Select background color ${color}`}
              accessibilityState={{ selected: bgColor === color }}
              accessibilityHint="Double tap to choose this color for the chat background"
            />
          ))}
        </View>

        {/* Button */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isDark ? "#5E60CE" : "#333",
            },
          ]}
          onPress={() => navigation.navigate("Chat", { name, bgColor })}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Start Chatting button"
          accessibilityHint="Double tap to enter the chat screen"
        >
          <Text style={[styles.buttonText, { color: "#FFF" }]}>
            Start Chatting
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 45,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 40,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  box: {
    width: "88%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  input: {
    width: "100%",
    borderColor: "#757083",
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    fontSize: 16,
  },
  chooseColor: {
    alignSelf: "flex-start",
    marginTop: 20,
    color: "#757083",
    fontSize: 14,
  },
  colorWrapper: {
    flexDirection: "row",
    marginVertical: 15,
    justifyContent: "space-between",
    width: "60%",
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selected: {
    borderWidth: 3,
    borderColor: "#5E60CE",
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Start;
