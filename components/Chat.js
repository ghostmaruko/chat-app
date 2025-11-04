import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  Linking,
  Alert,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import tinycolor from "tinycolor2";
import CustomActions from "./CustomActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { database } from "../firebase/firebaseConfig"; // Realtime DB import

// ---------- Componente Chat ----------
const Chat = ({ route, navigation, isConnected }) => {
  const { name = "Guest", bgColor = "#FFFFFF" } = route.params || {};
  const [messages, setMessages] = useState([]);

  // Per calcolare il tema (chiaro/scuro) in base al colore background scelto
  const isDark = tinycolor(bgColor).isDark();

  // Definizione tema bolle
  const theme = {
    userBubble: isDark ? "#5E60CE" : "#4B7BE5",
    otherBubble: isDark ? "#E0E0E0" : "#F1F1F1",
    userText: "#FFF",
    otherText: isDark ? "#1A1A1A" : "#000",
  };

  // ---------- Chiave AsyncStorage ----------
  const STORAGE_KEY = "chat_messages";

  // ---------- Funzioni AsyncStorage ----------
  const saveMessages = async (messagesToSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToSave));
    } catch (error) {
      console.log("Error saving messages:", error);
    }
  };

  // Carica messaggi dalla cache
  const loadCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem(STORAGE_KEY);
      if (cachedMessages) {
        setMessages(JSON.parse(cachedMessages));
        console.log("💾 Loaded cached messages");
      }
    } catch (error) {
      console.log("Error loading cached messages:", error);
    }
  };

  // ---------- useEffect principale ----------
  useEffect(() => {
    navigation.setOptions({ title: name });

    // Riferimento ai messaggi nel Realtime Database
    const messagesRef = database.ref("messages");

    // Funzione per gestire l'aggiornamento dei messaggi
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

      setMessages(messagesArray); // Aggiorna stato messaggi
      saveMessages(messagesArray); // Cache aggiornata ogni volta
    };

    // Ascolta i cambiamenti solo se connessi
    if (isConnected) {
      messagesRef.on("value", handleValue);
    } else {
      loadCachedMessages(); // Carica messaggi locali se offline
      Alert.alert("You're offline. Messages are loaded from cache.");
    }

    // cleanup
    return () => messagesRef.off("value", handleValue);
  }, [isConnected]);

  // ---------- Inviare messaggi ----------
  const onSend = (newMessages = []) => {
    if (isConnected === false) {
      Alert.alert("You're offline — messages cannot be sent");
      return;
    }

    setMessages((prev) => GiftedChat.append(prev, newMessages));

    newMessages.forEach((msg) => {
      database.ref("messages").push({
        text: msg.text,
        userId: 1,
        createdAt: msg.createdAt.getTime(),
      });
    });
  };

  // ---------- Personalizzazione bubble ----------
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

  // ---------- Nascondere InputToolbar se offline ----------
  const renderInputToolbar = (props) => {
    if (isConnected === false) return null;
    return <InputToolbar {...props} />;
  };

  // ---------- Link a Google Maps ----------
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
        renderInputToolbar={renderInputToolbar}
      />
      {Platform.OS === "ios" && <KeyboardAvoidingView behavior="padding" />}
    </View>
  );
};

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: { flex: 1 },
  mapLinkContainer: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#E6E6E6",
  },
  mapLinkText: {
    color: "#1A1A1A",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default Chat;
