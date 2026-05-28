import { FontAwesome5 } from '@expo/vector-icons';

import { colors } from '@theme/colors';

export default function AppIcon({ name, size = 14, color = 'slate400', solid = true }) {
  return <FontAwesome5 name={name} size={size} color={colors[color]} solid={solid} />;
}
