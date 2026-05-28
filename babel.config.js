module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@core': './src/core',
            '@shared': './src/shared',
            '@features': './src/features',
            '@navigation': './src/navigation',
            '@screens': './src/screens',
            '@services': './src/services',
            '@config': './src/config',
            '@theme': './src/theme',
            '@components': './src/components',
            '@context': './src/context',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};
