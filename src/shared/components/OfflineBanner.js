import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@theme/theme';

import { useNetworkStatus } from '../hooks/useNetworkStatus';

const CONTENT_HEIGHT = 38;

export default function OfflineBanner() {
  const { isOffline } = useNetworkStatus();
  const insets = useSafeAreaInsets();
  // Mulai tersembunyi di atas layar
  const [slideY] = useState(() => new Animated.Value(-(insets.top + CONTENT_HEIGHT + 10)));

  useEffect(() => {
    Animated.spring(slideY, {
      toValue: isOffline ? 0 : -(insets.top + CONTENT_HEIGHT + 10),
      useNativeDriver: true,
      tension: 120,
      friction: 14,
    }).start();
  }, [isOffline, insets.top, slideY]);

  return (
    <Animated.View
      pointerEvents={isOffline ? 'box-none' : 'none'}
      style={[
        styles.banner,
        {
          paddingTop: insets.top + 6,
          transform: [{ translateY: slideY }],
        },
      ]}
    >
      <FontAwesome5 name="wifi" size={13} color={colors.warningText} solid />
      <Text style={styles.text}>Tidak ada koneksi internet</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: colors.warningBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.warningBorder,
    paddingBottom: spacing[2],
    paddingHorizontal: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: CONTENT_HEIGHT,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.warningText,
  },
});
