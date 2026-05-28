import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { colors, spacing } from '@theme/theme';

/**
 * ListItem — iOS Settings-style list row.
 *
 * Props:
 *   iconName      string  — FontAwesome5 icon name
 *   iconColor     string  — warna background squircle icon
 *   title         string  — teks utama (required)
 *   subtitle      string  — teks sekunder kecil di bawah title
 *   value         string  — teks kanan (misal: nilai setting)
 *   onPress       () => void — jika diisi, baris menjadi tappable + chevron muncul
 *   rightElement  ReactNode — custom elemen kanan (switch, badge, dll)
 *   showSeparator boolean — tampilkan separator bawah (default: true)
 *   dangerous     boolean — warnai title merah (destructive action)
 *   disabled      boolean
 */
export default function ListItem({
  iconName,
  iconColor = colors.systemBlue,
  title,
  subtitle,
  value,
  onPress,
  rightElement,
  showSeparator = true,
  dangerous = false,
  disabled = false,
}) {
  const Wrapper = onPress ? TouchableOpacity : View;
  const wrapperProps = onPress ? { onPress, activeOpacity: 0.6, disabled } : {};

  return (
    <Wrapper style={styles.row} {...wrapperProps}>
      {/* ── Left icon ─────────────────────── */}
      {iconName ? (
        <View
          style={[styles.iconSquircle, { backgroundColor: iconColor }]}
          experimental_continuousCorners={true}
        >
          <FontAwesome5 name={iconName} size={14} color="#fff" solid />
        </View>
      ) : null}

      {/* ── Content ───────────────────────── */}
      <View style={[styles.content, !showSeparator && styles.contentNoSep]}>
        <View style={styles.textGroup}>
          <Text
            style={[
              styles.title,
              dangerous && styles.titleDangerous,
              disabled && styles.titleDisabled,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* ── Right side ─────────────────── */}
        <View style={styles.right}>
          {value ? (
            <Text style={styles.value} numberOfLines={1}>
              {value}
            </Text>
          ) : null}
          {rightElement ?? null}
          {onPress && !rightElement ? (
            <FontAwesome5 name="chevron-right" size={11} color={colors.labelTertiary} />
          ) : null}
        </View>
      </View>
    </Wrapper>
  );
}

const ICON_SIZE = 30;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing[4],
    minHeight: 44,
  },

  // ─── Icon ─────────────────────────────────────────────────────────
  iconSquircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },

  // ─── Content row (with separator) ─────────────────────────────────
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separatorOpaque,
  },
  contentNoSep: {
    borderBottomWidth: 0,
  },

  // ─── Text ──────────────────────────────────────────────────────────
  textGroup: { flex: 1, gap: 2 },
  title: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.label,
    letterSpacing: -0.1,
  },
  titleDangerous: { color: colors.systemRed },
  titleDisabled: { color: colors.labelSecondary },
  subtitle: {
    fontSize: 13,
    color: colors.labelSecondary,
    lineHeight: 18,
  },

  // ─── Right ─────────────────────────────────────────────────────────
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginLeft: spacing[2],
  },
  value: {
    fontSize: 15,
    color: colors.labelSecondary,
    letterSpacing: -0.1,
  },
});
