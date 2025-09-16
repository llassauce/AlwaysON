// Quick script to fix SPACING bracket notation in React Native files
const fs = require('fs');
const path = require('path');

// React Native screen files that need fixing
const files = [
  'react-native/src/screens/BillingScreen.tsx',
  'react-native/src/screens/SettingsScreen.tsx',
  'react-native/src/screens/EsimIncompatibleScreen.tsx',
  'react-native/src/screens/GeographyUnavailableScreen.tsx',
  'react-native/src/screens/HelpFaqScreen.tsx',
  'react-native/src/screens/ShareFeedbackScreen.tsx',
  'react-native/src/components/DeveloperPanel.tsx',
  'react-native/src/components/EmergencyModal.tsx',
  'react-native/src/components/SimMismatchModal.tsx'
];

// Fix function to replace SPACING.number with SPACING[number]
function fixSpacingPattern(content) {
  return content.replace(/SPACING\.(\d+)/g, 'SPACING[$1]');
}

console.log('🔧 Fixing SPACING bracket notation in React Native files...\n');

files.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const fixed = fixSpacingPattern(content);
      
      if (content !== fixed) {
        fs.writeFileSync(file, fixed, 'utf8');
        console.log(`✅ Fixed SPACING patterns in ${file}`);
      } else {
        console.log(`✅ No SPACING issues found in ${file}`);
      }
    } else {
      console.log(`⚠️  File not found: ${file}`);
    }
  } catch (error) {
    console.log(`❌ Error processing ${file}: ${error.message}`);
  }
});

console.log('\n🎯 SPACING bracket notation fix completed!');