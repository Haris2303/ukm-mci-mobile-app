import { FontAwesome5 } from '@expo/vector-icons';
import React, { memo } from 'react';
import { View, Text } from 'react-native';

import {
  BRAND_COLOR,
  CATEGORY_COLORS,
  DANGER_STRONG_COLOR,
  styles,
  SUCCESS_TEXT_COLOR,
} from '../styles/BreakdownRow.styles';

function BreakdownRow({ category, iconName, label, value, isPositive = true, isTotal = false }) {
  const color = CATEGORY_COLORS[category] ?? BRAND_COLOR;

  return (
    <View style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
        <FontAwesome5 name={iconName} size={16} color={color} solid />
      </View>
      <View style={styles.labelBox}>
        <Text style={[styles.label, isTotal && styles.labelTotal]}>{label}</Text>
        {!isTotal && (
          <Text style={styles.sign}>{isPositive ? '+ Pemasukan' : '− Pengeluaran'}</Text>
        )}
      </View>
      <Text
        style={[
          styles.value,
          { color: isTotal ? BRAND_COLOR : isPositive ? SUCCESS_TEXT_COLOR : DANGER_STRONG_COLOR },
          isTotal && styles.valueTotal,
        ]}
      >
        {!isTotal && (isPositive ? '+ ' : '− ')}
        {value}
      </Text>
    </View>
  );
}

export default memo(BreakdownRow);
