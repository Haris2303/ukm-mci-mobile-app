// src/screens/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Oops!", "Email dan kata sandi wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      signIn(result.data.user); // simpan user ke context global
    } catch (error) {
      Alert.alert("Login Gagal", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoEmoji}>🎓</Text>
          </View>
          <Text style={styles.appName}>UKM MCI</Text>
          <Text style={styles.appTagline}>Sistem Presensi Digital</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Masuk ke Akun</Text>
          <Text style={styles.cardSubtitle}>
            Gunakan akun yang telah didaftarkan
          </Text>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>📧 Email</Text>
            <TextInput
              style={styles.input}
              placeholder="contoh@email.com"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>🔒 Kata Sandi</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Minimal 8 karakter"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPass(!showPass)}
              >
                <FontAwesome5 name={showPass ? "eye-slash" : "eye"} size={16} color="#94a3b8" solid />
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
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnLoginText}>Masuk →</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Belum punya akun? Hubungi admin atau pengurus UKM MCI.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4ff",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#1a56db",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#1a56db",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  logoEmoji: { fontSize: 38 },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },

  // Card
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 28,
  },

  // Input
  inputGroup: { marginBottom: 20 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1e293b",
    backgroundColor: "#f8fafc",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eyeBtn: {
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    backgroundColor: "#f8fafc",
  },

  // Button
  btnLogin: {
    backgroundColor: "#1a56db",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#1a56db",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  btnDisabled: { opacity: 0.65 },
  btnLoginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Footer
  footer: {
    textAlign: "center",
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 28,
    lineHeight: 20,
  },
});
