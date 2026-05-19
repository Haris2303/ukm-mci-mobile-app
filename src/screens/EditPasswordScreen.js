// src/screens/EditPasswordScreen.js
import React, { useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { changePassword } from "../services/profileApi";

export default function EditPasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fieldError, setFieldError] = useState({});

  const validate = () => {
    const errors = {};
    if (!currentPassword) errors.currentPassword = "Password saat ini wajib diisi.";
    if (!newPassword) errors.newPassword = "Password baru wajib diisi.";
    else if (newPassword.length < 8) errors.newPassword = "Minimal 8 karakter.";
    if (!confirmPassword) errors.confirmPassword = "Konfirmasi password wajib diisi.";
    else if (newPassword !== confirmPassword) errors.confirmPassword = "Password tidak cocok.";
    if (newPassword && currentPassword && newPassword === currentPassword)
      errors.newPassword = "Password baru harus berbeda dari password saat ini.";
    return errors;
  };

  const handleSave = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldError(errors);
      return;
    }
    setFieldError({});
    setSaving(true);
    try {
      await changePassword(currentPassword, newPassword, confirmPassword);
      Alert.alert("Berhasil", "Password berhasil diperbarui.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      if (e.responseData?.errors?.current_password) {
        setFieldError({ currentPassword: "Password saat ini tidak sesuai." });
      } else {
        Alert.alert("Gagal", e.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const canSave = currentPassword && newPassword && confirmPassword && !saving;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSave}
          disabled={!canSave}
          style={{
            marginRight: 4,
            paddingHorizontal: 14,
            paddingVertical: 7,
            backgroundColor: canSave ? "#fff" : "rgba(255,255,255,0.3)",
            borderRadius: 10,
            minWidth: 68,
            alignItems: "center",
          }}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#1a56db" />
          ) : (
            <Text style={{ color: canSave ? "#1a56db" : "rgba(255,255,255,0.5)", fontWeight: "800", fontSize: 14 }}>
              Simpan
            </Text>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, canSave, saving]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Info */}
        <View style={styles.infoBox}>
          <FontAwesome5 name="info-circle" size={14} color="#1d4ed8" solid />
          <Text style={styles.infoText}>
            Password baru minimal 8 karakter. Setelah berhasil diubah, gunakan password baru untuk login berikutnya.
          </Text>
        </View>

        {/* ── Form ─────────────────────────────────────── */}
        <View style={styles.formCard}>
          <PasswordField
            label="Password Saat Ini"
            value={currentPassword}
            onChangeText={(v) => {
              setCurrentPassword(v);
              setFieldError((p) => ({ ...p, currentPassword: undefined }));
            }}
            show={showCurrent}
            onToggleShow={() => setShowCurrent((p) => !p)}
            error={fieldError.currentPassword}
            placeholder="Masukkan password saat ini"
          />

          <View style={styles.divider} />

          <PasswordField
            label="Password Baru"
            value={newPassword}
            onChangeText={(v) => {
              setNewPassword(v);
              setFieldError((p) => ({ ...p, newPassword: undefined }));
            }}
            show={showNew}
            onToggleShow={() => setShowNew((p) => !p)}
            error={fieldError.newPassword}
            placeholder="Minimal 8 karakter"
          />

          <View style={styles.divider} />

          <PasswordField
            label="Konfirmasi Password Baru"
            value={confirmPassword}
            onChangeText={(v) => {
              setConfirmPassword(v);
              setFieldError((p) => ({ ...p, confirmPassword: undefined }));
            }}
            show={showConfirm}
            onToggleShow={() => setShowConfirm((p) => !p)}
            error={fieldError.confirmPassword}
            placeholder="Ulangi password baru"
          />
        </View>

        {/* Strength indicator */}
        {newPassword.length > 0 && (
          <PasswordStrength password={newPassword} />
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function PasswordField({ label, value, onChangeText, show, onToggleShow, error, placeholder }) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputRow, error && styles.inputRowError]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!show}
          placeholder={placeholder}
          placeholderTextColor="#cbd5e1"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity onPress={onToggleShow} style={styles.eyeBtn}>
          <FontAwesome5
            name={show ? "eye-slash" : "eye"}
            size={15}
            color="#94a3b8"
            solid
          />
        </TouchableOpacity>
      </View>
      {error && (
        <View style={styles.errorRow}>
          <FontAwesome5 name="exclamation-circle" size={11} color="#ef4444" solid />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

function PasswordStrength({ password }) {
  const len = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const score = [len >= 8, hasUpper, hasNum, hasSymbol].filter(Boolean).length;

  const levels = [
    { label: "Lemah", color: "#ef4444", filled: 1 },
    { label: "Cukup", color: "#f59e0b", filled: 2 },
    { label: "Kuat", color: "#22c55e", filled: 3 },
    { label: "Sangat Kuat", color: "#1a4ff5", filled: 4 },
  ];
  const level = levels[Math.max(0, score - 1)];

  return (
    <View style={styles.strengthBox}>
      <View style={styles.strengthBars}>
        {[1, 2, 3, 4].map((n) => (
          <View
            key={n}
            style={[
              styles.strengthBar,
              { backgroundColor: score >= n ? level.color : "#e2e8f0" },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.strengthLabel, { color: level.color }]}>{level.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4ff" },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 16 },

  infoBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#eff6ff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    alignItems: "flex-start",
  },
  infoText: { flex: 1, fontSize: 13, color: "#1d4ed8", lineHeight: 19 },

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginHorizontal: 14 },

  fieldWrapper: { paddingHorizontal: 14, paddingVertical: 14, gap: 8 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    paddingHorizontal: 14,
    height: 48,
  },
  inputRowError: { borderColor: "#fca5a5", backgroundColor: "#fff5f5" },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1e293b",
    fontWeight: "500",
  },
  eyeBtn: {
    padding: 6,
  },
  errorRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  errorText: { fontSize: 12, color: "#ef4444", fontWeight: "600" },

  strengthBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    elevation: 2,
  },
  strengthBars: { flex: 1, flexDirection: "row", gap: 4 },
  strengthBar: { flex: 1, height: 5, borderRadius: 3 },
  strengthLabel: { fontSize: 12, fontWeight: "800", minWidth: 72, textAlign: "right" },
});
