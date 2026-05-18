// App.js — VERSI FINAL dengan Materi
// Materi diakses via Stack screen (bukan tab) sesuai pilihan "Card di Beranda"

import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useFonts, Inter_300Light, Inter_400Regular } from "@expo-google-fonts/inter";
import { FontAwesome5 } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { KasProvider, useKas } from "./src/context/KasContext";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ScanScreen from "./src/screens/ScanScreen";
import RiwayatScreen from "./src/screens/RiwayatScreen";
import KasScreen from "./src/screens/KasScreen";
import MateriScreen from "./src/screens/MateriScreen";
import IdCardScreen from "./src/screens/IdCardScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import VotingNavigator from "./src/navigation/VotingNavigator";
import ProkerNavigator from "./src/navigation/ProkerNavigator";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ name, color, focused }) {
  return <FontAwesome5 name={name} size={focused ? 22 : 19} color={color} solid />;
}

function KasTabIcon({ focused, color }) {
  const { tunggakanCount } = useKas();
  return (
    <View style={{ position: "relative" }}>
      <FontAwesome5 name="coins" size={focused ? 22 : 19} color={color} solid />
      {tunggakanCount > 0 && (
        <View
          style={{
            position: "absolute",
            top: -4,
            right: -10,
            backgroundColor: "#ef4444",
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            paddingHorizontal: 4,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1.5,
            borderColor: "#fff",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 9, fontWeight: "900" }}>
            {tunggakanCount > 9 ? "9+" : tunggakanCount}
          </Text>
        </View>
      )}
    </View>
  );
}

// ── Bottom Tabs (5 tab utama) ─────────────────────────────────
function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1a4ff5",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#e2e8f0",
          paddingBottom: Math.max(insets.bottom, 6),
          paddingTop: 6,
          height: 64 + Math.max(insets.bottom - 6, 0),
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <Tab.Screen
        name="Beranda"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon name="home" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Scan QR"
        component={ScanScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon name="camera" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="E-Voting"
        component={VotingNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon name="vote-yea" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="E-Kas"
        component={KasScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <KasTabIcon focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Riwayat"
        component={RiwayatScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon name="clipboard-list" focused={focused} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// ── Stack utama ──────────────────────────────────────────────
// Materi & Rekrutmen di-register sebagai Stack screen, bukan tab.
// Cara pakai: navigation.navigate('Materi') dari mana pun.
function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1a4ff5" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700" },
        headerBackTitle: "",
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Materi"
        component={MateriScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Proker"
        component={ProkerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IdCard"
        component={IdCardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f4ff",
        }}
      >
        <ActivityIndicator size="large" color="#1a4ff5" />
      </View>
    );
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="App" component={AppStack} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ Inter_300Light, Inter_400Regular });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8faff" }}>
        <ActivityIndicator size="large" color="#1a4ff5" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <KasProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <RootNavigator />
        </NavigationContainer>
      </KasProvider>
    </AuthProvider>
  );
}
