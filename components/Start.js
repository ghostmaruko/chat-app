import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";

const backgroundImage = require("../assets/Background Image.png");

const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const [bgColor, setBgColor] = useState(colors[0]);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      {/* Title */}
      <Text style={styles.title}>Chat App</Text>

      {/* Box */}
      <View style={styles.box}>
        {/* Name input */}
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your Name"
          placeholderTextColor="#757083"
        />

        {/* Choose color */}
        <Text style={styles.chooseColor}>Choose Background Color:</Text>
        <View style={styles.colorWrapper}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                bgColor === color && styles.selected,
              ]}
              onPress={() => setBgColor(color)}
            />
          ))}
        </View>

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Chat", { name, bgColor })}
        >
          <Text style={styles.buttonText}>Start Chatting</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// === STYLES ===
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 40,
  },
  box: {
    backgroundColor: "white",
    width: "88%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderColor: "#757083",
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    fontSize: 16,
    color: "#757083",
  },
  chooseColor: {
    alignSelf: "flex-start",
    marginTop: 20,
    color: "#757083",
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
  },
  selected: {
    borderWidth: 2,
    borderColor: "#000",
  },
  button: {
    backgroundColor: "#757083",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Start;
