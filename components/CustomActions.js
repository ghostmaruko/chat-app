import React from "react";
import { StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

const CustomActions = ({ onSend, storage }) => {
  const buildImageMessage = (uri) => ({
    _id: Date.now(),
    createdAt: new Date(),
    user: { _id: 1 },
    image: uri,
  });

  /* // 🔼 Upload immagine su Firebase Storage
  const uploadImage = async (uri) => {
    try {
      console.log("Inizio uploadImage:", uri);
      // 1️⃣ Convertire in blob
      Alert.alert("Step", "Inizio uploadImage");
      const response = await fetch(uri);
      Alert.alert("Step", "Dopo fetch()");
      const blob = await response.blob();
      Alert.alert("Step", "Dopo blob()");

      // 2️⃣ Generare nome file univoco
      const filename = `chatImages/${Date.now()}.jpg`;

      // 3️⃣ Caricare su Firebase
      const ref = storage.ref().child(filename);
      const snapshot = await ref.put(blob);
      await ref.put(blob);

      Alert.alert("✅ Upload", "Immagine caricata su Firebase Storage!");
      console.log("✅ Upload completato:", snapshot.metadata.fullPath);
      // (Prossimo step: getDownloadURL)

      const downloadURL = await ref.getDownloadURL();
      console.log("Download URL:", downloadURL);
      return downloadURL; // lo restituiamo per usarlo nel messaggio
      return null;
    } catch (error) {
      console.error("Errore uploadImage:", error.code, error.message);
      Alert.alert("❌ Errore", error.message || "Upload immagine fallito.");
      return null;
    }
  }; */

  /* const uploadImage = async (uri) => {
    try {
      console.log("⚙️ Mock upload attivo — uso URI locale:", uri);
      // Simula un breve ritardo per test realistico
      await new Promise((resolve) => setTimeout(resolve, 800));
      return uri; // restituisce direttamente l'URI locale
    } catch (error) {
      console.error("Errore mock upload:", error);
      return null;
    }
  }; */

  const uploadImage = async (uri) => {
    try {
      console.log("⚙️ Mock upload base64 attivo — uso immagine locale:", uri);
      const response = await fetch(uri);
      const blob = await response.blob();

      // Convertiamo il blob in Base64 per farlo visualizzare
      const reader = new FileReader();
      return await new Promise((resolve) => {
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data); // restituisce stringa base64
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Errore mock upload base64:", error);
      return null;
    }
  };

  const buildLocationMessage = (latitude, longitude) => ({
    _id: Date.now(),
    createdAt: new Date(),
    user: { _id: 1 },
    text: "📍 La mia posizione",
    location: { latitude, longitude },
    mapUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
  });

  // 📸 Seleziona immagine dalla galleria
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permesso negato", "Non posso accedere alla galleria 😞");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const remoteURL = await uploadImage(uri);
        if (remoteURL) {
          onSend([buildImageMessage(remoteURL)]);
        } else {
          Alert.alert("Errore", "Upload fallito 😞");
        }
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
        const remoteURL = await uploadImage(uri);
        if (remoteURL) {
          onSend([buildImageMessage(remoteURL)]);
        } else {
          Alert.alert("Errore", "Upload fallito 😞");
        }
      }
    } catch (error) {
      console.log("takePhoto error", error);
    }
  };

  // 📍 Condividi posizione
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
