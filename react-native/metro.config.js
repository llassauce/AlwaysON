const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Only watch the react-native directory
config.watchFolders = [__dirname];

// Ensure we resolve from current directory first
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// Block web-related files to prevent conflicts
config.resolver.blockList = [
  // Block parent directory's web files
  /^(?!.*\/react-native\/).*\/App\.tsx$/,
  /^(?!.*\/react-native\/).*\/App-WEB-BACKUP\.tsx$/,
  /^(?!.*\/react-native\/).*\/components\/ui\/.*/,
  /^(?!.*\/react-native\/).*\/styles\/.*/,
  /^(?!.*\/react-native\/).*\/src\/main\.tsx$/,
  /^(?!.*\/react-native\/).*\/vite\.config\.ts$/,
];

// Ensure proper platform resolution
config.resolver.platforms = ['ios', 'android', 'native'];

module.exports = config;