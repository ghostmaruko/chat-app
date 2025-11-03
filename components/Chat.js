import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  Linking,
} from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import tinycolor from "tinycolor2";
import CustomActions from "./CustomActions";
import { database } from "../firebase/firebaseConfig"; // 🔹 compat

const Chat = ({ route, navigation }) => {
  const { name = "Guest", bgColor = "#FFFFFF" } = route.params || {};
  const [messages, setMessages] = useState([]);

  const isDark = tinycolor(bgColor).isDark();

  const theme = {
    userBubble: isDark ? "#5E60CE" : "#4B7BE5",
    otherBubble: isDark ? "#E0E0E0" : "#F1F1F1",
    userText: "#FFF",
    otherText: isDark ? "#1A1A1A" : "#000",
  };

  useEffect(() => {
    navigation.setOptions({ title: name });

    // Messaggi iniziali
    setMessages([
      {
        _id: 2,
        text: "You have joined the chat.",
        createdAt: new Date(),
        system: true,
      },
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
    ]);

    // 🔹 Sottoscrizione ai messaggi da Firebase
    const messagesRef = database.ref("messages");
    const handleValue = (snapshot) => {
      const data = snapshot.val() || {};
      const messagesArray = Object.keys(data)
        .map((key) => ({
          _id: key,
          text: data[key].text,
          createdAt: new Date(data[key].createdAt),
          user: {
            _id: data[key].userId,
            name: data[key].userId === 1 ? name : "Guest",
          },
        }))
        .sort((a, b) => b.createdAt - a.createdAt);
      setMessages(messagesArray);
    };

    messagesRef.on("value", handleValue);

    // Cleanup
    return () => messagesRef.off("value", handleValue);
  }, []);

  const onSend = (newMessages = []) => {
    setMessages((prev) => GiftedChat.append(prev, newMessages));

    newMessages.forEach((msg) => {
      database.ref("messages").push({
        text: msg.text,
        userId: 1,
        createdAt: msg.createdAt.getTime(),
      });
    });
  };

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

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage?.location && currentMessage?.mapUrl) {
      return (
        <TouchableOpacity
          style={styles.mapLinkContainer}
          onPress={() => Linking.openURL(currentMessage.mapUrl)}
        >
          <Text style={styles.mapLinkText}>
            📍 Apri la mia posizione su Google Maps
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1, name }}
        renderBubble={renderBubble}
        renderActions={(props) => <CustomActions {...props} onSend={onSend} />}
        renderCustomView={renderCustomView}
      />
      {Platform.OS === "ios" && <KeyboardAvoidingView behavior="padding" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapLinkContainer: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#E6E6E6",
  },
  mapLinkText: { color: "#1A1A1A", fontWeight: "500", textAlign: "center" },
});

export default Chat;
