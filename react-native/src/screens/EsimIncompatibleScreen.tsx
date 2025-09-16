import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, BRAND_COLOR, SHADOWS } from '../constants/theme';

interface EsimIncompatibleScreenProps {
  navigation: any;
  route: any;
}

export function EsimIncompatibleScreen({ navigation, route }: EsimIncompatibleScreenProps) {
  const { onBack } = route.params || {};

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  const handleCheckEsimSupport = () => {
    // Open iOS Settings to check eSIM support
    Linking.openURL('app-settings:');
  };

  const handleViewCompatibleDevices = () => {
    // In a real app, this might navigate to a compatible devices screen
    // or open a web page with device compatibility information
    Linking.openURL('https://support.apple.com/en-us/HT209096');
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
          <Text style={styles.icon}>📱</Text>
        </View>

        {/* Title and Message */}
        <Text style={styles.title}>eSIM Not Supported</Text>
        <Text style={styles.message}>
          Your device doesn't support eSIM functionality, which is required for AlwaysON to work. 
          AlwaysON uses eSIM technology to provide backup connectivity.
        </Text>

        {/* Requirements Card */}
        <View style={styles.requirementsCard}>
          <View style={styles.requirementsHeader}>
            <Ionicons name="information-circle" size={20} color={COLORS.blue600} />
            <Text style={styles.requirementsTitle}>What AlwaysON Requires</Text>
          </View>
          <View style={styles.requirementsList}>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.green600} />
              <Text style={styles.requirementText}>iPhone with eSIM support (iPhone XS/XR or newer)</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.green600} />
              <Text style={styles.requirementText}>iOS 12.1 or later</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.green600} />
              <Text style={styles.requirementText}>Unlocked device or carrier that supports eSIM</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.green600} />
              <Text style={styles.requirementText}>Available eSIM slot (devices support 1-2 eSIM profiles)</Text>
            </View>
          </View>
        </View>

        {/* Compatible Devices */}
        <View style={styles.devicesCard}>
          <Text style={styles.devicesTitle}>Compatible iPhone Models</Text>
          <View style={styles.devicesList}>
            <Text style={styles.deviceText}>• iPhone 15 series</Text>
            <Text style={styles.deviceText}>• iPhone 14 series</Text>
            <Text style={styles.deviceText}>• iPhone 13 series</Text>
            <Text style={styles.deviceText}>• iPhone 12 series</Text>
            <Text style={styles.deviceText}>• iPhone 11 series</Text>
            <Text style={styles.deviceText}>• iPhone XS, XS Max, XR</Text>
            <Text style={styles.deviceText}>• iPhone SE (2nd & 3rd generation)</Text>
          </View>
        </View>

        {/* Check Device Action */}
        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>Check Your Device</Text>
          <Text style={styles.actionDescription}>
            Not sure if your device supports eSIM? You can check in your iPhone settings.
          </Text>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleCheckEsimSupport}
          >
            <Ionicons name="settings" size={16} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Check eSIM Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Help Options */}
        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <TouchableOpacity 
            style={styles.helpOption}
            onPress={handleViewCompatibleDevices}
          >
            <View style={styles.helpOptionContent}>
              <Ionicons name="globe" size={20} color={COLORS.gray600} />
              <View style={styles.helpOptionText}>
                <Text style={styles.helpOptionTitle}>View Compatible Devices</Text>
                <Text style={styles.helpOptionDescription}>
                  See full list of eSIM-compatible devices
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
          </TouchableOpacity>
        </View>

        {/* Alternative Solution */}
        <View style={styles.alternativeCard}>
          <View style={styles.alternativeHeader}>
            <Ionicons name="lightbulb" size={20} color={COLORS.orange600} />
            <Text style={styles.alternativeTitle}>Consider Upgrading</Text>
          </View>
          <Text style={styles.alternativeDescription}>
            To enjoy AlwaysON's seamless backup connectivity, consider upgrading to an eSIM-compatible iPhone. 
            All current iPhone models support eSIM technology.
          </Text>
        </View>

        {/* Back to Start */}
        <TouchableOpacity style={styles.backToStartButton} onPress={handleBack}>
          <Text style={styles.backToStartButtonText}>Back to Start</Text>
        </TouchableOpacity>
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
  
  requirementsCard: {
    backgroundColor: COLORS.blue50,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.blue200,
    padding: SPACING[4],
    marginBottom: SPACING[6],
  },
  
  requirementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[3],
  },
  
  requirementsTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.blue900,
    marginLeft: SPACING[2],
  },
  
  requirementsList: {
    gap: SPACING[2],
  },
  
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  requirementText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.blue800,
    marginLeft: SPACING[2],
    flex: 1,
    lineHeight: TYPOGRAPHY.sm * 1.4,
  },
  
  devicesCard: {
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    marginBottom: SPACING[6],
  },
  
  devicesTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING[3],
  },
  
  devicesList: {
    gap: SPACING[1],
  },
  
  deviceText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  
  actionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    padding: SPACING[4],
    marginBottom: SPACING[6],
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  
  actionTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING[2],
  },
  
  actionDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING[4],
    lineHeight: TYPOGRAPHY.sm * 1.4,
  },
  
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLOR,
    paddingVertical: SPACING[3],
    paddingHorizontal: SPACING[4],
    borderRadius: RADIUS.lg,
    gap: SPACING[2],
  },
  
  actionButtonText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium,
    color: COLORS.white,
  },
  
  helpCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    padding: SPACING[4],
    marginBottom: SPACING[6],
    ...SHADOWS.sm,
  },
  
  helpTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING[3],
  },
  
  helpOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING[2],
  },
  
  helpOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  helpOptionText: {
    marginLeft: SPACING[3],
    flex: 1,
  },
  
  helpOptionTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
  },
  
  helpOptionDescription: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
  },
  
  alternativeCard: {
    backgroundColor: COLORS.orange50,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.orange200,
    padding: SPACING[4],
    marginBottom: SPACING[6],
  },
  
  alternativeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[2],
  },
  
  alternativeTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.orange800,
    marginLeft: SPACING[2],
  },
  
  alternativeDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.orange700,
    lineHeight: TYPOGRAPHY.sm * 1.4,
  },
  
  backToStartButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING[4],
    alignItems: 'center',
  },
  
  backToStartButtonText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
  },
});