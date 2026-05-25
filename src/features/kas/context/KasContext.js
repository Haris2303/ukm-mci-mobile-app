import React, { createContext, useCallback, useContext, useState } from "react";
import { getSaldoTransparansi, getTunggakan } from "../api/kasApi";

const KasContext = createContext(null);

export function KasProvider({ children }) {
  const [tunggakanCount, setTunggakanCount] = useState(0);
  const [tunggakanTotal, setTunggakanTotal] = useState(0);
  const [saldoOrganisasi, setSaldoOrganisasi] = useState(null);
  const [loadingKas, setLoadingKas] = useState(false);

  const refreshRingkasan = useCallback(async () => {
    setLoadingKas(true);
    try {
      const [tunggakan, saldo] = await Promise.all([
        getTunggakan(),
        getSaldoTransparansi(),
      ]);

      setTunggakanCount(tunggakan?.data?.jumlah_tunggakan ?? 0);
      setTunggakanTotal(tunggakan?.data?.total_nominal ?? 0);
      setSaldoOrganisasi(saldo?.data ?? null);
    } catch (err) {
      // Diam saja — error ditangani di screen masing-masing
    } finally {
      setLoadingKas(false);
    }
  }, []);

  return (
    <KasContext.Provider
      value={{
        tunggakanCount,
        tunggakanTotal,
        saldoOrganisasi,
        loadingKas,
        refreshRingkasan,
      }}
    >
      {children}
    </KasContext.Provider>
  );
}

export const useKas = () => useContext(KasContext);
