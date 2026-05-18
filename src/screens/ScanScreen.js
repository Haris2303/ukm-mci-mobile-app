// src/screens/ScanScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { FontAwesome5 } from "@expo/vector-icons";
import { catatPresensi } from "../services/api";

// Status tampilan layar
const STATUS = {
  IDLE: "idle", // siap scan
  SCANNING: "scanning", // sedang memproses
  SUCCESS: "success", // berhasil
  ERROR: "error", // gagal
};

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [status, setStatus] = useState(STATUS.IDLE);
  const [message, setMessage] = useState("");
  const [detail, setDetail] = useState("");

  // Animasi pulse untuk viewfinder
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === STATUS.IDLE) {
      // Animasi berputar saat siap scan
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
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [status]);

  // ── Handler: QR berhasil di-scan ────────────────────────────
  const handleBarCodeScanned = async ({ data: token }) => {
    if (status !== STATUS.IDLE) return; // Cegah scan ganda

    setStatus(STATUS.SCANNING);

    try {
      const result = await catatPresensi(token);
      setMessage(result.pesan);
      setDetail(
        result.data
          ? `📅 ${result.data.agenda}\n🕐 ${result.data.jam_hadir}`
          : "",
      );
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      setMessage(error.message);
      setStatus(STATUS.ERROR);
    }
  };

  const resetScanner = () => {
    setStatus(STATUS.IDLE);
    setMessage("");
    setDetail("");
  };

  // ── Render: Izin Kamera Belum Diberikan ─────────────────────
  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a56db" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <FontAwesome5 name="camera" size={56} color="#94a3b8" style={styles.permissionIcon} />
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

  // ── Render: Hasil Scan (Sukses / Gagal) ──────────────────────
  if (status === STATUS.SUCCESS || status === STATUS.ERROR) {
    const isSuccess = status === STATUS.SUCCESS;
    return (
      <View style={styles.resultContainer}>
        <View
          style={[
            styles.resultCard,
            isSuccess ? styles.cardSuccess : styles.cardError,
          ]}
        >
          <FontAwesome5
            name={isSuccess ? "check-circle" : "times-circle"}
            size={56}
            color={isSuccess ? "#22c55e" : "#ef4444"}
            style={{ marginBottom: 8 }}
            solid
          />
          <Text
            style={[
              styles.resultTitle,
              isSuccess ? styles.textSuccess : styles.textError,
            ]}
          >
            {isSuccess ? "Presensi Tercatat!" : "Presensi Gagal"}
          </Text>
          <Text style={styles.resultMessage}>{message}</Text>
          {!!detail && (
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>{detail}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={[styles.btnPrimary, styles.btnPrimaryRow]} onPress={resetScanner}>
          <FontAwesome5
            name={isSuccess ? "check" : "undo"}
            size={15}
            color="#fff"
          />
          <Text style={styles.btnPrimaryText}>
            {isSuccess ? "Selesai" : "Scan Ulang"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Render: Kamera Scanner ───────────────────────────────────
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
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={
            status === STATUS.IDLE ? handleBarCodeScanned : undefined
          }
        />

        {/* Overlay gelap di pinggir */}
        <View style={styles.overlay}>
          {/* Baris atas */}
          <View style={styles.overlayRow} />
          {/* Baris tengah: gelap | viewfinder | gelap */}
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            {/* Kotak viewfinder */}
            <Animated.View
              style={[styles.viewfinder, { transform: [{ scale: pulseAnim }] }]}
            >
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

        {/* Loading overlay saat processing */}
        {status === STATUS.SCANNING && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.processingText}>Mencatat kehadiran...</Text>
          </View>
        )}
      </View>

      {/* Instruksi bawah */}
      <View style={styles.bottomBar}>
        <Text style={styles.bottomText}>
          Posisikan QR Code di dalam kotak di atas
        </Text>
        <View style={styles.tipRow}>
          <FontAwesome5 name="lightbulb" size={12} color="rgba(255,255,255,0.7)" solid />
          <Text style={styles.tipText}>Pastikan cahaya cukup & tangan stabil</Text>
        </View>
      </View>
    </View>
  );
}

// Komponen sudut viewfinder
function Corner({ position }) {
  const isTop = position.startsWith("top");
  const isLeft = position.endsWith("Left");
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

const VIEWFINDER_SIZE = 260;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    padding: 32,
  },

  // Top bar
  topBar: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: "#000",
    alignItems: "center",
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  topBarSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
  },

  // Kamera
  cameraWrapper: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
  },
  overlayRow: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  overlayMiddle: {
    flexDirection: "row",
    height: VIEWFINDER_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  // Viewfinder
  viewfinder: {
    width: VIEWFINDER_SIZE,
    height: VIEWFINDER_SIZE,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderColor: "#1a56db",
    borderRadius: 3,
  },

  // Processing
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  processingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Bottom bar
  bottomBar: {
    backgroundColor: "#000",
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 8,
  },
  bottomText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    textAlign: "center",
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  btnPrimaryRow: { flexDirection: "row", gap: 10 },
  tipText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },

  // Hasil scan
  resultContainer: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    padding: 28,
    gap: 20,
  },
  resultCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    gap: 10,
  },
  cardSuccess: {
    backgroundColor: "#f0fdf4",
    borderWidth: 2,
    borderColor: "#86efac",
  },
  cardError: {
    backgroundColor: "#fef2f2",
    borderWidth: 2,
    borderColor: "#fca5a5",
  },
  resultIcon: { fontSize: 56, marginBottom: 8 },
  resultTitle: { fontSize: 22, fontWeight: "800" },
  textSuccess: { color: "#15803d" },
  textError: { color: "#dc2626" },
  resultMessage: {
    fontSize: 15,
    color: "#475569",
    textAlign: "center",
    lineHeight: 24,
  },
  detailBox: {
    marginTop: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    padding: 14,
    width: "100%",
  },
  detailText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 24,
    textAlign: "center",
  },

  // Buttons
  btnPrimary: {
    backgroundColor: "#1a56db",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#1a56db",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // Izin kamera
  permissionIcon: { marginBottom: 20 },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 10,
    textAlign: "center",
  },
  permissionDesc: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
});
