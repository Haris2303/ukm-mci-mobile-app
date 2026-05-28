// src/screens/EditPasswordScreen.jsx
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useChangePassword } from '@features/profile/hooks/useProfile';

import { colors } from '@theme/colors';

import { styles } from './EditPasswordScreen.styles';

/** Warna per level kekuatan password */
const STRENGTH_LEVELS = [
  { label: 'Lemah', color: colors.errorAccent },
  { label: 'Cukup', color: colors.amber500 },
  { label: 'Kuat', color: colors.successIconBg },
  { label: 'Sangat Kuat', color: colors.brand },
];

export default function EditPasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldError, setFieldError] = useState({});

  // ── Mutation ──────────────────────────────────────────────────────────────
  const { mutate: changePwd, isPending } = useChangePassword();

  const handleSave = useCallback(() => {
    // ── Validation ───────────────────────────────────────────────────────────
    const errors = {};
    if (!currentPassword) errors.currentPassword = 'Password saat ini wajib diisi.';
    if (!newPassword) errors.newPassword = 'Password baru wajib diisi.';
    else if (newPassword.length < 8) errors.newPassword = 'Minimal 8 karakter.';
    if (!confirmPassword) errors.confirmPassword = 'Konfirmasi password wajib diisi.';
    else if (newPassword !== confirmPassword) errors.confirmPassword = 'Password tidak cocok.';
    if (newPassword && currentPassword && newPassword === currentPassword)
      errors.newPassword = 'Password baru harus berbeda dari password saat ini.';

    if (Object.keys(errors).length > 0) {
      setFieldError(errors);
      return;
    }

    // ── Submit ───────────────────────────────────────────────────────────────
    setFieldError({});
    changePwd(
      { currentPassword, newPassword, confirmPassword },
      {
        onSuccess: () => {
          Alert.alert('Berhasil', 'Password berhasil diperbarui.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
        onError: (e) => {
          if (e.responseData?.errors?.current_password) {
            setFieldError({ currentPassword: 'Password saat ini tidak sesuai.' });
          } else {
            Alert.alert('Gagal', e.message);
          }
        },
      }
    );
  }, [currentPassword, newPassword, confirmPassword, changePwd, navigation]);

  const canSave = currentPassword && newPassword && confirmPassword && !isPending;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSave}
          disabled={!canSave}
          style={Platform.OS === 'ios' ? { marginLeft: 10 } : { marginRight: 8 }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={colors.labelOnPrimary} />
          ) : (
            <FontAwesome5
              name="save"
              size={20}
              color={
                canSave
                  ? Platform.OS === 'ios'
                    ? colors.slate800
                    : colors.labelOnPrimary
                  : Platform.OS === 'ios'
                    ? colors.slate800Alpha30
                    : colors.whiteAlpha35
              }
              solid
            />
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, canSave, isPending, handleSave]);

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
          <FontAwesome5 name="info-circle" size={14} color={colors.blue700} solid />
          <Text style={styles.infoText}>
            Password baru minimal 8 karakter. Setelah berhasil diubah, gunakan password baru untuk
            login berikutnya.
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
        {newPassword.length > 0 && <PasswordStrength password={newPassword} />}

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
          placeholderTextColor={colors.slate300}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity onPress={onToggleShow} style={styles.eyeBtn}>
          <FontAwesome5 name={show ? 'eye-slash' : 'eye'} size={15} color={colors.slate400} solid />
        </TouchableOpacity>
      </View>
      {error && (
        <View style={styles.errorRow}>
          <FontAwesome5 name="exclamation-circle" size={11} color={colors.errorAccent} solid />
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
  const level = STRENGTH_LEVELS[Math.max(0, score - 1)];

  return (
    <View style={styles.strengthBox}>
      <View style={styles.strengthBars}>
        {[1, 2, 3, 4].map((n) => (
          <View
            key={n}
            style={[
              styles.strengthBar,
              { backgroundColor: score >= n ? level.color : colors.slate200 },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.strengthLabel, { color: level.color }]}>{level.label}</Text>
    </View>
  );
}
