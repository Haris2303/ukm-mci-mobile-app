import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, shadow, spacing } from '../../theme/theme';

/**
 * Card — iOS-style surface dengan squircle corners & shadow minimalis.
 *
 * Props:
 *   onPress      () => void — jika diisi, card menjadi touchable
 *   style        ViewStyle override
 *   contentStyle ViewStyle override untuk inner wrapper
 *   shadow       'none' | 'xs' | 'sm' | 'md' | 'lg'   default: 'sm'
 *   radius       number                                 default: 12
 *
 * Sub-komponen:
 *   <Card.Header>   area atas, title + badge
 *   <Card.Body>     konten utama
 *   <Card.Footer>   area bawah dengan separator tipis
 *   <Card.Badge>    pill tag kecil
 */
function Card({
  onPress,
  style,
  contentStyle,
  shadowLevel = 'sm',
  borderRadius = radius.md,
  children,
}) {
  const cardStyle = [
    styles.card,
    { borderRadius },
    shadow[shadowLevel] ?? shadow.sm,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.92}
        style={cardStyle}
        experimental_continuousCorners={true}
      >
        <View style={[styles.content, contentStyle]}>{children}</View>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={cardStyle}
      experimental_continuousCorners={true}
    >
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

// ─── Sub-komponen ─────────────────────────────────────────────────────────────

function CardHeader({ style, children }) {
  return <View style={[styles.header, style]}>{children}</View>;
}

function CardBody({ style, children }) {
  return <View style={[styles.body, style]}>{children}</View>;
}

function CardFooter({ style, children }) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

function CardBadge({ color, bgColor, style, children }) {
  return (
    <View style={[styles.badge, bgColor ? { backgroundColor: bgColor } : null, style]}>
      <Text style={[styles.badgeText, color ? { color } : null]}>{children}</Text>
    </View>
  );
}

Card.Header = CardHeader;
Card.Body   = CardBody;
Card.Footer = CardFooter;
Card.Badge  = CardBadge;

export default Card;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  content: {},

  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[2],
  },

  body: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },

  footer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    paddingTop: spacing[3],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.separatorOpaque,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },

  badge: {
    backgroundColor: colors.badgeBg,
    borderRadius: 999,
    paddingHorizontal: spacing[3],
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.badgeText,
    letterSpacing: 0.3,
  },
});
