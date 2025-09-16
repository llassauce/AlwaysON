import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, BRAND_COLOR, SHADOWS } from '../constants/theme';

interface GeographyUnavailableScreenProps {
  navigation: any;
  route: any;
}

export function GeographyUnavailableScreen({ navigation, route }: GeographyUnavailableScreenProps) {
  const { userCountry = 'Unknown', onBack } = route.params || {};
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWaitlistSignup = async () => {
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address to join the waitlist.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to add user to waitlist
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'You\'re on the waitlist!',
        'Thanks for your interest! We\'ll notify you as soon as AlwaysON becomes available in your area.',
        [{ text: 'OK', onPress: handleBack }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add you to the waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🌍</Text>
        </View>

        {/* Title and Message */}
        <Text style={styles.title}>Service Not Available</Text>
        <Text style={styles.message}>
          AlwaysON is not yet available in <Text style={styles.countryText}>{userCountry}</Text>. 
          We're working hard to expand our coverage to your region.
        </Text>

        {/* Expansion Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="rocket" size={20} color={BRAND_COLOR} />
            <Text style={styles.infoTitle}>Coming Soon</Text>
          </View>
          <Text style={styles.infoDescription}>
            We're actively expanding our network coverage and plan to launch in your area soon. 
            Join our waitlist to be the first to know when AlwaysON becomes available.
          </Text>
        </View>

        {/* Current Coverage */}
        <View style={styles.coverageCard}>
          <Text style={styles.coverageTitle}>Currently Available In:</Text>
          <View style={styles.coverageList}>
            <View style={styles.coverageItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.green600} />
              <Text style={styles.coverageText}>United States</Text>
            </View>
            <View style={styles.coverageItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.green600} />
              <Text style={styles.coverageText}>Canada</Text>
            </View>
            <View style={styles.coverageItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.green600} />
              <Text style={styles.coverageText}>European Union</Text>
            </View>
            <View style={styles.coverageItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.green600} />
              <Text style={styles.coverageText}>United Kingdom</Text>
            </View>
            <View style={styles.coverageItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.green600} />
              <Text style={styles.coverageText}>Australia</Text>
            </View>
          </View>
        </View>

        {/* Waitlist Form */}
        <View style={styles.waitlistCard}>
          <Text style={styles.waitlistTitle}>Join the Waitlist</Text>
          <Text style={styles.waitlistDescription}>
            Get notified when AlwaysON launches in {userCountry}
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity 
            style={[styles.waitlistButton, isSubmitting && styles.disabledButton]}
            onPress={handleWaitlistSignup}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <View style={styles.buttonContent}>
                <Ionicons name="hourglass" size={16} color={COLORS.white} />
                <Text style={styles.waitlistButtonText}>Joining...</Text>
              </View>
            ) : (
              <Text style={styles.waitlistButtonText}>Join Waitlist</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Benefits Preview */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>What you'll get with AlwaysON:</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="shield-checkmark" size={16} color={COLORS.blue600} />
              <Text style={styles.benefitText}>Automatic backup internet through eSIM</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="flash" size={16} color={COLORS.blue600} />
              <Text style={styles.benefitText}>Instant activation when primary connection fails</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="card" size={16} color={COLORS.blue600} />
              <Text style={styles.benefitText}>Simple $10/month pricing with first month free</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  
  contentContainer: {
    flexGrow: 1,
  },
  
  content: {
    flex: 1,
    padding: SPACING[6],
  },
  
  header: {
    marginBottom: SPACING[8],
  },
  
  backButton: {
    alignSelf: 'flex-start',
    padding: SPACING[1],
  },
  
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING[6],
  },
  
  icon: {
    fontSize: 64,
  },
  
  title: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING[4],
  },
  
  message: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.base * 1.5,
    marginBottom: SPACING[6],
  },
  
  countryText: {
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
  },
  
  infoCard: {
    backgroundColor: BRAND_COLOR + '10',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: BRAND_COLOR + '30',
    padding: SPACING[4],
    marginBottom: SPACING[6],
  },
  
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[2],
  },
  
  infoTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    marginLeft: SPACING[2],
  },
  
  infoDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.sm * 1.4,
  },
  
  coverageCard: {
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    marginBottom: SPACING[6],
  },
  
  coverageTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING[3],
  },
  
  coverageList: {
    gap: SPACING[2],
  },
  
  coverageItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  coverageText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textPrimary,
    marginLeft: SPACING[2],
  },
  
  waitlistCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    padding: SPACING[6],
    marginBottom: SPACING[6],
    ...SHADOWS.sm,
  },
  
  waitlistTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING[2],
  },
  
  waitlistDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING[4],
  },
  
  inputContainer: {
    marginBottom: SPACING[4],
  },
  
  inputLabel: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING[2],
  },
  
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
    fontSize: TYPOGRAPHY.base,
    backgroundColor: COLORS.white,
  },
  
  waitlistButton: {
    backgroundColor: BRAND_COLOR,
    paddingVertical: SPACING[4],
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  
  disabledButton: {
    opacity: 0.7,
  },
  
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING[2],
  },
  
  waitlistButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.white,
  },
  
  benefitsCard: {
    backgroundColor: COLORS.blue50,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.blue200,
    padding: SPACING[4],
  },
  
  benefitsTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.blue900,
    marginBottom: SPACING[3],
  },
  
  benefitsList: {
    gap: SPACING[3],
  },
  
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  benefitText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.blue800,
    marginLeft: SPACING[2],
    flex: 1,
    lineHeight: TYPOGRAPHY.sm * 1.4,
  },
});