#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to fix
const filesToFix = [
  'src/screens/EsimIncompatibleScreen.tsx',
  'src/screens/GeographyUnavailableScreen.tsx', 
  'src/screens/HelpFaqScreen.tsx',
  'src/screens/HowItWorksScreen.tsx',
  'src/screens/OnboardingScreen.tsx',
  'src/components/DeveloperPanel.tsx',
  'src/components/EmergencyModal.tsx',
  'src/components/SimMismatchModal.tsx'
];

console.log('🔧 Fixing SPACING syntax in React Native files...\n');

filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Count how many SPACING. instances before fix
      const beforeCount = (content.match(/SPACING\.\d+/g) || []).length;
      
      if (beforeCount === 0) {
        console.log(`✅ ${filePath} - Already fixed (no SPACING.number found)`);
        return;
      }
      
      // Replace SPACING.number with SPACING[number]
      const updatedContent = content.replace(/SPACING\.(\d+)/g, 'SPACING[$1]');
      
      // Count after fix to verify
      const afterCount = (updatedContent.match(/SPACING\.\d+/g) || []).length;
      
      fs.writeFileSync(fullPath, updatedContent, 'utf8');
      
      console.log(`🔧 ${filePath} - Fixed ${beforeCount} SPACING issues`);
      
      if (afterCount > 0) {
        console.log(`⚠️  Warning: ${afterCount} SPACING.number instances still remain`);
      }
    } else {
      console.log(`❌ ${filePath} - File not found`);
    }
  } catch (error) {
    console.log(`❌ ${filePath} - Error: ${error.message}`);
  }
});

console.log('\n✅ SPACING syntax fix completed for all React Native files!');
console.log('\n🎯 All files should now use SPACING[number] bracket notation.');