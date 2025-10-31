import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import tinycolor from "tinycolor2";

const Chat = ({ route, navigation }) => {
  // ricevi parametri dalla Start screen
  const { name = "Guest", bgColor = "#FFFFFF" } = route.params || {};

  const [messages, setMessages] = useState([]);

  // calcola se il background è scuro o chiaro
  const isDark = tinycolor(bgColor).isDark();

  // scegli colori coerenti con lo sfondo
  const theme = {
    userBubble: isDark ? "#5E60CE" : "#4B7BE5", // colore messaggi utente
    otherBubble: isDark ? "#E0E0E0" : "#F1F1F1", // colore messaggi ricevuti
    userText: isDark ? "#FFF" : "#FFF",
    otherText: isDark ? "#1A1A1A" : "#000",
  };

  // inizializza messaggi + titolo
  useEffect(() => {
    navigation.setOptions({ title: name });

    setMessages([
      {
        _id: 1,
        text: `Welcome to the chat, ${name}!`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chat Bot",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: "You have joined the chat.",
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  // gestisce l'invio messaggi
  const onSend = (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
  };

  // personalizza le bolle della chat
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: theme.userBubble,
          borderRadius: 12,
          padding: 3,
          marginRight: 5,
        },
        left: {
          backgroundColor: theme.otherBubble,
          borderRadius: 12,
          padding: 3,
          marginLeft: 5,
        },
      }}
      textStyle={{
        right: { color: theme.userText },
        left: { color: theme.otherText },
      }}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1, name }}
        renderBubble={renderBubble}
        /* bottomOffset={Platform.OS === "android" ? 10 : 20} */
      />

      {/* Evita che la tastiera copra l’input */}
      {/*    {Platform.OS === "android" ? (
        <KeyboardAvoidingView behavior="height" />
      ) : (
        <KeyboardAvoidingView behavior="padding" />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
