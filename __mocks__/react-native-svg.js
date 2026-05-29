const React = require('react');
const { View, Text } = require('react-native');

const stub = (name) =>
  function MockSvg({ children }) {
    return React.createElement(View, { testID: name }, children);
  };

module.exports = {
  __esModule: true,
  default: stub('Svg'),
  Svg: stub('Svg'),
  Defs: stub('Defs'),
  LinearGradient: stub('LinearGradient'),
  Stop: () => null,
  Text: ({ children }) => React.createElement(Text, null, children),
  Circle: stub('Circle'),
  Path: stub('Path'),
  Rect: stub('Rect'),
};
