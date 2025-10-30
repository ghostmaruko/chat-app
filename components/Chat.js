import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

const Chat = ({ route, navigation }) => {
  const { name, bgColor } = route.params;

  // imposta il titolo dinamico
  useEffect(() => {
    navigation.setOptions({ title: name || "Chat" });
  }, [navigation, name]);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.text}>Hello {name || "Guest"}!</Text>
      <Text style={styles.text}>This is your chat room.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 18,
  },
});

export default Chat;
