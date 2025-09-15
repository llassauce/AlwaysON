import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, BRAND_COLOR, SHADOWS } from '../constants/theme';
import { AlwaysONNative } from '../services/AlwaysONNative';

interface SettingsScreenProps {
  navigation: any;
  route: any;
}

export function SettingsScreen({ navigation, route }: SettingsScreenProps) {
  const {
    user = null,
    autoActivation = false,
    alwaysOnEnabled = true,
    primarySim = null,
    currentSim = null,
    isSimValid = true,
    serviceSuspended = false,
    esimStatus = 'installed',
    onAutoActivationChange = () => {},
    onAlwaysOnEnabledChange = () => {},
    onResetSim = () => {},
    onChangeSim = () => {},
    onReinstallEsim = () => {},
    onNavigate = () => {},
    onBack = () => {},
    onLogout = () => {},
  } = route.params || {};

  const handleNotificationSettings = () => {
    Alert.alert(
      'Notification Settings',
      'To enable notifications:\n\n1. Open iPhone Settings\n2. Go to AlwaysON\n3. Turn on Allow Notifications\n4. Enable all notification types',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Settings', 
          onPress: () => {
            // Open iOS Settings app to notifications
            Linking.openURL('app-settings:');
          }
        }
      ]
    );
  };

  const handleReinstallEsim = async () => {
    try {
      Alert.alert(
        'Reinstall eSIM Profile',
        'This will reinstall your AlwaysON eSIM profile. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reinstall',
            onPress: async () => {
              try {
                // In a real app, get the profile URL from your backend
                const profileURL = 'https://your-backend.com/api/esim/profile';
                const result = await AlwaysONNative.installESIMProfile(profileURL);
                
                if (result.success) {
                  Alert.alert('Success', 'eSIM profile has been reinstalled successfully.');
                  onReinstallEsim();
                } else {
                  Alert.alert('Installation Failed', result.message);
                }
              } catch (error) {
                Alert.alert('Error', 'Failed to reinstall eSIM profile. Please try again.');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error in handleReinstallEsim:', error);
    }
  };

  const getEsimStatusInfo = () => {
    if (esimStatus === 'installed' && isSimValid && !serviceSuspended) {
      return {
        text: 'Ready and configured',
        badge: { text: 'Active', icon: 'checkmark-circle', style: { backgroundColor: COLORS.green100, color: COLORS.green800 } }
      };
    }
    if (esimStatus === 'removed') {
      return {
        text: 'eSIM profile removed',
        badge: { text: 'Offline', icon: 'close-circle', style: { backgroundColor: COLORS.red100, color: COLORS.red800 } }
      };
    }
    if (esimStatus === 'installing') {
      return {
        text: 'Installing eSIM profile...',
        badge: { text: 'Installing', icon: 'download', style: { backgroundColor: COLORS.orange100, color: COLORS.orange800 } }
      };
    }
    if (esimStatus === 'error') {
      return {
        text: 'eSIM installation failed',
        badge: { text: 'Error', icon: 'alert-circle', style: { backgroundColor: COLORS.red100, color: COLORS.red800 } }
      };
    }
    if (esimStatus === 'installed' && (!isSimValid || serviceSuspended)) {
      return {
        text: 'Service suspended',
        badge: { text: 'Suspended', icon: 'alert-circle', style: { backgroundColor: COLORS.orange100, color: COLORS.orange800 } }
      };
    }
    return {
      text: 'Unknown status',
      badge: { text: 'Unknown', icon: 'help-circle', style: { backgroundColor: COLORS.gray100, color: COLORS.gray800 } }
    };
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  const statusInfo = getEsimStatusInfo();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.profileAvatar, { backgroundColor: BRAND_COLOR + '20' }]}>
              <Ionicons name="person" size={24} color={BRAND_COLOR} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'User Name'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'user@email.com'}</Text>
            </View>
          </View>
          <View style={[styles.profileBadge, { backgroundColor: COLORS.green100 }]}>
            <Text style={[styles.profileBadgeText, { color: COLORS.green800 }]}>
              AlwaysON
            </Text>
          </View>
        </View>

        {/* Backup Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backup Settings</Text>
          <View style={styles.card}>
            {/* Auto-activation */}
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Ionicons name="shield-checkmark" size={20} color={BRAND_COLOR} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Auto-activation</Text>
                  <Text style={styles.settingDescription}>
                    Automatically activate backup when needed
                  </Text>
                </View>
              </View>
              <Switch
                value={autoActivation}
                onValueChange={onAutoActivationChange}
                trackColor={{ false: COLORS.gray300, true: BRAND_COLOR + '40' }}
                thumbColor={autoActivation ? BRAND_COLOR : COLORS.white}
              />
            </View>

            <View style={styles.divider} />

            {/* AlwaysON Service */}
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Ionicons 
                  name="shield-checkmark" 
                  size={20} 
                  color={serviceSuspended ? COLORS.red500 : BRAND_COLOR} 
                />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>AlwaysON Service</Text>
                  <View style={styles.settingDescriptionContainer}>
                    <Text style={styles.settingDescription}>
                      Backup for: {primarySim?.carrier} {primarySim?.number}
                    </Text>
                    {serviceSuspended && (
                      <View style={styles.warningRow}>
                        <Ionicons name="alert-circle" size={12} color={COLORS.red600} />
                        <Text style={[styles.warningText, { color: COLORS.red600 }]}>
                          Service suspended - SIM mismatch
                        </Text>
                      </View>
                    )}
                    {!isSimValid && !serviceSuspended && (
                      <Text style={[styles.warningText, { color: COLORS.orange600 }]}>
                        Invalid SIM detected
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <Switch
                value={alwaysOnEnabled && !serviceSuspended}
                onValueChange={onAlwaysOnEnabledChange}
                disabled={serviceSuspended}
                trackColor={{ false: COLORS.gray300, true: BRAND_COLOR + '40' }}
                thumbColor={alwaysOnEnabled && !serviceSuspended ? BRAND_COLOR : COLORS.white}
              />
            </View>

            <View style={styles.divider} />

            {/* Primary Network */}
            <View style={[styles.settingRow, { backgroundColor: COLORS.gray50 }]}>
              <View style={styles.primaryNetworkContainer}>
                <Text style={styles.primaryNetworkTitle}>Primary Network</Text>
                <View style={styles.primaryNetworkContent}>
                  <View style={styles.primaryNetworkInfo}>
                    <Text style={styles.primaryNetworkCarrier}>
                      {currentSim ? `${currentSim.carrier} ${currentSim.number}` : 'No SIM detected'}
                    </Text>
                    <Text style={styles.primaryNetworkStatus}>
                      {isSimValid ? 'Authorized for AlwaysON' : 'Not authorized for backup service'}
                    </Text>
                  </View>
                  <View style={[
                    styles.validityBadge,
                    isSimValid 
                      ? { backgroundColor: COLORS.green100 }
                      : { backgroundColor: COLORS.red100 }
                  ]}>
                    <Text style={[
                      styles.validityBadgeText,
                      isSimValid 
                        ? { color: COLORS.green800 }
                        : { color: COLORS.red800 }
                    ]}>
                      {isSimValid ? 'Valid' : 'Invalid'}
                    </Text>
                  </View>
                </View>

                {!isSimValid && currentSim && (
                  <View style={styles.simActionButtons}>
                    <TouchableOpacity 
                      style={[styles.simActionButton, { marginRight: SPACING[2] }]}
                      onPress={onResetSim}
                    >
                      <Ionicons name="refresh" size={12} color={COLORS.textPrimary} />
                      <Text style={styles.simActionButtonText}>Use Current SIM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.simActionButton, { marginLeft: SPACING[2] }]}
                      onPress={onChangeSim}
                    >
                      <Text style={styles.simActionButtonText}>Change SIM</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.divider} />

            {/* Notification Info */}
            <View style={[styles.settingRow, { backgroundColor: COLORS.gray50, alignItems: 'flex-start' }]}>
              <Ionicons name="notifications" size={20} color={COLORS.orange600} style={{ marginTop: 2 }} />
              <View style={styles.notificationContent}>
                <Text style={styles.notificationText}>
                  <Text style={styles.notificationTextBold}>Important:</Text> Enable notifications in your iPhone settings to receive alerts when your connection drops.
                </Text>
                <TouchableOpacity onPress={handleNotificationSettings}>
                  <Text style={[styles.notificationLink, { color: BRAND_COLOR }]}>
                    Open iPhone Notification Settings
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Device Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Information</Text>
          <View style={styles.card}>
            {/* AlwaysON Status */}
            <View style={styles.deviceInfoRow}>
              <View style={styles.deviceInfoContent}>
                <Ionicons name="phone-portrait" size={20} color={COLORS.gray600} />
                <View style={styles.deviceInfoText}>
                  <Text style={styles.deviceInfoTitle}>AlwaysON Status</Text>
                  <Text style={styles.deviceInfoDescription}>{statusInfo.text}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, statusInfo.badge.style]}>
                <Ionicons name={statusInfo.badge.icon as any} size={12} color={statusInfo.badge.style.color} />
                <Text style={[styles.statusBadgeText, { color: statusInfo.badge.style.color }]}>
                  {statusInfo.badge.text}
                </Text>
              </View>
            </View>

            {/* eSIM Status Cards */}
            {esimStatus === 'removed' && (
              <View style={[styles.statusCard, { backgroundColor: COLORS.red50, borderColor: COLORS.red200 }]}>
                <View style={styles.statusCardHeader}>
                  <Ionicons name="alert-circle" size={16} color={COLORS.red600} />
                  <View style={styles.statusCardText}>
                    <Text style={[styles.statusCardTitle, { color: COLORS.red800 }]}>
                      eSIM Profile Missing
                    </Text>
                    <Text style={[styles.statusCardDescription, { color: COLORS.red700 }]}>
                      The AlwaysON eSIM profile has been removed from your device. Reinstall it to restore backup connectivity.
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={[styles.statusCardButton, { backgroundColor: BRAND_COLOR }]}
                  onPress={handleReinstallEsim}
                >
                  <Ionicons name="download" size={12} color={COLORS.white} />
                  <Text style={styles.statusCardButtonText}>Reinstall eSIM Profile</Text>
                </TouchableOpacity>
              </View>
            )}

            {esimStatus === 'installing' && (
              <View style={[styles.statusCard, { backgroundColor: COLORS.orange50, borderColor: COLORS.orange200 }]}>
                <View style={styles.statusCardHeader}>
                  <Ionicons name="download" size={16} color={COLORS.orange600} />
                  <View>
                    <Text style={[styles.statusCardTitle, { color: COLORS.orange800 }]}>
                      Installing eSIM Profile
                    </Text>
                    <Text style={[styles.statusCardDescription, { color: COLORS.orange700 }]}>
                      This may take a few minutes...
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {esimStatus === 'error' && (
              <View style={[styles.statusCard, { backgroundColor: COLORS.red50, borderColor: COLORS.red200 }]}>
                <View style={styles.statusCardHeader}>
                  <Ionicons name="alert-circle" size={16} color={COLORS.red600} />
                  <View style={styles.statusCardText}>
                    <Text style={[styles.statusCardTitle, { color: COLORS.red800 }]}>
                      Installation Failed
                    </Text>
                    <Text style={[styles.statusCardDescription, { color: COLORS.red700 }]}>
                      Failed to install eSIM profile. Please try again or contact support.
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={[styles.statusCardButton, { backgroundColor: BRAND_COLOR }]}
                  onPress={handleReinstallEsim}
                >
                  <Ionicons name="refresh" size={12} color={COLORS.white} />
                  <Text style={styles.statusCardButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.divider} />

            {/* Network Coverage */}
            <TouchableOpacity 
              style={styles.menuRow}
              onPress={() => onNavigate('network-coverage')}
            >
              <View style={styles.menuContent}>
                <Ionicons name="globe" size={20} color={COLORS.gray600} />
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>Network Coverage</Text>
                  <Text style={styles.menuDescription}>View coverage details and partner networks</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.menuRow}
              onPress={() => onNavigate('billing')}
            >
              <View style={styles.menuContent}>
                <Ionicons name="card" size={20} color={COLORS.gray600} />
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>Billing & Payment</Text>
                  <Text style={styles.menuDescription}>Manage your subscription</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.menuRow}
              onPress={() => onNavigate('help-faq')}
            >
              <View style={styles.menuContent}>
                <Ionicons name="help-circle" size={20} color={COLORS.gray600} />
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>Help & FAQ</Text>
                  <Text style={styles.menuDescription}>Get answers and support</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.menuRow}
              onPress={() => onNavigate('share-feedback')}
            >
              <View style={styles.menuContent}>
                <Ionicons name="chatbubble" size={20} color={COLORS.gray600} />
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>Share Feedback</Text>
                  <Text style={styles.menuDescription}>Help us improve AlwaysON</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={onLogout}
        >
          <Ionicons name="log-out" size={16} color={COLORS.red600} />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>AlwaysON v1.0.0</Text>
          <Text style={styles.footerText}>© 2025 SIMO Holdings, Inc.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  
  content: {
    padding: SPACING[6],
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[6],
  },
  
  backButton: {
    marginRight: SPACING[3],
    padding: SPACING[1],
  },
  
  headerTitle: {
    fontSize: TYPOGRAPHY.xl,
    color: COLORS.textPrimary,
  },
  
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    marginBottom: SPACING[6],
    ...SHADOWS.sm,
  },
  
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[4],
  },
  
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING[3],
  },
  
  profileInfo: {
    flex: 1,
  },
  
  profileName: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
  },
  
  profileEmail: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  
  profileBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[1],
    borderRadius: RADIUS.md,
  },
  
  profileBadgeText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium,
  },
  
  section: {
    marginBottom: SPACING[6],
  },
  
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING[3],
  },
  
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING[4],
  },
  
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  settingText: {
    marginLeft: SPACING[3],
    flex: 1,
  },
  
  settingTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
  },
  
  settingDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  
  settingDescriptionContainer: {
    gap: SPACING[1],
  },
  
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING[1],
  },
  
  warningText: {
    fontSize: TYPOGRAPHY.xs,
  },
  
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  
  primaryNetworkContainer: {
    width: '100%',
  },
  
  primaryNetworkTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING[2],
  },
  
  primaryNetworkContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING[3],
  },
  
  primaryNetworkInfo: {
    flex: 1,
  },
  
  primaryNetworkCarrier: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
  },
  
  primaryNetworkStatus: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textTertiary,
  },
  
  validityBadge: {
    paddingHorizontal: SPACING[2],
    paddingVertical: SPACING[1],
    borderRadius: RADIUS.sm,
  },
  
  validityBadgeText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium,
  },
  
  simActionButtons: {
    flexDirection: 'row',
  },
  
  simActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING[2],
    paddingHorizontal: SPACING[3],
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    gap: SPACING[1],
  },
  
  simActionButtonText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textPrimary,
  },
  
  notificationContent: {
    marginLeft: SPACING[3],
    flex: 1,
  },
  
  notificationText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.sm * 1.4,
    marginBottom: SPACING[2],
  },
  
  notificationTextBold: {
    fontWeight: TYPOGRAPHY.medium,
  },
  
  notificationLink: {
    fontSize: TYPOGRAPHY.sm,
    textDecorationLine: 'underline',
  },
  
  deviceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING[4],
  },
  
  deviceInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  deviceInfoText: {
    marginLeft: SPACING[3],
    flex: 1,
  },
  
  deviceInfoTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
  },
  
  deviceInfoDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING[2],
    paddingVertical: SPACING[1],
    borderRadius: RADIUS.sm,
    gap: SPACING[1],
  },
  
  statusBadgeText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium,
  },
  
  statusCard: {
    margin: SPACING[4],
    padding: SPACING[3],
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  
  statusCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING[3],
    gap: SPACING[3],
  },
  
  statusCardText: {
    flex: 1,
  },
  
  statusCardTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium,
    marginBottom: SPACING[1],
  },
  
  statusCardDescription: {
    fontSize: TYPOGRAPHY.xs,
    lineHeight: TYPOGRAPHY.xs * 1.4,
  },
  
  statusCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING[2],
    borderRadius: RADIUS.md,
    gap: SPACING[1],
  },
  
  statusCardButtonText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium,
    color: COLORS.white,
  },
  
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING[4],
  },
  
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  menuText: {
    marginLeft: SPACING[3],
    flex: 1,
  },
  
  menuTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
  },
  
  menuDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.red200,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING[4],
    marginBottom: SPACING[6],
    gap: SPACING[2],
  },
  
  logoutButtonText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.red600,
  },
  
  footer: {
    alignItems: 'center',
    gap: SPACING[1],
  },
  
  footerText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textTertiary,
  },
});