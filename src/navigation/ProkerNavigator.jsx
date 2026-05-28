// src/navigation/ProkerNavigator.js
// Stack navigator untuk fitur Program Kerja

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import ProkerDetailScreen from '../screens/proker/ProkerDetailScreen';
import ProkerListScreen from '../screens/proker/ProkerListScreen';

const Stack = createNativeStackNavigator();

export default function ProkerNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#7c3aed' },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        headerBackTitle: '',
        headerBackTitleVisible: false,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen
        name="ProkerList"
        component={ProkerListScreen}
        options={{ title: 'Program Kerja' }}
      />
      <Stack.Screen
        name="ProkerDetail"
        component={ProkerDetailScreen}
        options={{ title: 'Detail Program Kerja' }}
      />
    </Stack.Navigator>
  );
}
