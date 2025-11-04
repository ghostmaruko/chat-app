// App.js
import React, { useEffect } from "react";
import { Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNetInfo } from "@react-native-community/netinfo";
import { getDatabase, goOffline, goOnline } from "firebase/database";

// import screens
import Start from "./components/Start";
import Chat from "./components/Chat";
import { app } from "./firebase/firebaseConfig"; 

const Stack = createNativeStackNavigator();

const App = () => {
  // Hook per connessione
  const connectionStatus = useNetInfo();
  const db = getDatabase(app);

  // Effetto per gestire lo stato di rete
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("You are offline. Chat functionality is limited.");
      goOffline(db);
    } else if (connectionStatus.isConnected === true) {
      goOnline(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              {...props}
              isConnected={connectionStatus.isConnected}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
