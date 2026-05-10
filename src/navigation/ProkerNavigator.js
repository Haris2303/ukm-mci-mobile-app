// src/navigation/ProkerNavigator.js
// Stack navigator untuk fitur Program Kerja

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProkerListScreen from "../screens/ProkerListScreen";
import ProkerDetailScreen from "../screens/ProkerDetailScreen";

const Stack = createNativeStackNavigator();

export default function ProkerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProkerList" component={ProkerListScreen} />
      <Stack.Screen name="ProkerDetail" component={ProkerDetailScreen} />
    </Stack.Navigator>
  );
}
