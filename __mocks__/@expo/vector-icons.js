const React = require('react');
const { Text } = require('react-native');

const createIconSet = () =>
  function MockIcon({ name, size, color, style, solid, ...rest }) {
    return React.createElement(Text, { style, ...rest }, name);
  };

module.exports = {
  FontAwesome5: createIconSet(),
  FontAwesome: createIconSet(),
  Ionicons: createIconSet(),
  MaterialIcons: createIconSet(),
  createIconSet,
};
