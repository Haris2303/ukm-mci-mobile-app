import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';

import { styles } from '../styles/EmptyKas.styles';

export default function EmptyKas({ iconName, title, desc, bgColor, accentColor }) {
  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderColor: accentColor + '40' }]}>
      <View style={[styles.iconBox, { backgroundColor: accentColor + '20' }]}>
        <FontAwesome5 name={iconName} size={32} color={accentColor} solid />
      </View>
      <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
    </View>
  );
}
