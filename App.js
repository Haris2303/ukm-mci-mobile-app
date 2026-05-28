// App.js — VERSI FINAL dengan Materi
// Materi diakses via Stack screen (bukan tab) sesuai pilihan "Card di Beranda"

import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

const brandImage = require('./assets/brand.png');
import { useFonts, Inter_300Light, Inter_400Regular } from '@expo-google-fonts/inter';
import { FontAwesome5 } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import OfflineBanner from './src/shared/components/OfflineBanner';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './src/core/query/queryClient';
import { useKasTunggakan } from './src/features/kas/hooks/useKasQueries';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import ErrorBoundary from './src/shared/components/ErrorBoundary';
import LoginScreen from './src/screens/login/LoginScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import ScanScreen from './src/screens/presensi/ScanScreen';
import RiwayatScreen from './src/screens/presensi/RiwayatScreen';
import KasScreen from './src/features/kas/screens/KasScreen';
import MateriScreen from './src/screens/materi/MateriScreen';
import IdCardScreen from './src/screens/profile/IdCardScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import EditAvatarScreen from './src/screens/profile/EditAvatarScreen';
import EditPasswordScreen from './src/screens/profile/EditPasswordScreen';
import VotingNavigator from './src/navigation/VotingNavigator';
import ProkerNavigator from './src/navigation/ProkerNavigator';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ── HOC: wrap screen in ErrorBoundary (module-level → stable reference) ──────
function withErrorBoundary(Screen) {
  function BoundedScreen(props) {
    return (
      <ErrorBoundary>
        <Screen {...props} />
      </ErrorBoundary>
    );
  }
  BoundedScreen.displayName = `EB(${Screen.displayName ?? Screen.name ?? ''})`;
  return BoundedScreen;
}

// ── Bounded tab screens ───────────────────────────────────────────────────────
const BoundedHomeScreen = withErrorBoundary(HomeScreen);
const BoundedVotingNavigator = withErrorBoundary(VotingNavigator);
const BoundedScanScreen = withErrorBoundary(ScanScreen);
const BoundedKasScreen = withErrorBoundary(KasScreen);
const BoundedProfileScreen = withErrorBoundary(ProfileScreen);

// ── Bounded stack screens ─────────────────────────────────────────────────────
const BoundedMateriScreen = withErrorBoundary(MateriScreen);
const BoundedProkerNavigator = withErrorBoundary(ProkerNavigator);
const BoundedRiwayatScreen = withErrorBoundary(RiwayatScreen);
const BoundedIdCardScreen = withErrorBoundary(IdCardScreen);
const BoundedEditAvatarScreen = withErrorBoundary(EditAvatarScreen);
const BoundedEditPasswordScreen = withErrorBoundary(EditPasswordScreen);

function TabIcon({ name, color, focused }) {
  return <FontAwesome5 name={name} size={focused ? 22 : 19} color={color} solid />;
}

function ProfileTabIcon({ focused, color }) {
  return <TabIcon name="user" focused={focused} color={color} />;
}

function KasTabIcon({ focused, color }) {
  const { data } = useKasTunggakan();
  const tunggakanCount = data?.jumlah_tunggakan ?? 0;
  return (
    <View style={{ position: 'relative' }}>
      <FontAwesome5 name="coins" size={focused ? 22 : 19} color={color} solid />
      {tunggakanCount > 0 && (
        <View
          style={{
            position: 'absolute',
            top: -4,
            right: -10,
            backgroundColor: '#ef4444',
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            paddingHorizontal: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: '#fff',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 9, fontWeight: '900' }}>
            {tunggakanCount > 9 ? '9+' : tunggakanCount}
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
        tabBarActiveTintColor: '#1a4ff5',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e2e8f0',
          paddingBottom: Math.max(insets.bottom, 6),
          paddingTop: 6,
          height: 64 + Math.max(insets.bottom - 6, 0),
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Beranda"
        component={BoundedHomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="home" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="E-Voting"
        component={BoundedVotingNavigator}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="vote-yea" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Scan QR"
        component={BoundedScanScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="camera" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="E-Kas"
        component={BoundedKasScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <KasTabIcon focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={BoundedProfileScreen}
        options={{
          headerShown: true,
          title: 'Profil Saya',
          headerStyle: { backgroundColor: '#1a56db' },
          headerShadowVisible: false,
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          tabBarLabel: 'Profil',
          tabBarIcon: ({ focused, color }) => <ProfileTabIcon focused={focused} color={color} />,
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
        headerStyle: { backgroundColor: '#1a56db' },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        headerBackTitle: '',
        headerBackTitleVisible: false,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="Materi"
        component={BoundedMateriScreen}
        options={{ title: 'Materi Pembelajaran' }}
      />
      <Stack.Screen
        name="Proker"
        component={BoundedProkerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Riwayat"
        component={BoundedRiwayatScreen}
        options={{ title: 'Riwayat Presensi' }}
      />
      <Stack.Screen
        name="IdCard"
        component={BoundedIdCardScreen}
        options={{ title: 'ID Card Saya' }}
      />
      <Stack.Screen
        name="EditAvatar"
        component={BoundedEditAvatarScreen}
        options={{ title: 'Edit Foto Profil' }}
      />
      <Stack.Screen
        name="EditPassword"
        component={BoundedEditPasswordScreen}
        options={{ title: 'Ubah Password' }}
      />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) {
    return <SplashView />;
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

function SplashView() {
  return (
    <View style={splashStyles.container}>
      <Image source={brandImage} style={splashStyles.logo} resizeMode="contain" />
      <ActivityIndicator size="small" color="#1a4ff5" style={{ marginTop: 32 }} />
    </View>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
  },
  logo: {
    width: 200,
    height: 100,
  },
});

export default function App() {
  const [fontsLoaded] = useFonts({ Inter_300Light, Inter_400Regular });

  if (!fontsLoaded) {
    return <SplashView />;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
        <OfflineBanner />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
