import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { colors, radius, spacing, size } from '../../theme/theme';

/**
 * Button — iOS-style dengan squircle corners.
 *
 * Props:
 *   variant     'filled' | 'tinted' | 'plain' | 'destructive'   default: 'filled'
 *   color       string — warna brand (default: colors.primary)
 *   sizeVariant 'sm' | 'md' | 'lg'                              default: 'md'
 *   onPress     () => void
 *   loading     boolean
 *   disabled    boolean
 *   fullWidth   boolean
 *   leftIcon    ReactNode
 *   rightIcon   ReactNode
 *   style       ViewStyle override
 *   textStyle   TextStyle override
 */
export default function Button({
  children,
  variant = 'filled',
  color,
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
  const baseColor = variant === 'destructive'
    ? colors.systemRed
    : (color ?? colors.primary);

  const isDisabled = disabled || loading;

  const containerStyle = [
    styles.base,
    styles[sizeVariant],
    variantContainer(variant, baseColor),
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  const labelStyle = [
    styles.label,
    styles[`${sizeVariant}Label`],
    variantLabel(variant, baseColor),
    textStyle,
  ];

  const indicatorColor = (variant === 'filled' || variant === 'destructive')
    ? '#fff'
    : baseColor;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={containerStyle}
      experimental_continuousCorners={true}
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

function variantContainer(variant, color) {
  switch (variant) {
    case 'filled':
    case 'destructive':
      return { backgroundColor: color };
    case 'tinted':
      return { backgroundColor: color + '1A' }; // ~10% opacity
    case 'plain':
      return { backgroundColor: 'transparent' };
    default:
      return { backgroundColor: color };
  }
}

function variantLabel(variant, color) {
  switch (variant) {
    case 'filled':
    case 'destructive':
      return { color: '#fff' };
    case 'tinted':
    case 'plain':
      return { color };
    default:
      return { color: '#fff' };
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  fullWidth: { alignSelf: 'stretch' },
  disabled: { opacity: 0.4 },

  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ─── Size ─────────────────────────────────────────────────────────
  sm: { height: size.buttonHeightSm, paddingHorizontal: spacing[4] },
  md: { height: size.buttonHeightMd, paddingHorizontal: spacing[5] },
  lg: { height: size.buttonHeightLg, paddingHorizontal: spacing[6] },

  // ─── Label ────────────────────────────────────────────────────────
  label:    { fontWeight: '600', letterSpacing: -0.1 },
  smLabel:  { fontSize: 14 },
  mdLabel:  { fontSize: 16 },
  lgLabel:  { fontSize: 17 },

  iconLeft:  { marginRight: spacing[2] },
  iconRight: { marginLeft: spacing[2] },
});
