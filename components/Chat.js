import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
  const { name, bgColor } = route.params;
  const [messages, setMessages] = React.useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: `Welcome to the chat, ${name || "Guest"}!`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chat Bot",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: "This is a system message.",
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  // imposta il titolo dinamico
  useEffect(() => {
    navigation.setOptions({ title: name || "Chat" });
  }, [navigation, name]);

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessages) =>
        setMessages((prev) => GiftedChat.append(prev, newMessages))
      }
      user={{ _id: 1 }}
    />
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
