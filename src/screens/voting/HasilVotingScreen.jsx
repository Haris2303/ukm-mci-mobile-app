// src/screens/voting/HasilVotingScreen.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, RefreshControl } from 'react-native';

import { LoadingState } from '@shared/components';
import AppIcon from 'src/components/ui/Icon';

import { useHasil } from '@features/voting/hooks/useVoting';

import { styles, COLORS } from './HasilVotingScreen.styles';

export default function HasilVotingScreen({ route, navigation }) {
  const { id } = route.params;

  // ── Server state ──────────────────────────────────────────────────────────
  const [refreshing, setRefreshing] = useState(false);
  const { data: hasil, isLoading, isError, error, refetch } = useHasil(id);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

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

  const isTie = hasil.is_tie;
  const catatan = hasil.catatan;
  const pemenang = hasil.pemenang;
  const kandidat = hasil.kandidat ?? [];
  const isSelesai = hasil.election.status === 'selesai';
  const isAktif = !isSelesai && !isTie;
  // Tie sudah diselesaikan via musyawarah: pemenang di-set manual oleh admin
  const isTieResolved = isTie && !!pemenang;

  // Suara tertinggi saat ini — dipakai untuk highlight terdepan/seri aktif dan seri formal
  const maxSuara = kandidat.length > 0 ? Math.max(...kandidat.map((k) => k.jumlah_suara ?? 0)) : 0;

  // Berapa kandidat yang berbagi posisi teratas saat aktif
  const leadingCount =
    isAktif && maxSuara > 0 ? kandidat.filter((k) => (k.jumlah_suara ?? 0) === maxSuara).length : 0;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS[0]]} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>{hasil.election.posisi}</Text>
        <Text style={styles.headerTitle}>{hasil.election.judul}</Text>
        <View
          style={[
            styles.statusBadge,
            isTie ? styles.badgeTie : isSelesai ? styles.badgeSelesai : styles.badgeAktif,
          ]}
        >
          <View style={styles.statusBadgeRow}>
            {isTie ? (
              <Text style={styles.statusText}>⚖️ Seri</Text>
            ) : isSelesai ? (
              <>
                <AppIcon name="flag-checkered" size={11} color="labelOnPrimary" />
                <Text style={styles.statusText}>Pemilihan Selesai</Text>
              </>
            ) : (
              <>
                <AppIcon name="circle" size={10} color="green400" />
                <Text style={styles.statusText}>Sedang Berlangsung</Text>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Total Suara */}
      <View style={styles.totalBox}>
        <Text style={styles.totalAngka}>{hasil.total_suara}</Text>
        <Text style={styles.totalLabel}>Total Suara Sah</Text>
      </View>

      {/* Pemenang: normal selesai ATAU tie yang sudah resolved via musyawarah — 👑 intentionally kept as emoji */}
      {(isSelesai || isTieResolved) && pemenang && (
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

      {/* Banner voting masih berlangsung */}
      {!isSelesai && !isTie && (
        <View style={styles.bannerAktif}>
          <AppIcon name="clock" size={18} color="blue700" />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerAktifTitle}>Pemilihan Masih Berlangsung</Text>
            <Text style={styles.bannerAktifSub}>
              Angka di bawah adalah perolehan sementara. Pemenang baru ditetapkan setelah voting
              ditutup.
            </Text>
          </View>
        </View>
      )}

      {/* Banner hasil sementara (hanya saat tie belum ada resolusi) */}
      {isTie && !pemenang && (
        <View style={styles.bannerTie}>
          <Text style={styles.bannerTieTitle}>⚠️ Hasil Sementara</Text>
          <Text style={styles.bannerTieSub}>
            Pemilihan ini berakhir seri. Hasil di bawah bersifat sementara hingga ada keputusan
            akhir dari Presidium.
          </Text>
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
            isPemenang={(isSelesai || isTieResolved) && !!pemenang && k.id === pemenang.id}
            isTiedTop={isTie && !pemenang && (k.jumlah_suara ?? 0) === maxSuara && maxSuara > 0}
            isLeading={isAktif && leadingCount === 1 && (k.jumlah_suara ?? 0) === maxSuara}
            isAktifSeri={isAktif && leadingCount > 1 && (k.jumlah_suara ?? 0) === maxSuara}
          />
        ))}
      </View>

      {/* Catatan dari admin (tie, musyawarah, atau keterangan lainnya) */}
      {catatan ? (
        <View style={styles.catatanBox}>
          <AppIcon name="info-circle" size={16} color="amber500" />
          <Text style={styles.catatanText}>{catatan}</Text>
        </View>
      ) : null}

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
function BarRow({ kandidat, color, isPemenang, isTiedTop, isLeading, isAktifSeri }) {
  const [widthAnim] = useState(() => new Animated.Value(0));
  const persen = kandidat.persentase ?? 0;

  const rowStyle =
    isPemenang || isTiedTop || isAktifSeri
      ? styles.barRowWinner
      : isLeading
        ? styles.barRowLeading
        : null;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: persen / 100,
      duration: 900,
      delay: kandidat.peringkat * 100,
      useNativeDriver: false,
    }).start();
  }, [widthAnim, persen, kandidat.peringkat]);

  return (
    <View style={[styles.barRow, rowStyle]}>
      <View style={styles.barLeft}>
        <View style={styles.barHeader}>
          <Text style={styles.barNama}>{kandidat.nama}</Text>
          {isPemenang && <Text style={styles.winnerTag}>🏆 Terpilih</Text>}
          {(isTiedTop || isAktifSeri) && <Text style={styles.tieTag}>⚖️ Seri</Text>}
          {isLeading && <Text style={styles.leadingTag}>Terdepan</Text>}
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
