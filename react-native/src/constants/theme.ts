import { StyleSheet } from 'react-native';

// Brand Colors
export const BRAND_COLOR = '#DF5E37';
export const BRAND_COLOR_LIGHT = '#f5e6e0';

// Color Palette (matching your Tailwind theme)
export const COLORS = {
  // Brand
  brand: BRAND_COLOR,
  brandLight: BRAND_COLOR_LIGHT,
  
  // Grays
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Status colors
  green500: '#10B981',
  green600: '#059669',
  green50: '#ECFDF5',
  
  red500: '#EF4444',
  red600: '#DC2626',
  red50: '#FEF2F2',
  
  blue500: '#3B82F6',
  blue600: '#2563EB',
  blue50: '#EFF6FF',
  
  yellow500: '#F59E0B',
  yellow50: '#FFFBEB',
  
  orange500: '#F97316',
  orange50: '#FFF7ED',
  
  // Text
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
};

// Typography
export const TYPOGRAPHY = {
  // Font sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  
  // Font weights
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  
  // Line heights
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.625,
};

// Spacing (matching Tailwind spacing scale)
export const SPACING = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
};

// Border radius
export const RADIUS = {
  none: 0,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  full: 9999,
};

// Shadows (iOS/Android compatible)
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
};

// Common styles
export const COMMON_STYLES = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING[6],
  },
  
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    ...SHADOWS.sm,
  },
  
  button: {
    backgroundColor: BRAND_COLOR,
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[6],
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.medium,
  },
  
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
    fontSize: TYPOGRAPHY.base,
    backgroundColor: COLORS.white,
  },
  
  label: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING[2],
  },
  
  errorText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.red500,
    marginTop: SPACING[1],
  },
  
  successText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.green600,
    marginTop: SPACING[1],
  },
});

// Screen dimensions
export const SCREEN = {
  padding: SPACING[6],
  paddingHorizontal: SPACING[6],
  paddingVertical: SPACING[4],
};