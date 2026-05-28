import React, { memo } from 'react';
import { View, Text } from 'react-native';

import AppIcon from 'src/components/ui/Icon';

import EmptyKas from '../components/EmptyKas';
import TunggakanItem from '../components/TunggakanItem';
import { EMPTY_KAS_COLOR, styles } from '../styles/TunggakanTab.styles';

function TunggakanTab({ data }) {
  if (!data || data.jumlah_tunggakan === 0) {
    return (
      <EmptyKas
        iconName="check-circle"
        title="Tidak Ada Tunggakan!"
        desc="Selamat! Semua iuran Anda telah lunas. Terima kasih atas ketertiban Anda dalam membayar iuran."
        bgColor={EMPTY_KAS_COLOR.successBg}
        accentColor={EMPTY_KAS_COLOR.successIconBg}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryIconBox}>
          <AppIcon name="chart-bar" size={24} color="warningText" />
        </View>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryLabel}>Total Tunggakan Anda</Text>
          <Text style={styles.summaryValue}>{data.total_format}</Text>
          <Text style={styles.summaryMeta}>{data.jumlah_tunggakan} bulan belum dibayar</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <AppIcon name="lightbulb" size={16} color="infoText" />
        <Text style={styles.infoText}>
          Hubungi <Text style={{ fontWeight: '700' }}>Bendahara UKM</Text> untuk melakukan
          pembayaran tunai. Status akan otomatis update setelah bendahara mencatat pembayaran Anda.
        </Text>
      </View>

      <Text style={styles.sectionLabel}>Daftar Tagihan</Text>

      {data.tagihan.map((item, idx) => (
        <TunggakanItem key={item.id ?? `tagihan-${idx}`} item={item} />
      ))}
    </View>
  );
}

export default memo(TunggakanTab);
