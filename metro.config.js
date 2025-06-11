const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add this to handle SVG files in web
config.resolver.assetExts.push('svg');
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

module.exports = config; 