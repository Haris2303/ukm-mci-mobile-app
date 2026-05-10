import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ElectionListScreen from "../screens/voting/ElectionListScreen";
import ElectionDetailScreen from "../screens/voting/ElectionDetailScreen";
import HasilVotingScreen from "../screens/voting/HasilVotingScreen";

const Stack = createNativeStackNavigator();

export default function VotingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#1a56db",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "700", fontSize: 17 },
        headerBackTitle: "",
      }}
    >
      <Stack.Screen
        name="ElectionList"
        component={ElectionListScreen}
        options={{ headerShown: false }} // header sudah ada di dalam screen
      />
      <Stack.Screen
        name="ElectionDetail"
        component={ElectionDetailScreen}
        options={({ route }) => ({
          title: route.params?.judul ?? "Detail Pemilihan",
          headerShown: true,
        })}
      />
      <Stack.Screen
        name="HasilVoting"
        component={HasilVotingScreen}
        options={{ title: "Hasil Pemilihan" }}
      />
    </Stack.Navigator>
  );
}
