import React, { memo } from 'react';
import { View, Text } from 'react-native';

import AppIcon from 'src/components/ui/Icon';

import BreakdownRow from '../components/BreakdownRow';
import { BRAND_COLOR, DANGER_COLOR, styles } from '../styles/TransparansiTab.styles';

function TransparansiTab({ data }) {
  if (!data) return null;

  const isPositif = data.total_saldo >= 0;

  return (
    <View style={styles.container}>
      <View style={[styles.bigSaldo, !isPositif && { backgroundColor: DANGER_COLOR }]}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <View style={styles.labelRow}>
          <AppIcon name="coins" size={13} color="whiteAlpha85" />
          <Text style={styles.label}>Saldo Kas Organisasi</Text>
        </View>
        <Text style={styles.saldoValue}>{data.total_saldo_format}</Text>
        <View style={styles.metaRow}>
          <AppIcon name="clock" size={11} color="whiteAlpha70" />
          <Text style={styles.meta}>Diperbarui: {data.diperbarui_pada}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Rincian Saldo</Text>

      <View style={styles.breakdownCard}>
        <BreakdownRow
          category="iuran"
          iconName="users"
          label="Iuran Anggota Lunas"
          value={data.rincian.iuran_lunas.format}
          isPositive
        />
        <View style={styles.divider} />
        <BreakdownRow
          category="donasi"
          iconName="gift"
          label="Donasi & Bantuan"
          value={data.rincian.kas_masuk.format}
          isPositive
        />
        <View style={styles.divider} />
        <BreakdownRow
          category="expense"
          iconName="shopping-cart"
          label="Pengeluaran"
          value={data.rincian.kas_keluar.format}
          isPositive={false}
        />
        <View style={[styles.divider, { backgroundColor: BRAND_COLOR, height: 2 }]} />
        <BreakdownRow
          category="total"
          iconName="gem"
          label="Saldo Akhir"
          value={data.total_saldo_format}
          isTotal
          isPositive={isPositif}
        />
      </View>

      <View style={styles.disclaimerBox}>
        <AppIcon name="info-circle" size={16} color="slate500" />
        <Text style={styles.disclaimerText}>
          Data ini diperbarui secara real-time dari pencatatan Bendahara. Jika menemukan
          ketidaksesuaian, harap hubungi pengurus segera.
        </Text>
      </View>
    </View>
  );
}

export default memo(TransparansiTab);
