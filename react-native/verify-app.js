#!/usr/bin/env node

// Verification script to ensure we're loading the correct App.tsx
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying React Native App.tsx...\n');

// Check that App.tsx exists in react-native directory
const appPath = path.join(__dirname, 'App.tsx');
if (!fs.existsSync(appPath)) {
  console.error('❌ App.tsx not found in react-native directory');
  process.exit(1);
}

// Read the App.tsx content
const appContent = fs.readFileSync(appPath, 'utf8');

// Check for React Native imports (good signs)
const goodSigns = [
  'react-native',
  '@react-navigation/native',
  'NavigationContainer',
  'StatusBar',
  'SafeAreaView'
];

// Check for web imports (bad signs)
const badSigns = [
  'lucide-react',
  '<div',
  'className=',
  'Tailwind',
  './components/ui/'
];

console.log('✅ Good signs (React Native):');
goodSigns.forEach(sign => {
  if (appContent.includes(sign)) {
    console.log(`   ✓ Found: ${sign}`);
  } else {
    console.log(`   ⚠️  Missing: ${sign}`);
  }
});

console.log('\n❌ Bad signs (Web):');
let hasWebCode = false;
badSigns.forEach(sign => {
  if (appContent.includes(sign)) {
    console.log(`   ❌ Found: ${sign}`);
    hasWebCode = true;
  } else {
    console.log(`   ✓ Not found: ${sign}`);
  }
});

if (hasWebCode) {
  console.log('\n🚨 ERROR: Web code detected in React Native App.tsx!');
  console.log('Metro is likely loading the wrong App.tsx file.');
  process.exit(1);
} else {
  console.log('\n🎉 SUCCESS: React Native App.tsx looks correct!');
}

// Check index.js
const indexPath = path.join(__dirname, 'index.js');
const indexContent = fs.readFileSync(indexPath, 'utf8');
console.log('\n📄 index.js content:');
console.log(indexContent);