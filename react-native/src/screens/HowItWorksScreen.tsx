import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, BRAND_COLOR, SHADOWS } from '../constants/theme';

interface HowItWorksScreenProps {
  navigation: any;
  route: any;
}

export function HowItWorksScreen({ navigation, route }: HowItWorksScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { onGeographyCheck } = route.params || {};

  const handleNext = async () => {
    setIsLoading(true);
    
    try {
      if (onGeographyCheck) {
        const result = await onGeographyCheck();
        
        if (!result.countrySupported) {
          Alert.alert(
            'Service Unavailable',
            `AlwaysON is not yet available in ${result.country}. We're working to expand our coverage!`,
            [{ text: 'OK' }]
          );
          setIsLoading(false);
          return;
        }
        
        if (!result.esimCompatible) {
          Alert.alert(
            'Device Not Compatible',
            'Your device does not support eSIM functionality. AlwaysON requires eSIM support to work.',
            [{ text: 'OK' }]
          );
          setIsLoading(false);
          return;
        }
      }
      
      // All checks passed, proceed to subscription
      navigation.navigate('Subscription');
    } catch (error) {
      console.error('Geography check failed:', error);
      Alert.alert(
        'Connection Error',
        'Unable to verify device compatibility. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>How AlwaysON Works</Text>
          <Text style={styles.subtitle}>
            Your backup internet solution in 3 simple steps
          </Text>

          {/* Steps */}
          <View style={styles.stepsContainer}>
            <StepItem
              number={1}
              icon="download-outline"
              title="Automatic Setup"
              description="We install a backup eSIM profile on your device automatically"
            />
            
            <StepItem
              number={2}
              icon="eye-outline"
              title="Smart Monitoring"
              description="AlwaysON continuously monitors your primary connection"
            />
            
            <StepItem
              number={3}
              icon="swap-horizontal-outline"
              title="Instant Switch"
              description="When your primary connection fails, we automatically switch to backup"
            />
          </View>

          {/* Features highlight */}
          <View style={styles.highlightContainer}>
            <View style={styles.highlightCard}>
              <Ionicons name="shield-checkmark" size={32} color={BRAND_COLOR} />
              <Text style={styles.highlightTitle}>Always Connected</Text>
              <Text style={styles.highlightDescription}>
                No more dropped video calls, failed payments, or lost productivity
              </Text>
            </View>
          </View>

          {/* Compatibility check info */}
          <View style={styles.infoContainer}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.blue500} />
              <Text style={styles.infoText}>
                We'll check your device compatibility and service availability in your area
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom buttons */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleNext} disabled={isLoading}>
          {isLoading ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator color={COLORS.white} style={styles.spinner} />
              <Text style={styles.primaryButtonText}>Checking compatibility...</Text>
            </View>
          ) : (
            <Text style={styles.primaryButtonText}>Continue Setup</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface StepItemProps {
  number: number;
  icon: string;
  title: string;
  description: string;
}

function StepItem({ number, icon, title, description }: StepItemProps) {
  return (
    <View style={styles.stepItem}>
      <View style={styles.stepHeader}>
        <View style={styles.stepNumberContainer}>
          <Text style={styles.stepNumber}>{number}</Text>
        </View>
        <View style={styles.stepIconContainer}>
          <Ionicons name={icon as any} size={24} color={BRAND_COLOR} />
        </View>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDescription}>{description}</Text>
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
  
  content: {
    flex: 1,
    paddingHorizontal: SPACING[6],
    paddingTop: SPACING[6],
  },
  
  title: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING[3],
  },
  
  subtitle: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING[8],
    lineHeight: TYPOGRAPHY.base * 1.4,
  },
  
  stepsContainer: {
    marginBottom: SPACING[8],
  },
  
  stepItem: {
    marginBottom: SPACING[6],
  },
  
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[3],
  },
  
  stepNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BRAND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING[3],
  },
  
  stepNumber: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.white,
  },
  
  stepIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${BRAND_COLOR}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  stepContent: {
    marginLeft: SPACING[8],
  },
  
  stepTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING[2],
  },
  
  stepDescription: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.base * 1.4,
  },
  
  highlightContainer: {
    marginBottom: SPACING[8],
  },
  
  highlightCard: {
    backgroundColor: `${BRAND_COLOR}08`,
    borderRadius: RADIUS.lg,
    padding: SPACING[6],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${BRAND_COLOR}20`,
  },
  
  highlightTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    marginTop: SPACING[3],
    marginBottom: SPACING[2],
  },
  
  highlightDescription: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.base * 1.4,
  },
  
  infoContainer: {
    marginBottom: SPACING[6],
  },
  
  infoCard: {
    backgroundColor: COLORS.blue50,
    borderRadius: RADIUS.md,
    padding: SPACING[4],
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.blue500 + '20',
  },
  
  infoText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.blue500,
    flex: 1,
    marginLeft: SPACING[3],
    lineHeight: TYPOGRAPHY.sm * 1.4,
  },
  
  bottomSection: {
    paddingHorizontal: SPACING[6],
    paddingBottom: SPACING[6],
    paddingTop: SPACING[4],
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  
  primaryButton: {
    backgroundColor: BRAND_COLOR,
    paddingVertical: SPACING[4],
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING[3],
    ...SHADOWS.sm,
  },
  
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  spinner: {
    marginRight: SPACING[2],
  },
  
  primaryButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.white,
  },
  
  secondaryButton: {
    paddingVertical: SPACING[3],
    alignItems: 'center',
  },
  
  secondaryButtonText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
  },
});