import React, { memo } from 'react';
import { View, Text } from 'react-native';

import AppIcon from 'src/components/ui/Icon';

import { styles } from '../styles/TunggakanItem.styles';

function TunggakanItem({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.periode}>{item.bulan_tagihan_format}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Belum Dibayar</Text>
          </View>
        </View>
        <Text style={styles.nominal}>{item.nominal_format}</Text>
        {item.catatan && (
          <View style={styles.catatanRow}>
            <AppIcon name="comment-alt" size={11} color="slate500" />
            <Text style={styles.catatan} numberOfLines={2}>
              {item.catatan}
            </Text>
          </View>
        )}
        <View style={styles.metaRow}>
          <AppIcon name="calendar-alt" size={11} color="slate400" />
          <Text style={styles.meta}>Ditagihkan: {item.dibuat_pada}</Text>
        </View>
      </View>
    </View>
  );
}

export default memo(TunggakanItem);
