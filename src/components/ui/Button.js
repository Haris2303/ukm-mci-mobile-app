import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { colors, typography, radius, size, spacing } from '../../theme/theme';

/**
 * Button — pill shape, dua variant: primary & secondary.
 *
 * Props:
 *   variant   'primary' | 'secondary'          default: 'primary'
 *   sizeVariant 'sm' | 'md' | 'lg'             default: 'md'
 *   onPress   () => void
 *   loading   boolean                           default: false
 *   disabled  boolean                           default: false
 *   fullWidth boolean                           default: false
 *   leftIcon  ReactNode — icon sebelum label
 *   rightIcon ReactNode — icon setelah label
 *   style     ViewStyle override
 *   textStyle TextStyle override
 */
export default function Button({
  children,
  variant = 'primary',
  sizeVariant = 'md',
  onPress,
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...rest
}) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  const containerStyle = [
    styles.base,
    styles[sizeVariant],
    isPrimary ? styles.primary : styles.secondary,
    fullWidth && styles.fullWidth,
    isDisabled && (isPrimary ? styles.primaryDisabled : styles.secondaryDisabled),
    style,
  ];

  const labelStyle = [
    styles.label,
    styles[`${sizeVariant}Label`],
    isPrimary ? styles.primaryLabel : styles.secondaryLabel,
    textStyle,
  ];

  const indicatorColor = isPrimary ? colors.textOnPrimary : colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.82}
      style={containerStyle}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} size="small" />
      ) : (
        <View style={styles.inner}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text style={labelStyle}>{children}</Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // ─── Base ──────────────────────────────────────────────────────
  base: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Size ─────────────────────────────────────────────────────
  sm: {
    height: size.buttonHeightSm,
    paddingHorizontal: spacing[4],
  },
  md: {
    height: size.buttonHeightMd,
    paddingHorizontal: spacing[6],
  },
  lg: {
    height: size.buttonHeightLg,
    paddingHorizontal: spacing[8],
  },

  // ─── Variant: primary ─────────────────────────────────────────
  primary: {
    backgroundColor: colors.primary,
  },
  primaryDisabled: {
    backgroundColor: colors.neutral300,
  },
  primaryLabel: {
    color: colors.textOnPrimary,
  },

  // ─── Variant: secondary ───────────────────────────────────────
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  secondaryDisabled: {
    borderColor: colors.neutral300,
    backgroundColor: colors.surface,
  },
  secondaryLabel: {
    color: colors.primary,
  },

  // ─── Label ────────────────────────────────────────────────────
  label: {
    ...typography.label,
  },
  smLabel: {
    fontSize: 13,
  },
  mdLabel: {
    fontSize: 15,
  },
  lgLabel: {
    fontSize: 17,
  },

  // ─── Icon spacing ─────────────────────────────────────────────
  iconLeft: {
    marginRight: spacing[2],
  },
  iconRight: {
    marginLeft: spacing[2],
  },
});
