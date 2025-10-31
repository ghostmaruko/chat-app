import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

const CustomActions = ({ onSend }) => {
  const buildImageMessage = (uri) => ({
    _id: Date.now(),
    createdAt: new Date(),
    user: { _id: 1 },
    image: uri,
  });

  const buildLocationMessage = (latitude, longitude) => ({
    _id: Date.now(),
    createdAt: new Date(),
    user: { _id: 1 },
    text: "📍 La mia posizione",
    location: { latitude, longitude },
    mapUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
  });

  // 📸 Seleziona un'immagine dalla galleria
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permesso negato", "Non posso accedere alla galleria 😞");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        onSend([buildImageMessage(uri)]);
      }
    } catch (error) {
      console.error("Errore nel pickImage:", error);
    }
  };

  // 📷 Scatta una foto
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permesso negato", "Non posso accedere alla fotocamera 😞");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        onSend([buildImageMessage(uri)]);
      }
    } catch (e) {
      console.log("takePhoto error", e);
    }
  };

  // 📍 Condividi la posizione
  const shareLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permesso negato", "Non posso accedere alla posizione 😞");
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      onSend([buildLocationMessage(latitude, longitude)]);
    } catch (error) {
      console.error("Errore shareLocation:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Ionicons name="image" size={24} color="#5E60CE" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Ionicons name="camera" size={24} color="#5E60CE" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={shareLocation}>
        <Ionicons name="location" size={24} color="#5E60CE" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center" },
  button: {
    marginHorizontal: 6,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
});

export default CustomActions;
