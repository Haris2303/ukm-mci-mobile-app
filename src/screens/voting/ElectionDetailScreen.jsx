import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Animated,
} from 'react-native';

import { LoadingState, ErrorState } from '@shared/components';
import AppIcon from 'src/components/ui/Icon';

import { useElectionDetail, useKirimSuara } from '@features/voting/hooks/useVoting';

import { styles } from './ElectionDetailScreen.styles';

export default function ElectionDetailScreen({ route, navigation }) {
  const { id } = route.params;

  // ── UI state (lokal — bukan server state) ────────────────────────────────
  const [selected, setSelected] = useState(null); // candidate_id yang dipilih
  const [showConfirm, setShowConfirm] = useState(false);

  // Animasi modal konfirmasi
  const [scaleAnim] = useState(() => new Animated.Value(0.85));

  // ── Server state ──────────────────────────────────────────────────────────
  const { data: election, isLoading, isError, error, refetch } = useElectionDetail(id);

  // ── Mutation kirim suara ──────────────────────────────────────────────────
  // isPending menggantikan state submitting manual.
  // onError (Alert) sudah ditangani di dalam hook — tidak perlu diulang.
  const { mutate: submitVote, isPending } = useKirimSuara();

  // ── Animasi saat modal muncul ─────────────────────────────────────────────
  useEffect(() => {
    if (showConfirm) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }).start();
    } else {
      scaleAnim.setValue(0.85);
    }
  }, [showConfirm, scaleAnim]);

  // ── Pilih kandidat ────────────────────────────────────────────────────────
  const handlePilihKandidat = useCallback(
    (candidateId) => {
      if (election?.sudah_vote || election?.status !== 'aktif') return;
      setSelected(candidateId);
    },
    [election?.sudah_vote, election?.status]
  );

  // ── Kirim suara ───────────────────────────────────────────────────────────
  // Hook menangani: cache invalidation (detail + list) + Alert error.
  // Komponen menangani: tutup modal + Alert sukses + navigasi ke HasilVoting.
  const handleKirimSuara = useCallback(() => {
    if (!selected) return;
    submitVote(
      { electionId: id, candidateId: selected },
      {
        onSuccess: () => {
          setShowConfirm(false);
          Alert.alert(
            'Suara Berhasil Dicatat',
            'Terima kasih! Suara Anda telah diterima dan dirahasiakan.',
            [
              {
                text: 'Lihat Hasil',
                onPress: () => navigation.navigate('HasilVoting', { id }),
              },
            ]
          );
        },
        onError: () => {
          // Alert sudah ditampilkan oleh hook — cukup tutup modal di sini
          setShowConfirm(false);
        },
      }
    );
  }, [selected, id, submitVote, navigation]);

  // ── Guard states ──────────────────────────────────────────────────────────
  if (isLoading) return <LoadingState message="Memuat detail pemilihan..." />;
  if (isError) return <ErrorState error={error} onRetry={refetch} />;

  const isAktif = election.status === 'aktif';
  const isTie = election.is_tie;
  const sudahVote = election.sudah_vote;
  const canVote = isAktif && !sudahVote && !isTie;

  const selectedCandidate = election.kandidat?.find((c) => c.id === selected);

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={styles.header}>
          <Text style={styles.posisi}>{election.posisi}</Text>
          <Text style={styles.judul}>{election.judul}</Text>
          {election.deskripsi ? <Text style={styles.deskripsi}>{election.deskripsi}</Text> : null}
          <View style={styles.headerMeta}>
            <MetaItem iconName="clock" label={`Berakhir ${election.waktu_selesai}`} />
            <MetaItem iconName="vote-yea" label={`${election.total_suara} suara masuk`} />
          </View>
        </View>

        {/* Banner Status */}
        {sudahVote && (
          <View style={styles.bannerSudahVote}>
            <AppIcon name="check-circle" size={24} color="successText" />
            <View>
              <Text style={styles.bannerTitle}>Anda Sudah Memilih</Text>
              <Text style={styles.bannerSub}>
                {election.hasil_tersedia
                  ? 'Scroll ke bawah untuk melihat perolehan suara.'
                  : 'Hasil akan ditampilkan setelah voting ditutup.'}
              </Text>
            </View>
          </View>
        )}

        {isTie && (
          <View style={styles.bannerTie}>
            <Text style={styles.bannerTieTitle}>⚖️ Hasil Pemilihan: SERI</Text>
            {election.tie_status_label ? (
              <Text style={styles.bannerTieSub}>{election.tie_status_label}</Text>
            ) : null}
          </View>
        )}

        {!isAktif && !sudahVote && !isTie && (
          <View style={[styles.bannerSudahVote, styles.bannerDitutup]}>
            <AppIcon name="flag-checkered" size={24} color="blue700" />
            <Text style={[styles.bannerTitle, styles.iconPrimary]}>Voting Telah Ditutup</Text>
          </View>
        )}

        {/* Daftar Kandidat */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <AppIcon name={canVote ? 'vote-yea' : 'users'} size={15} color="slate800" />
            <Text style={styles.sectionTitle}>
              {canVote ? 'Pilih Kandidat Anda' : 'Daftar Kandidat'}
            </Text>
          </View>
          <Text style={styles.sectionSub}>
            {canVote ? 'Tap pada kartu kandidat untuk memilih. Satu suara tidak dapat diubah.' : ''}
          </Text>

          {election.kandidat?.map((kandidat, idx) => (
            <KandidatCard
              key={kandidat.id ?? `kandidat-${idx}`}
              kandidat={kandidat}
              isSelected={selected === kandidat.id}
              canVote={canVote}
              showHasil={election.hasil_tersedia}
              onPress={() => handlePilihKandidat(kandidat.id)}
            />
          ))}
        </View>

        {/* Tombol Lihat Hasil */}
        {election.hasil_tersedia && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.btnHasil}
              onPress={() => navigation.navigate('HasilVoting', { id })}
            >
              <AppIcon name="chart-bar" size={14} color="blue700" />
              <Text style={styles.btnHasilText}>Lihat Rekap Hasil Lengkap</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Tombol Vote (sticky bawah) */}
      {canVote && (
        <View style={styles.stickyBottom}>
          <TouchableOpacity
            style={[styles.btnVote, !selected && styles.btnVoteDisabled]}
            onPress={() => selected && setShowConfirm(true)}
            disabled={!selected}
            activeOpacity={0.9}
          >
            {selected ? (
              <View style={styles.btnVoteRow}>
                <AppIcon name="check" size={16} color="labelOnPrimary" />
                <Text style={styles.btnVoteText}>Konfirmasi Pilihan Saya</Text>
              </View>
            ) : (
              <Text style={styles.btnVoteText}>Pilih Kandidat Terlebih Dahulu</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Modal Konfirmasi */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalCard, { transform: [{ scale: scaleAnim }] }]}>
            <AppIcon name="vote-yea" size={44} color="blue600" style={{ marginBottom: 4 }} />
            <Text style={styles.modalTitle}>Konfirmasi Pilihan</Text>
            <Text style={styles.modalSub}>Anda akan memberikan suara kepada:</Text>
            <View style={styles.modalCandidateBox}>
              <Text style={styles.modalCandidateName}>{selectedCandidate?.nama}</Text>
              <Text style={styles.modalCandidateUrut}>Kandidat No. {selectedCandidate?.urut}</Text>
            </View>
            <View style={styles.modalWarningRow}>
              <AppIcon name="exclamation-triangle" size={12} color="amber500" />
              <Text style={styles.modalWarning}>
                Pilihan tidak dapat diubah setelah dikonfirmasi.
              </Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnBatal}
                onPress={() => setShowConfirm(false)}
                disabled={isPending}
              >
                <Text style={styles.btnBatalText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnKonfirmasi, isPending && { opacity: 0.7 }]}
                onPress={handleKirimSuara}
                disabled={isPending}
              >
                {isPending ? (
                  <ActivityIndicator style={styles.iconLabel} size="small" />
                ) : (
                  <Text style={styles.btnKonfirmasiText}>Ya, Konfirmasi</Text>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

// ── Komponen Kartu Kandidat ────────────────────────────────────
function KandidatCard({ kandidat, isSelected, canVote, showHasil, onPress }) {
  const [progressAnim] = useState(() => new Animated.Value(0));
  const persen = kandidat.persentase ?? 0;

  useEffect(() => {
    if (showHasil) {
      Animated.timing(progressAnim, {
        toValue: persen / 100,
        duration: 800,
        delay: kandidat.urut * 100,
        useNativeDriver: false,
      }).start();
    }
  }, [showHasil, persen, progressAnim, kandidat.urut]);

  return (
    <TouchableOpacity
      style={[
        styles.kandidatCard,
        isSelected && styles.kandidatCardSelected,
        !canVote && { opacity: 0.95 },
      ]}
      onPress={onPress}
      activeOpacity={canVote ? 0.85 : 1}
    >
      {/* Nomor urut */}
      <View style={[styles.nomorUrut, isSelected && styles.nomorUrutSelected]}>
        <Text style={[styles.nomorUrutText, isSelected && styles.iconLabel]}>{kandidat.urut}</Text>
      </View>

      <View style={styles.kandidatBody}>
        <View style={styles.kandidatHeader}>
          <Text style={styles.kandidatNama}>{kandidat.nama}</Text>
          {isSelected && <AppIcon name="check-circle" size={20} color="blue600" />}
        </View>

        {kandidat.visi ? (
          <View style={styles.visiRow}>
            <AppIcon name="lightbulb" size={11} color="amber500" />
            <Text style={styles.visiMisiText} numberOfLines={2}>
              {kandidat.visi}
            </Text>
          </View>
        ) : null}

        {kandidat.misi ? (
          <View style={styles.misiRow}>
            <AppIcon name="flag" size={11} color="blue600" />
            <Text style={styles.visiMisiText} numberOfLines={3}>
              {kandidat.misi}
            </Text>
          </View>
        ) : null}

        {/* Progress bar hasil */}
        {showHasil && (
          <View style={styles.hasilBox}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.hasilText}>
              {kandidat.jumlah_suara} suara ({persen}%)
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function MetaItem({ iconName, label }) {
  return (
    <View style={styles.metaItem}>
      <AppIcon name={iconName} size={12} color="whiteAlpha80" />
      <Text style={styles.metaLabel}>{label}</Text>
    </View>
  );
}
