/**
 * Component test — src/screens/profile/IdCardScreen.jsx
 *
 * Cakupan:
 *   - Mode template warna (background_image_url null) memakai template.colors
 *     dari response, bukan warna hardcoded
 *   - Berganti slug template (biru-klasik → teknologi → merah-energi) mengubah
 *     warna kartu sesuai response terbaru
 *   - Fallback ke DEFAULT_TEMPLATE_COLORS saat field `template` tidak ada
 *   - Mode background image tetap tidak berubah (tidak dipengaruhi template)
 */

import { render } from '@testing-library/react-native';
import React from 'react';

import { DEFAULT_TEMPLATE_COLORS } from '@services/idCardApi';

import IdCardScreen from '../IdCardScreen';

// useFocusEffect butuh NavigationContainer — di test ini kita hanya perlu
// efeknya berjalan sekali saat mount (perilaku useEffect biasa) tanpa
// bergantung pada context navigasi sungguhan.
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (effect) => {
    const React = require('react');
    React.useEffect(effect, []); // eslint-disable-line react-hooks/exhaustive-deps
  },
}));

// react-native-qrcode-svg tidak diperlukan untuk assert warna template — mock
// dengan komponen View sederhana agar tidak bergantung pada react-native-svg.
jest.mock('react-native-qrcode-svg', () => {
  const { View } = require('react-native');
  return function MockQRCode(props) {
    return <View testID="mock-qrcode" {...props} />;
  };
});

jest.mock('react-native-view-shot', () => {
  const React = require('react');
  const { View } = require('react-native');
  return React.forwardRef(function MockViewShot(props, ref) {
    return <View ref={ref} {...props} />;
  });
});

// ── Mock dependencies ──────────────────────────────────────────────────────
const mockRefetch = jest.fn();
let mockQueryResult;

jest.mock('@features/profile/hooks/useProfile', () => ({
  useIdCard: () => mockQueryResult,
}));

const baseData = {
  user: { id: 1, name: 'Haris', divisi: 'Teknologi', role: 'anggota', role_label: 'Anggota' },
  member_id: 'MCI-0001',
  avatar: null,
  foto_url: null,
  background_image_url: null,
  card_url: 'https://example.test/card',
  profile_url: 'https://example.test/profile',
};

const tekTemplate = {
  slug: 'teknologi',
  label: 'Teknologi',
  colors: {
    card_background: '#0b1120',
    border: 'rgba(56,189,248,0.5)',
    header_gradient: ['#0f172a', '#1e293b'],
    accent: '#38bdf8',
    badge_background: '#1e293b',
    badge_text: '#38bdf8',
    badge_border: 'rgba(56,189,248,0.4)',
    text_color: '#e2e8f0',
    divider: 'rgba(56,189,248,0.4)',
  },
};

const merahTemplate = {
  slug: 'merah-energi',
  label: 'Merah Energi',
  colors: {
    card_background: '#fff5f5',
    border: '#dc2626',
    header_gradient: ['#991b1b', '#ef4444'],
    accent: '#dc2626',
    badge_background: '#fee2e2',
    badge_text: '#dc2626',
    badge_border: '#fecaca',
    text_color: '#0f172a',
    divider: '#dc2626',
  },
};

function setQueryResult(data, overrides = {}) {
  mockQueryResult = {
    data,
    isLoading: false,
    isError: false,
    error: null,
    refetch: mockRefetch,
    ...overrides,
  };
}

function renderScreen() {
  return render(<IdCardScreen navigation={{ setOptions: jest.fn() }} />);
}

/** Meratakan RN style prop (array/nested array/object) jadi satu object flat. */
function flattenStyle(style) {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce((acc, s) => ({ ...acc, ...flattenStyle(s) }), {});
  }
  return style;
}

describe('IdCardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('refetch otomatis saat layar mendapat fokus, supaya template terbaru langsung tampil', () => {
    setQueryResult({ ...baseData, template: tekTemplate });
    renderScreen();

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('memakai warna dari template.colors saat tidak ada background image', () => {
    setQueryResult({ ...baseData, template: tekTemplate });
    const { getByTestId } = renderScreen();

    const cardStyle = flattenStyle(getByTestId('id-card').props.style);
    const badgeStyle = flattenStyle(getByTestId('id-card-badge').props.style);

    expect(cardStyle.backgroundColor).toBe(tekTemplate.colors.card_background);
    expect(cardStyle.borderColor).toBe(tekTemplate.colors.border);
    expect(badgeStyle.backgroundColor).toBe(tekTemplate.colors.badge_background);
    expect(badgeStyle.borderColor).toBe(tekTemplate.colors.badge_border);
  });

  it('berganti slug template mengubah warna kartu yang dirender', () => {
    setQueryResult({ ...baseData, template: tekTemplate });
    const { getByTestId, rerender } = renderScreen();
    expect(flattenStyle(getByTestId('id-card').props.style).backgroundColor).toBe(
      tekTemplate.colors.card_background
    );

    setQueryResult({ ...baseData, template: merahTemplate });
    rerender(<IdCardScreen navigation={{ setOptions: jest.fn() }} />);

    expect(flattenStyle(getByTestId('id-card').props.style).backgroundColor).toBe(
      merahTemplate.colors.card_background
    );
  });

  it('fallback ke DEFAULT_TEMPLATE_COLORS saat field template tidak ada di response', () => {
    setQueryResult({ ...baseData, template: undefined });
    const { getByTestId } = renderScreen();

    const cardStyle = flattenStyle(getByTestId('id-card').props.style);
    expect(cardStyle.backgroundColor).toBe(DEFAULT_TEMPLATE_COLORS.card_background);
    expect(cardStyle.borderColor).toBe(DEFAULT_TEMPLATE_COLORS.border);
  });

  it('mode background image tidak dipengaruhi oleh template.colors', () => {
    setQueryResult({
      ...baseData,
      background_image_url: 'https://example.test/bg.jpg',
      template: tekTemplate,
    });
    const { getByTestId } = renderScreen();

    const cardStyle = flattenStyle(getByTestId('id-card').props.style);
    expect(cardStyle.backgroundColor).not.toBe(tekTemplate.colors.card_background);
    expect(getByTestId('id-card').props.source).toEqual({
      uri: 'https://example.test/bg.jpg',
    });
  });
});
