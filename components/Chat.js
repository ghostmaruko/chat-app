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
  Modal,
  Image,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import tinycolor from "tinycolor2";
import CustomActions from "./CustomActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { database } from "../firebase/firebaseConfig";

const Chat = ({ route, navigation, isConnected, storage }) => {
  const { name = "Guest", bgColor = "#FFFFFF" } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const BOT_ID = 2;
  const BOT_NAME = "Jacob";
  const [botStepIndex, setBotStepIndex] = useState(0);
  const [awaitingUserResponse, setAwaitingUserResponse] = useState(false);
  const DEMO_MODE = true;

  const isDark = tinycolor(bgColor).isDark();
  const theme = {
    userBubble: isDark ? "#5E60CE" : "#4B7BE5",
    botBubble: isDark ? "#FFD700" : "#FFEB3B",
    userText: "#FFF",
    botText: "#000",
  };

  const STORAGE_KEY = "chat_messages";

  const saveMessages = async (messagesToSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToSave));
    } catch (error) {
      console.log("Error saving messages:", error);
    }
  };

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

  const BOT_MESSAGES = [
    {
      id: 0,
      text: `Ciao ${name}! 👋 Benvenuto nella chat demo. Io sono ${BOT_NAME}.`,
      awaitResponse: true,
      expectedInput: "text",
      expectedSource: null,
    },
    {
      id: 1,
      text: `Piacere di conoscerti, ${name}! Vuoi provare la simulazione dell'app?`,
      awaitResponse: true,
      expectedInput: "text",
      expectedSource: null,
    },
    {
      id: 2,
      text: "Fantastico! Iniziamo la simulazione demo.",
      awaitResponse: true,
      expectedInput: "text",
      expectedSource: null,
    },
    {
      id: 3,
      text: "Primo test: Invia un'immagine dalla galleria.",
      awaitResponse: true,
      expectedInput: "image",
      expectedSource: "gallery",
    },
    {
      id: 4,
      text: "Perfetto! Ora prova a scattare una foto con la fotocamera.",
      awaitResponse: true,
      expectedInput: "image",
      expectedSource: "camera",
    },
    {
      id: 5,
      text: "Infine, condividi la tua posizione.",
      awaitResponse: true,
      expectedInput: "location",
      expectedSource: null,
    },
    {
      id: 6,
      text: "Ottimo! Questo conclude la simulazione demo.",
      awaitResponse: false,
      expectedInput: null,
      expectedSource: null,
    },
    {
      id: 7,
      text: "Ok, fai come vuoi allora. 😉",
      awaitResponse: false,
      expectedInput: null,
      expectedSource: null,
    },
  ];

  const sendBotMessage = (index) => {
    if (index >= BOT_MESSAGES.length) return;

    const botMsg = {
      _id: `bot-${index}-${Date.now()}`,
      text: BOT_MESSAGES[index].text,
      createdAt: new Date(),
      user: { _id: BOT_ID, name: BOT_NAME },
    };

    setTimeout(() => {
      setMessages((prev) => GiftedChat.append(prev, [botMsg]));
      if (BOT_MESSAGES[index].awaitResponse) setAwaitingUserResponse(true);
      else setBotStepIndex(index + 1);
    }, 1000);
  };

  const proceedBotStep = () => {
    setAwaitingUserResponse(false);
    const nextIndex = botStepIndex + 1;
    setBotStepIndex(nextIndex);
    sendBotMessage(nextIndex);
  };

  const handleUserResponse = (text) => {
    const answer = text?.toLowerCase().trim();
    if (botStepIndex === 0) {
      setBotStepIndex(1);
      sendBotMessage(1);
    } else if (botStepIndex === 1) {
      const positiveAnswers = [
        "sì",
        "si",
        "yes",
        "certo",
        "ok",
        "va bene",
        "sure",
        "of course",
        "yep",
        "affirmative",
        "absolutely",
        "eja",
        "claro",
        "chiaro",
        "d'accordo",
        "ja",
        "oui",
        "da",
        "hai",
        "si certo",
        "si va bene",
        "si ok",
        "si chiaro",
        "si d'accordo",
        "ovviamente",
      ];
      if (positiveAnswers.includes(answer)) proceedBotStep();
      else sendBotMessage(7);
    } else {
      proceedBotStep();
    }
  };

  const runBotDemo = () => {
    setMessages([]);
    setBotStepIndex(0);
    sendBotMessage(0);
  };

  useEffect(() => {
    navigation.setOptions({ title: name });
    const messagesRef = database.ref("messages");

    const handleValue = (snapshot) => {
      const data = snapshot.val() || {};
      const messagesArray = Object.keys(data)
        .map((key) => ({
          _id: key,
          text: data[key].text || "",
          image: data[key].image || null,
          location: data[key].location || null,
          mapUrl: data[key].mapUrl || null,
          createdAt: new Date(data[key].createdAt),
          user: {
            _id: data[key].userId,
            name: data[key].userId === 1 ? name : "Guest",
          },
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      if (DEMO_MODE) {
        if (messages.length === 0) runBotDemo();
      } else {
        setMessages(messagesArray);
        saveMessages(messagesArray);
      }
    };

    if (isConnected) messagesRef.on("value", handleValue);
    else {
      loadCachedMessages();
      Alert.alert("You're offline. Messages are loaded from cache.");
    }

    return () => messagesRef.off("value", handleValue);
  }, [isConnected]);

  const onSend = (newMessages = []) => {
    console.log("onSend triggered");
    console.log("New Messages:", JSON.stringify(newMessages, null, 2));

    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));

    if (!DEMO_MODE && isConnected) {
      newMessages.forEach((msg) => {
        const messageData = { userId: 1, createdAt: msg.createdAt.getTime() };
        if (msg.text?.trim() !== "") messageData.text = msg.text;
        if (msg.image) messageData.image = msg.image;
        if (msg.location) messageData.location = msg.location;
        if (msg.mapUrl) messageData.mapUrl = msg.mapUrl;
        database.ref("messages").push(messageData);
      });
    }

    if (DEMO_MODE && awaitingUserResponse) {
      const userMsg = newMessages[0];
      const currentStep = BOT_MESSAGES[botStepIndex];
      console.log("🤖 Current bot step:", botStepIndex, currentStep.text);
      console.log("🧩 Expected input:", currentStep.expectedInput);
      console.log("🧩 Expected source:", currentStep.expectedSource);

      let userInputType = null;
      let userSource = null;

      if (userMsg.text && userMsg.text.trim() !== "") userInputType = "text";
      else if (userMsg.image) {
        userInputType = "image";
        userSource = userMsg.source || null;
      } else if (userMsg.location) userInputType = "location";
      else userInputType = "invalid";
      console.log("📨 User input type:", userInputType);
      console.log("📨 User source:", userSource);

      const expectedInput = currentStep.expectedInput;
      const expectedSource = currentStep.expectedSource;

      if (expectedInput && userInputType !== expectedInput) {
        Alert.alert(
          "Input non valido",
          `Attenzione! Questo step richiede un tipo di messaggio: ${expectedInput}. Ritenta con il tipo corretto.`
        );
        return;
      }

      if (expectedSource && userSource !== expectedSource) {
        Alert.alert(
          "Input non valido",
          `Attenzione! Questo step richiede un messaggio da: ${expectedSource}. Ritenta con il tipo corretto.`
        );
        return;
      }
      console.log("✅ User input is valid for this step.");

      setAwaitingUserResponse(false);

      setTimeout(() => {
        if (userInputType === "text") handleUserResponse(userMsg.text);
        else proceedBotStep();
      }, 800);
    }
  };

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: theme.userBubble,
          borderRadius: 12,
          padding: 8,
          marginRight: 5,
          maxWidth: "80%",
        },
        left: {
          backgroundColor:
            props.currentMessage.user._id === BOT_ID
              ? theme.botBubble
              : "#F1F1F1",
          borderRadius: 12,
          padding: 8,
          marginLeft: 5,
          maxWidth: "80%",
        },
      }}
      textStyle={{
        right: { color: theme.userText },
        left: {
          color:
            props.currentMessage.user._id === BOT_ID ? theme.botText : "#000",
        },
      }}
    />
  );

  const renderInputToolbar = (props) =>
    !isConnected ? null : <InputToolbar {...props} />;

  const renderCustomView = ({ currentMessage }) => {
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

  const renderMessageImage = ({ currentMessage }) => {
    if (!currentMessage?.image) return null;
    return (
      <View style={{ padding: 4 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSelectedImage(currentMessage.image)}
        >
          <Image
            source={{ uri: currentMessage.image }}
            style={styles.chatImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPressOut={() => setSelectedImage(null)}
          >
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: 1, name }}
          renderBubble={renderBubble}
          renderActions={(props) => (
            <CustomActions {...props} onSend={onSend} storage={storage} />
          )}
          renderCustomView={renderCustomView}
          renderInputToolbar={renderInputToolbar}
          renderMessageImage={renderMessageImage}
        />
        {Platform.OS === "ios" && <KeyboardAvoidingView behavior="padding" />}
      </View>
    </>
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
  chatImage: { width: 250, height: 200, borderRadius: 10, alignSelf: "center" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalBackground: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  fullImage: { width: "100%", height: "100%", resizeMode: "contain" },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  closeButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

export default Chat;
