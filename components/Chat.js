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
import MapView, { Marker } from "react-native-maps";

const Chat = ({ route, navigation, isConnected, storage }) => {
  const { name = "Guest", bgColor = "#FFFFFF" } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const isDark = tinycolor(bgColor).isDark();

  const theme = {
    userBubble: isDark ? "#5E60CE" : "#4B7BE5",
    otherBubble: isDark ? "#E0E0E0" : "#F1F1F1",
    userText: "#FFF",
    otherText: isDark ? "#1A1A1A" : "#000",
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
          createdAt: new Date(data[key].createdAt),
          user: {
            _id: data[key].userId,
            name: data[key].userId === 1 ? name : "Guest",
          },
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      setMessages(messagesArray);
      saveMessages(messagesArray);
    };

    if (isConnected) {
      messagesRef.on("value", handleValue);
    } else {
      loadCachedMessages();
      Alert.alert("You're offline. Messages are loaded from cache.");
    }

    return () => messagesRef.off("value", handleValue);
  }, [isConnected]);

  const onSend = (newMessages = []) => {
    if (!isConnected) {
      Alert.alert("You're offline — messages cannot be sent");
      return;
    }

    setMessages((prev) => GiftedChat.append(prev, newMessages));

    newMessages.forEach((msg) => {
      const messageData = {
        userId: 1,
        createdAt: msg.createdAt.getTime(),
      };

      if (msg.text && msg.text.trim() !== "") messageData.text = msg.text;
      if (msg.image) messageData.image = msg.image;
      if (msg.location) {
        messageData.location = {
          latitude: msg.location.latitude,
          longitude: msg.location.longitude,
        };
      }

      database.ref("messages").push(messageData);
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

  const renderInputToolbar = (props) => {
    if (!isConnected) return null;
    return <InputToolbar {...props} />;
  };

  const openMap = (latitude, longitude) => {
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${latitude},${longitude}`,
      android: `https://www.google.com/maps?q=${latitude},${longitude}`,
    });
    Linking.openURL(url).catch((err) => {
      console.error("Errore aprendo Maps:", err);
      Alert.alert("Errore", "Impossibile aprire la mappa");
    });
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;

    if (
      currentMessage?.location?.latitude != null &&
      currentMessage?.location?.longitude != null
    ) {
      const { latitude, longitude } = currentMessage.location;
      return (
        <TouchableOpacity
          onPress={() => openMap(latitude, longitude)}
          style={styles.mapBubble}
        >
          <MapView
            style={styles.map}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <Marker coordinate={{ latitude, longitude }} />
          </MapView>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderMessageImage = (props) => {
    const { currentMessage } = props;
    if (currentMessage?.image) {
      return (
        <View style={{ padding: 4 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedImage(currentMessage.image)}
          >
            <Image
              source={{ uri: currentMessage.image }}
              style={{
                width: 250,
                height: 200,
                borderRadius: 10,
                alignSelf: "center",
                backgroundColor: "#000",
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <>
      <Modal
        visible={!!selectedImage}
        transparent={true}
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
  mapBubble: {
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 5,
    alignSelf: "flex-start", // o flex-end a seconda del lato
  },
  map: {
    width: 250,
    height: 150,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Chat;
