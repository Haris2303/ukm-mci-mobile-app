import { FontAwesome5 } from '@expo/vector-icons';
import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

import { colors, fontFamily, spacing } from '@theme/theme';

import { useKasTunggakan, useKasSaldo } from '../hooks/useKasQueries';

function KasRingkasanCard({ onPress }) {
  const tunggakanQuery = useKasTunggakan();
  const saldoQuery = useKasSaldo();

  const tunggakanCount = tunggakanQuery.data?.jumlah_tunggakan ?? 0;
  const tunggakanTotal = tunggakanQuery.data?.total_nominal ?? 0;
  const saldoOrganisasi = saldoQuery.data ?? null;
  const isLoading = saldoQuery.isLoading;

  const adaTunggakan = tunggakanCount > 0;

  return (
    <View style={styles.wrapper}>
      {/* ── Card utama: Saldo Organisasi ───────────────────── */}
      <TouchableOpacity style={styles.cardSaldo} activeOpacity={0.92} onPress={onPress}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <FontAwesome5 name="coins" size={22} color={colors.labelOnPrimary} solid />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerLabel}>Saldo Kas Organisasi</Text>
            <Text style={styles.headerSub}>Transparansi keuangan UKM</Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.labelOnPrimary} />
          </View>
        ) : (
          <Text style={styles.saldoAngka}>{saldoOrganisasi?.total_saldo_format ?? 'Rp —'}</Text>
        )}

        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            <FontAwesome5 name="clock" size={11} color={colors.whiteAlpha70} />
            <Text style={styles.metaText}>{saldoOrganisasi?.diperbarui_pada ?? 'Memuat...'}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* ── Alert tunggakan (hanya jika ada) ─────────────── */}
      {adaTunggakan && (
        <TouchableOpacity style={styles.alertCard} activeOpacity={0.92} onPress={onPress}>
          <View style={styles.alertIconBox}>
            <FontAwesome5 name="exclamation-triangle" size={20} color={colors.warningText} solid />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Anda Memiliki Tunggakan</Text>
            <Text style={styles.alertText}>
              {tunggakanCount} bulan belum dibayar · Total{' '}
              <Text style={styles.alertNominal}>Rp {tunggakanTotal.toLocaleString('id-ID')}</Text>
            </Text>
          </View>
          <View style={styles.alertChevron}>
            <FontAwesome5 name="chevron-right" size={14} color={colors.warningText} />
          </View>
        </TouchableOpacity>
      )}

      {/* ── Status lunas (jika tidak ada tunggakan) ─────── */}
      {!adaTunggakan && saldoOrganisasi && (
        <View style={styles.lunasCard}>
          <View style={styles.lunasIconBox}>
            <FontAwesome5 name="check-circle" size={20} color={colors.labelOnPrimary} solid />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.lunasTitle}>Iuran Anda Lunas</Text>
            <Text style={styles.lunasText}>Terima kasih atas ketertiban Anda 🎉</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing[3] },

  cardSaldo: {
    backgroundColor: colors.brand,
    borderRadius: 24,
    padding: 22,
    overflow: 'hidden',
    position: 'relative',
    // Colored shadow — intentional, tidak pakai shadow preset
    shadowColor: colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  circle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.whiteAlpha8,
  },
  circle2: {
    position: 'absolute',
    bottom: -30,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.tealAlpha10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.whiteAlpha18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: { flex: 1 },
  headerLabel: {
    color: colors.labelOnPrimary,
    fontSize: 14,
    fontFamily: fontFamily.regular,
  },
  headerSub: {
    color: colors.whiteAlpha70,
    fontSize: 11,
    fontFamily: fontFamily.light,
    marginTop: 1,
  },
  loadingBox: { paddingVertical: spacing[3], alignItems: 'flex-start' },
  saldoAngka: {
    color: colors.labelOnPrimary,
    fontSize: 30,
    fontFamily: fontFamily.regular,
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.whiteAlpha15,
  },
  metaLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: {
    color: colors.whiteAlpha70,
    fontSize: 11,
    fontFamily: fontFamily.light,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.warningBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.warningBorder,
    borderRadius: 16,
    padding: spacing[4],
  },
  alertIconBox: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.warningIcon,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: { flex: 1 },
  alertTitle: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.warningText,
  },
  alertText: {
    fontSize: 12,
    fontFamily: fontFamily.light,
    color: colors.warningMuted,
    marginTop: 2,
  },
  alertNominal: { fontFamily: fontFamily.regular, color: colors.orange900 },
  alertChevron: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: colors.amberAlpha15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lunasCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.successBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.successBorder,
    borderRadius: 16,
    padding: 14,
  },
  lunasIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.successIconBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lunasTitle: { fontSize: 13, fontFamily: fontFamily.regular, color: colors.successText },
  lunasText: {
    fontSize: 11,
    fontFamily: fontFamily.light,
    color: colors.successMuted,
    marginTop: 1,
  },
});

export default memo(KasRingkasanCard);
