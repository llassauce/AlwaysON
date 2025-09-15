// Quick script to fix all SPACING bracket notation issues in React Native files
const fs = require('fs');
const path = require('path');

const files = [
  '/react-native/src/screens/SubscriptionScreen.tsx',
  '/react-native/src/screens/DashboardScreen.tsx',
  '/react-native/src/screens/BillingScreen.tsx',
  '/react-native/src/screens/SettingsScreen.tsx',
  '/react-native/src/screens/GeographyUnavailableScreen.tsx',
  '/react-native/src/screens/EsimIncompatibleScreen.tsx',
  '/react-native/src/screens/HelpFaqScreen.tsx',
  '/react-native/src/screens/ShareFeedbackScreen.tsx'
];

// Fix SPACING.number to SPACING[number] pattern
const fixSpacingPattern = (content) => {
  return content.replace(/SPACING\.(\d+)/g, 'SPACING[$1]');
};

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const fixed = fixSpacingPattern(content);
    if (content !== fixed) {
      fs.writeFileSync(file, fixed, 'utf8');
      console.log(`Fixed SPACING patterns in ${file}`);
    } else {
      console.log(`No SPACING issues found in ${file}`);
    }
  } catch (error) {
    console.log(`Could not process ${file}: ${error.message}`);
  }
});

console.log('SPACING bracket notation fix completed!');