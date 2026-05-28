// src/screens/login/LoginScreen.jsx
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

import { colors } from '@theme/colors';

import { FLASH_CONFIG, styles, TITLE_GRADIENT } from './LoginScreen.styles';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/api';

const logoImage = require('../../../assets/logo.png');

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // ── Flash banner state ────────────────────────────────────────────────────
  const [flash, setFlash] = useState(null); // { type: 'error'|'warning', message: string }
  const [flashOpacity] = useState(() => new Animated.Value(0));
  const [flashTranslate] = useState(() => new Animated.Value(-10));
  const dismissTimer = useRef(null);

  const hideFlash = useCallback(() => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    Animated.parallel([
      Animated.timing(flashOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(flashTranslate, { toValue: -10, duration: 200, useNativeDriver: true }),
    ]).start(() => setFlash(null));
  }, [flashOpacity, flashTranslate]);

  const showFlash = useCallback(
    (type, message) => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
      setFlash({ type, message });
      flashOpacity.setValue(0);
      flashTranslate.setValue(-10);
      Animated.parallel([
        Animated.timing(flashOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(flashTranslate, {
          toValue: 0,
          tension: 120,
          friction: 9,
          useNativeDriver: true,
        }),
      ]).start();
      dismissTimer.current = setTimeout(hideFlash, 3500);
    },
    [flashOpacity, flashTranslate, hideFlash]
  );

  // ── Login handler ─────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showFlash('warning', 'Email dan kata sandi wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      signIn(result.data.user);
    } catch (error) {
      showFlash('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
          </View>
          <Svg height={38} width={200}>
            <Defs>
              <LinearGradient id="titleGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={TITLE_GRADIENT.start} />
                <Stop offset="0.5" stopColor={TITLE_GRADIENT.mid} />
                <Stop offset="1" stopColor={TITLE_GRADIENT.end} />
              </LinearGradient>
            </Defs>
            <SvgText
              fill="url(#titleGrad)"
              fontSize="30"
              fontWeight="800"
              letterSpacing="1"
              x="100"
              y="30"
              textAnchor="middle"
            >
              UKM MCI
            </SvgText>
          </Svg>
          <Text style={styles.appTagline}>Sistem Management Administrasi UKM</Text>
        </View>

        {/* ── Form Card ──────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Masuk ke Akun</Text>
          <Text style={styles.cardSubtitle}>Gunakan akun yang telah didaftarkan</Text>

          {/* Flash Banner */}
          {flash && (
            <Animated.View
              style={[
                styles.flashBanner,
                {
                  backgroundColor: FLASH_CONFIG[flash.type].bg,
                  borderColor: FLASH_CONFIG[flash.type].border,
                  opacity: flashOpacity,
                  transform: [{ translateY: flashTranslate }],
                },
              ]}
            >
              <FontAwesome5
                name={FLASH_CONFIG[flash.type].icon}
                size={14}
                color={FLASH_CONFIG[flash.type].color}
                solid
              />
              <Text style={[styles.flashText, { color: FLASH_CONFIG[flash.type].color }]}>
                {flash.message}
              </Text>
              <TouchableOpacity
                onPress={hideFlash}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <FontAwesome5 name="times" size={12} color={FLASH_CONFIG[flash.type].color} />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Email */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <FontAwesome5 name="envelope" size={13} color={colors.slate600} solid />
              <Text style={styles.label}>Email</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="contoh@email.com"
              placeholderTextColor={colors.slate400}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <FontAwesome5 name="lock" size={13} color={colors.slate600} solid />
              <Text style={styles.label}>Kata Sandi</Text>
            </View>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Minimal 8 karakter"
                placeholderTextColor={colors.slate400}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
                <FontAwesome5
                  name={showPass ? 'eye-slash' : 'eye'}
                  size={16}
                  color={colors.slate400}
                  solid
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tombol Login */}
          <TouchableOpacity
            style={[styles.btnLogin, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={colors.labelOnPrimary} />
            ) : (
              <Text style={styles.btnLoginText}>Masuk →</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <Text style={styles.footer}>Belum punya akun? Hubungi admin atau pengurus UKM MCI.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
