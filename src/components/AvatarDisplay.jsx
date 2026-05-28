// src/components/AvatarDisplay.js
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Text, View } from 'react-native';

import { colors } from '@theme/colors';

import { STORAGE_URL } from '../services/profileApi';

export function resolveAvatarUrl(avatar) {
  if (!avatar) return null;
  if (avatar.startsWith('emoji:')) return null;
  if (
    avatar.startsWith('http://') ||
    avatar.startsWith('https://') ||
    avatar.startsWith('file://')
  ) {
    return avatar;
  }
  return `${STORAGE_URL}/${avatar}`;
}

export function parseAvatar(avatar) {
  if (!avatar) return { type: 'initials' };
  if (avatar.startsWith('emoji:')) {
    const parts = avatar.split(':');
    return { type: 'emoji', emoji: parts[1] ?? '😊', bg: parts[2] ?? '1a56db' };
  }
  return { type: 'photo', url: resolveAvatarUrl(avatar) };
}

export default function AvatarDisplay({ avatar, name, size = 64, borderRadius, style }) {
  const radius = borderRadius ?? size / 2;
  const parsed = parseAvatar(avatar);
  const inisial = (name ?? 'A')[0].toUpperCase();

  if (parsed.type === 'photo') {
    return (
      <Image
        source={{ uri: parsed.url }}
        style={[{ width: size, height: size, borderRadius: radius }, style]}
        resizeMode="cover"
      />
    );
  }

  if (parsed.type === 'emoji') {
    return (
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: `#${parsed.bg}`,
            justifyContent: 'center',
            alignItems: 'center',
          },
          style,
        ]}
      >
        <Text style={{ fontSize: size * 0.45 }}>{parsed.emoji}</Text>
      </View>
    );
  }

  // initials fallback
  return (
    <LinearGradient
      colors={[colors.brand, colors.brandLight]}
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Text style={{ fontSize: size * 0.38, fontWeight: '800', color: colors.labelOnPrimary }}>
        {inisial}
      </Text>
    </LinearGradient>
  );
}
