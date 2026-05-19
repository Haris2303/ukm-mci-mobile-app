// src/navigation/ProkerNavigator.js
// Stack navigator untuk fitur Program Kerja

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProkerListScreen from "../screens/ProkerListScreen";
import ProkerDetailScreen from "../screens/ProkerDetailScreen";

const Stack = createNativeStackNavigator();

export default function ProkerNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#7c3aed" },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700", fontSize: 17 },
        headerBackTitle: "",
      }}
    >
      <Stack.Screen
        name="ProkerList"
        component={ProkerListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProkerDetail"
        component={ProkerDetailScreen}
        options={{ title: "Detail Program Kerja" }}
      />
    </Stack.Navigator>
  );
}
