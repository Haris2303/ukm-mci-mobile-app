import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, radius, shadow, spacing } from '../../theme/theme';

/**
 * Card — surface putih, border tipis, shadow ringan.
 *
 * Props:
 *   onPress     () => void — jika diisi, card menjadi touchable
 *   style       ViewStyle override untuk container
 *   contentStyle ViewStyle override untuk inner content
 *
 * Sub-komponen (gunakan sebagai children terstruktur):
 *   <Card.Header>   — area atas, biasanya title + badge
 *   <Card.Body>     — konten utama
 *   <Card.Footer>   — area bawah, biasanya action button
 *   <Card.Badge>    — pill tag kecil uppercase
 *
 * Contoh penggunaan:
 *   <Card onPress={...}>
 *     <Card.Header>
 *       <Card.Badge>Aktif</Card.Badge>
 *       <Text style={...}>Judul</Text>
 *     </Card.Header>
 *     <Card.Body>
 *       <Text>Isi konten</Text>
 *     </Card.Body>
 *     <Card.Footer>
 *       <Button>Lihat Detail</Button>
 *     </Card.Footer>
 *   </Card>
 */
function Card({ onPress, style, contentStyle, children }) {
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.92}
        style={[styles.card, style]}
      >
        <View style={[styles.content, contentStyle]}>{children}</View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, style]}>
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

/**
 * Badge/pill-tag — rounded-full, background #daeaff, text #1340e1, uppercase.
 */
function CardBadge({ style, textStyle, children }) {
  return (
    <View style={[styles.badge, style]}>
      <Text style={[styles.badgeText, textStyle]}>{children}</Text>
    </View>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Badge = CardBadge;

export default Card;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  content: {
    // padding dihandle per-section agar header/footer bisa punya warna berbeda
  },

  // ─── Header ─────────────────────────────────────
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[2],
  },

  // ─── Body ────────────────────────────────────────
  body: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },

  // ─── Footer ──────────────────────────────────────
  footer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },

  // ─── Badge ────────────────────────────────────────
  badge: {
    backgroundColor: colors.badgeBg,
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...typography.badge,
    color: colors.badgeText,
  },
});
