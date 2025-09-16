import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, BRAND_COLOR, SHADOWS } from '../constants/theme';

interface OnboardingScreenProps {
  navigation: any;
  route: any;
}

export function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const handleNext = () => {
    navigation.navigate('HowItWorks');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with brand color */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>AlwaysON</Text>
          </View>
        </View>

        {/* Main content */}
        <View style={styles.content}>
          {/* Hero section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>
              Never lose connection again
            </Text>
            <Text style={styles.heroSubtitle}>
              Automatic backup internet through eSIM when your primary connection fails
            </Text>
          </View>

          {/* Features list */}
          <View style={styles.featuresContainer}>
            <FeatureItem
              icon="phone-portrait-outline"
              title="Automatic eSIM Backup"
              description="Seamlessly switch to backup network when needed"
            />
            <FeatureItem
              icon="flash-outline"
              title="Instant Activation"
              description="Get back online in seconds, not minutes"
            />
            <FeatureItem
              icon="shield-checkmark-outline"
              title="Always Protected"
              description="24/7 monitoring ensures you're never offline"
            />
            <FeatureItem
              icon="card-outline"
              title="Simple Pricing"
              description="$10/month with first month free"
            />
          </View>

          {/* Promotional badge */}
          <View style={styles.promoContainer}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoText}>🎉 First Month FREE</Text>
            </View>
          </View>
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
          
          <Text style={styles.disclaimer}>
            Available in USA, Canada, EU, Australia, and UK
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIconContainer}>
        <Ionicons name={icon as any} size={24} color={BRAND_COLOR} />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  
  scrollContent: {
    flexGrow: 1,
  },
  
  header: {
    backgroundColor: BRAND_COLOR,
    paddingTop: SPACING[8],
    paddingBottom: SPACING[8],
    paddingHorizontal: SPACING[6],
    borderBottomLeftRadius: SPACING[6],
    borderBottomRightRadius: SPACING[6],
  },
  
  logoContainer: {
    alignItems: 'center',
  },
  
  logoText: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: SPACING[6],
    paddingTop: SPACING[8],
  },
  
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING[8],
  },
  
  heroTitle: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING[4],
    lineHeight: TYPOGRAPHY['2xl'] * 1.3,
  },
  
  heroSubtitle: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lg * 1.4,
  },
  
  featuresContainer: {
    marginBottom: SPACING[8],
  },
  
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING[6],
    paddingHorizontal: SPACING[2],
  },
  
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${BRAND_COLOR}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING[4],
  },
  
  featureContent: {
    flex: 1,
    paddingTop: SPACING[2],
  },
  
  featureTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
  },
  
  featureDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.sm * 1.4,
  },
  
  promoContainer: {
    alignItems: 'center',
    marginBottom: SPACING[8],
  },
  
  promoBadge: {
    backgroundColor: BRAND_COLOR,
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[6],
    borderRadius: RADIUS.full,
    ...SHADOWS.md,
  },
  
  promoText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.white,
  },
  
  bottomSection: {
    paddingHorizontal: SPACING[6],
    paddingBottom: SPACING[8],
  },
  
  primaryButton: {
    backgroundColor: BRAND_COLOR,
    paddingVertical: SPACING[4],
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING[4],
    ...SHADOWS.sm,
  },
  
  primaryButtonText: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.white,
  },
  
  disclaimer: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.sm * 1.3,
  },
});