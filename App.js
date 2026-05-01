import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";

// Context
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { KasProvider, useKas } from "./src/context/KasContext";

// Screens
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ScanScreen from "./src/screens/ScanScreen";
import RiwayatScreen from "./src/screens/RiwayatScreen";
import KasScreen from "./src/screens/KasScreen";
import VotingNavigator from "./src/navigation/VotingNavigator";

// const RootStack = createStack2();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ icon, focused }) {
  return <Text style={{ fontSize: focused ? 24 : 20 }}>{icon}</Text>;
}

// ── Tab khusus E-Kas dengan badge tunggakan ───────────────────
function KasTabIcon({ focused }) {
  const { tunggakanCount } = useKas();
  return (
    <View style={{ position: "relative" }}>
      <Text style={{ fontSize: focused ? 24 : 20 }}>💰</Text>
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

// ── Tab utama setelah login ────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1a56db",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#e2e8f0",
          paddingBottom: 6,
          paddingTop: 6,
          height: 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tab.Screen
        name="Beranda"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Scan QR"
        component={ScanScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="📷" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="E-Voting"
        component={VotingNavigator} // ← Stack navigator voting
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🗳️" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="E-Kas"
        component={KasScreen}
        options={{
          tabBarIcon: ({ focused }) => <KasTabIcon focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Riwayat"
        component={RiwayatScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="📋" focused={focused} />,
        }}
      />
    </Tab.Navigator>
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
        <ActivityIndicator size="large" color="#1a56db" />
      </View>
    );
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
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
