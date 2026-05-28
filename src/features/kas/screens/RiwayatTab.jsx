import React, { memo } from 'react';
import { View, Text } from 'react-native';

import AppIcon from 'src/components/ui/Icon';

import EmptyKas from '../components/EmptyKas';
import {
  NEUTRAL150_COLOR,
  SLATE400_COLOR,
  styles,
  SUCCESS_TEXT_COLOR,
} from '../styles/RiwayatTab.styles';

function RiwayatTab({ data }) {
  if (!data || data.jumlah_pembayaran === 0) {
    return (
      <EmptyKas
        iconName="inbox"
        title="Belum Ada Riwayat"
        desc="Riwayat pembayaran Anda akan muncul di sini setelah Bendahara mencatat pembayaran iuran."
        bgColor={NEUTRAL150_COLOR}
        accentColor={SLATE400_COLOR}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.summaryCard, styles.summaryCardSuccess]}>
        <View style={[styles.summaryIconBox, styles.summaryIconBoxSuccess]}>
          <AppIcon name="check-circle" size={24} color="labelOnPrimary" />
        </View>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryLabel}>Total Sudah Dibayar</Text>
          <Text style={[styles.summaryValue, { color: SUCCESS_TEXT_COLOR }]}>
            {data.total_dibayar_format}
          </Text>
          <Text style={styles.summaryMeta}>{data.jumlah_pembayaran} kali pembayaran</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Riwayat Pembayaran</Text>

      {data.riwayat.map((item, idx) => (
        <View key={item.id ?? `riwayat-${idx}`} style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View style={styles.timelineDot}>
              <Text style={styles.timelineDotIcon}>✓</Text>
            </View>
            {idx < data.riwayat.length - 1 && <View style={styles.timelineLine} />}
          </View>

          <View style={styles.timelineCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemPeriode}>{item.bulan_tagihan_format}</Text>
              <View style={styles.statusBadgeLunas}>
                <Text style={styles.statusBadgeLunasText}>✓ Lunas</Text>
              </View>
            </View>
            <Text style={[styles.itemNominal, { color: SUCCESS_TEXT_COLOR }]}>
              {item.nominal_format}
            </Text>
            <View style={styles.metaRow}>
              <AppIcon name="clock" size={11} color="slate400" />
              <Text style={styles.itemMeta}>Dibayar: {item.tanggal_bayar_format} WIT</Text>
            </View>
            {item.catatan && (
              <View style={styles.catatanRow}>
                <AppIcon name="comment-alt" size={11} color="slate500" />
                <Text style={styles.itemCatatan} numberOfLines={2}>
                  {item.catatan}
                </Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

export default memo(RiwayatTab);
