// src/screens/LoginScreen.js
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

import { colors } from '@theme/colors';

import { styles, TITLE_GRADIENT } from './LoginScreen.styles';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/api';

const logoImage = require('../../../assets/logo.png');

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Oops!', 'Email dan kata sandi wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      signIn(result.data.user); // simpan user ke context global
    } catch (error) {
      Alert.alert('Login Gagal', error.message);
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
        {/* Header */}
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

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Masuk ke Akun</Text>
          <Text style={styles.cardSubtitle}>Gunakan akun yang telah didaftarkan</Text>

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

        {/* Footer */}
        <Text style={styles.footer}>Belum punya akun? Hubungi admin atau pengurus UKM MCI.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
