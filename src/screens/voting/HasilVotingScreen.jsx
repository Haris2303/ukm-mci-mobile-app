// src/screens/voting/HasilVotingScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';

import { LoadingState } from '@shared/components';
import AppIcon from 'src/components/ui/Icon';

import { useHasil } from '@features/voting/hooks/useVoting';

import { styles, COLORS } from './HasilVotingScreen.styles';

export default function HasilVotingScreen({ route, navigation }) {
  const { id } = route.params;

  // ── Server state ──────────────────────────────────────────────────────────
  const { data: hasil, isLoading, isError, error } = useHasil(id);

  // ── Guard states ──────────────────────────────────────────────────────────
  if (isLoading) return <LoadingState message="Memuat hasil pemilihan..." />;

  // Error HasilVoting punya UX domain-spesifik: "Hasil Belum Tersedia" +
  // icon lock + tombol "Kembali" (bukan "Coba Lagi") → render custom.
  if (isError) {
    return (
      <View style={styles.center}>
        <AppIcon name="lock" size={44} color="slate400" style={{ marginBottom: 8 }} />
        <Text style={styles.errorTitle}>Hasil Belum Tersedia</Text>
        <Text style={styles.errorMsg}>{error?.message}</Text>
        <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
          <View style={styles.btnBackRow}>
            <AppIcon name="arrow-left" size={13} color="labelOnPrimary" />
            <Text style={styles.btnBackText}>Kembali</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  const pemenang = hasil.pemenang;
  const kandidat = hasil.kandidat ?? [];
  const isSelesai = hasil.election.status === 'selesai';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>{hasil.election.posisi}</Text>
        <Text style={styles.headerTitle}>{hasil.election.judul}</Text>
        <View style={[styles.statusBadge, isSelesai ? styles.badgeSelesai : styles.badgeAktif]}>
          <View style={styles.statusBadgeRow}>
            {isSelesai ? (
              <AppIcon name="flag-checkered" size={11} color="labelOnPrimary" />
            ) : (
              <AppIcon name="circle" size={10} color="green400" />
            )}
            <Text style={styles.statusText}>
              {isSelesai ? 'Pemilihan Selesai' : 'Sedang Berlangsung'}
            </Text>
          </View>
        </View>
      </View>

      {/* Total Suara */}
      <View style={styles.totalBox}>
        <Text style={styles.totalAngka}>{hasil.total_suara}</Text>
        <Text style={styles.totalLabel}>Total Suara Sah</Text>
      </View>

      {/* Pemenang (jika selesai) — 👑 intentionally kept as emoji */}
      {isSelesai && pemenang && (
        <View style={styles.pemenangCard}>
          <Text style={styles.pemenangMahkota}>👑</Text>
          <Text style={styles.pemenangLabel}>TERPILIH</Text>
          <Text style={styles.pemenangNama}>{pemenang.nama}</Text>
          <Text style={styles.pemenangPosisi}>{hasil.election.posisi}</Text>
          <View style={styles.pemenangStats}>
            <StatBox nilai={pemenang.jumlah_suara} label="Suara" />
            <View style={styles.statDivider} />
            <StatBox nilai={`${pemenang.persentase}%`} label="Perolehan" />
          </View>
        </View>
      )}

      {/* Bar Chart Semua Kandidat */}
      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <AppIcon name="chart-bar" size={15} color="slate800" />
          <Text style={styles.sectionTitle}>Perolehan Suara</Text>
        </View>
        {kandidat.map((k, idx) => (
          <BarRow
            key={k.id ?? `bar-${idx}`}
            kandidat={k}
            color={COLORS[idx % COLORS.length]}
            isPemenang={isSelesai && idx === 0}
          />
        ))}
      </View>

      {/* Keterangan Anonimitas */}
      <View style={styles.anonBox}>
        <AppIcon name="lock" size={18} color="slate500" />
        <Text style={styles.anonText}>
          Identitas pemilih dirahasiakan. Hasil ini hanya menampilkan jumlah suara tanpa informasi
          siapa yang memilih siapa.
        </Text>
      </View>

      <TouchableOpacity style={styles.btnBack2} onPress={() => navigation.goBack()}>
        <View style={styles.btnBack2Row}>
          <AppIcon name="arrow-left" size={13} color="slate600" />
          <Text style={styles.btnBack2Text}>Kembali ke Daftar Pemilihan</Text>
        </View>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// Bar animasi per kandidat — 🏆 intentionally kept as emoji for winner
function BarRow({ kandidat, color, isPemenang }) {
  const [widthAnim] = useState(() => new Animated.Value(0));
  const persen = kandidat.persentase ?? 0;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: persen / 100,
      duration: 900,
      delay: kandidat.peringkat * 100,
      useNativeDriver: false,
    }).start();
  }, [widthAnim, persen, kandidat.peringkat]);

  return (
    <View style={[styles.barRow, isPemenang && styles.barRowWinner]}>
      <View style={styles.barLeft}>
        <View style={styles.barHeader}>
          <Text style={styles.barNama}>{kandidat.nama}</Text>
          {isPemenang && <Text style={styles.winnerTag}>🏆 Terpilih</Text>}
        </View>
        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              { backgroundColor: color },
              {
                width: widthAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>
      <View style={styles.barRight}>
        <Text style={[styles.barPersen, { color }]}>{persen}%</Text>
        <Text style={styles.barSuara}>{kandidat.jumlah_suara} suara</Text>
      </View>
    </View>
  );
}

function StatBox({ nilai, label }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statNilai}>{nilai}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}
