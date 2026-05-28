// src/screens/ScanScreen.jsx
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';

import AppIcon from 'src/components/ui/Icon';

import { useCatatPresensi } from '@features/presensi/hooks/usePresensi';

import { styles } from './ScanScreen.styles';

// Status tampilan layar — SCANNING dihapus, digantikan isPending dari mutation
const STATUS = {
  IDLE: 'idle', // siap scan
  SUCCESS: 'success', // berhasil
  ERROR: 'error', // gagal
};

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [status, setStatus] = useState(STATUS.IDLE);
  const [message, setMessage] = useState('');
  const [detail, setDetail] = useState('');

  // ── Mutation ──────────────────────────────────────────────────────────────
  // isPending menggantikan STATUS.SCANNING untuk menampilkan processing overlay.
  // onSuccess/onError ditangani di component karena butuh setState lokal.
  const { mutate: submitPresensi, isPending } = useCatatPresensi();

  // Animasi pulse untuk viewfinder
  const [pulseAnim] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (status === STATUS.IDLE) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [status, pulseAnim]);

  // ── Handler: QR berhasil di-scan ─────────────────────────────────────────
  const handleBarCodeScanned = ({ data: token }) => {
    submitPresensi(token, {
      onSuccess: (result) => {
        setMessage(result.pesan);
        setDetail(result.data ? `📅 ${result.data.agenda}\n🕐 ${result.data.jam_hadir}` : '');
        setStatus(STATUS.SUCCESS);
      },
      onError: (error) => {
        setMessage(error.message);
        setStatus(STATUS.ERROR);
      },
    });
  };

  const resetScanner = () => {
    setStatus(STATUS.IDLE);
    setMessage('');
    setDetail('');
  };

  // ── Render: Izin Kamera Belum Diberikan ──────────────────────────────────
  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" style={styles.iconPrimary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <AppIcon name="camera" size={56} color="slate400" style={styles.permissionIcon} />
        <Text style={styles.permissionTitle}>Izin Kamera Dibutuhkan</Text>
        <Text style={styles.permissionDesc}>
          Aplikasi perlu mengakses kamera Anda untuk scan QR Code presensi.
        </Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={requestPermission}>
          <Text style={styles.btnPrimaryText}>Izinkan Akses Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Render: Hasil Scan (Sukses / Gagal) ──────────────────────────────────
  if (status === STATUS.SUCCESS || status === STATUS.ERROR) {
    const isSuccess = status === STATUS.SUCCESS;
    return (
      <View style={styles.resultContainer}>
        <View style={[styles.resultCard, isSuccess ? styles.cardSuccess : styles.cardError]}>
          <AppIcon
            name={isSuccess ? 'check-circle' : 'times-circle'}
            size={56}
            color={isSuccess ? 'successIconBg' : 'errorAccent'}
            style={{ marginBottom: 8 }}
            solid
          />
          <Text style={[styles.resultTitle, isSuccess ? styles.textSuccess : styles.textError]}>
            {isSuccess ? 'Presensi Tercatat!' : 'Presensi Gagal'}
          </Text>
          <Text style={styles.resultMessage}>{message}</Text>
          {!!detail && (
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>{detail}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={[styles.btnPrimary, styles.btnPrimaryRow]} onPress={resetScanner}>
          <AppIcon name={isSuccess ? 'check' : 'undo'} size={15} color="labelOnPrimary" />
          <Text style={styles.btnPrimaryText}>{isSuccess ? 'Selesai' : 'Scan Ulang'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Render: Kamera Scanner ────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Judul */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Scan QR Code</Text>
        <Text style={styles.topBarSub}>Arahkan kamera ke QR Code presensi</Text>
      </View>

      {/* Kamera */}
      <View style={styles.cameraWrapper}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={status === STATUS.IDLE && !isPending ? handleBarCodeScanned : undefined}
        />

        {/* Overlay gelap di pinggir */}
        <View style={styles.overlay}>
          {/* Baris atas */}
          <View style={styles.overlayRow} />
          {/* Baris tengah: gelap | viewfinder | gelap */}
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            {/* Kotak viewfinder */}
            <Animated.View style={[styles.viewfinder, { transform: [{ scale: pulseAnim }] }]}>
              {/* Sudut-sudut viewfinder */}
              <Corner position="topLeft" />
              <Corner position="topRight" />
              <Corner position="bottomLeft" />
              <Corner position="bottomRight" />
            </Animated.View>
            <View style={styles.overlaySide} />
          </View>
          {/* Baris bawah */}
          <View style={styles.overlayRow} />
        </View>

        {/* Processing overlay saat mutation isPending */}
        {isPending && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" style={styles.iconLabel} />
            <Text style={styles.processingText}>Mencatat kehadiran...</Text>
          </View>
        )}
      </View>

      {/* Instruksi bawah */}
      <View style={styles.bottomBar}>
        <Text style={styles.bottomText}>Posisikan QR Code di dalam kotak di atas</Text>
        <View style={styles.tipRow}>
          <AppIcon name="lightbulb" size={12} color="whiteAlpha70" />
          <Text style={styles.tipText}>Pastikan cahaya cukup & tangan stabil</Text>
        </View>
      </View>
    </View>
  );
}

// Komponen sudut viewfinder
function Corner({ position }) {
  const isTop = position.startsWith('top');
  const isLeft = position.endsWith('Left');
  return (
    <View
      style={[
        styles.corner,
        isTop ? { top: -2 } : { bottom: -2 },
        isLeft ? { left: -2 } : { right: -2 },
        {
          borderTopWidth: isTop ? 4 : 0,
          borderBottomWidth: isTop ? 0 : 4,
          borderLeftWidth: isLeft ? 4 : 0,
          borderRightWidth: isLeft ? 0 : 4,
        },
      ]}
    />
  );
}
