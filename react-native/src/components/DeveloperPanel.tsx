import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, BRAND_COLOR } from '../constants/theme';

interface DeveloperPanelProps {
  isVisible: boolean;
  onClose: () => void;
  connectionStatus: string;
  isBackupActive: boolean;
  isSubscribed: boolean;
  userCountry: string;
  onConnectionStatusChange: (status: string) => void;
  onBackupToggle: () => void;
  onSubscriptionToggle: () => void;
  onCountryChange: (country: string) => void;
  onTriggerEmergencyModal: () => void;
  onTriggerSimMismatch: () => void;
}

export function DeveloperPanel({
  isVisible,
  onClose,
  connectionStatus,
  isBackupActive,
  isSubscribed,
  userCountry,
  onConnectionStatusChange,
  onBackupToggle,
  onSubscriptionToggle,
  onCountryChange,
  onTriggerEmergencyModal,
  onTriggerSimMismatch,
}: DeveloperPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  const connectionStatuses = [
    { id: 'connected', name: 'Connected', color: COLORS.green600 },
    { id: 'weak', name: 'Weak Signal', color: COLORS.yellow500 },
    { id: 'disconnected', name: 'Disconnected', color: COLORS.red500 }
  ];

  const countries = [
    'United States',
    'Canada', 
    'United Kingdom',
    'Germany',
    'Australia',
    'Japan', // Unsupported for testing
    'Brazil' // Unsupported for testing
  ];

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.panel, isMinimized && styles.panelMinimized]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🛠️ Developer Panel</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => setIsMinimized(!isMinimized)}
              >
                <Ionicons 
                  name={isMinimized ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={COLORS.white} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={onClose}>
                <Ionicons name="close" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          {!isMinimized && (
            <View style={styles.content}>
              {/* Connection Status */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Connection Status</Text>
                <View style={styles.statusButtons}>
                  {connectionStatuses.map(status => (
                    <TouchableOpacity
                      key={status.id}
                      style={[
                        styles.statusButton,
                        connectionStatus === status.id && { backgroundColor: status.color }
                      ]}
                      onPress={() => onConnectionStatusChange(status.id)}
                    >
                      <Text style={[
                        styles.statusButtonText,
                        connectionStatus === status.id && { color: COLORS.white }
                      ]}>
                        {status.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Quick Actions */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActions}>
                  <View style={styles.quickAction}>
                    <Text style={styles.quickActionLabel}>Backup Active</Text>
                    <Switch
                      value={isBackupActive}
                      onValueChange={onBackupToggle}
                      trackColor={{ false: COLORS.gray300, true: BRAND_COLOR + '40' }}
                      thumbColor={isBackupActive ? BRAND_COLOR : COLORS.white}
                    />
                  </View>
                  
                  <View style={styles.quickAction}>
                    <Text style={styles.quickActionLabel}>Subscribed</Text>
                    <Switch
                      value={isSubscribed}
                      onValueChange={onSubscriptionToggle}
                      trackColor={{ false: COLORS.gray300, true: BRAND_COLOR + '40' }}
                      thumbColor={isSubscribed ? BRAND_COLOR : COLORS.white}
                    />
                  </View>
                </View>
              </View>

              {/* Test Scenarios */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Test Scenarios</Text>
                <View style={styles.testButtons}>
                  <TouchableOpacity style={styles.testButton} onPress={onTriggerEmergencyModal}>
                    <Text style={styles.testButtonText}>Emergency Modal</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.testButton} onPress={onTriggerSimMismatch}>
                    <Text style={styles.testButtonText}>SIM Mismatch</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Country Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Test Geography</Text>
                <Text style={styles.currentCountry}>Current: {userCountry}</Text>
                <View style={styles.countryButtons}>
                  {countries.map(country => (
                    <TouchableOpacity
                      key={country}
                      style={[
                        styles.countryButton,
                        userCountry === country && styles.countryButtonActive
                      ]}
                      onPress={() => onCountryChange(country)}
                    >
                      <Text style={[
                        styles.countryButtonText,
                        userCountry === country && styles.countryButtonTextActive
                      ]}>
                        {country}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  
  panel: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '80%',
  },
  
  panelMinimized: {
    maxHeight: 60,
  },
  
  header: {
    backgroundColor: BRAND_COLOR,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING[4],
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  
  title: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.white,
  },
  
  headerActions: {
    flexDirection: 'row',
    gap: SPACING[2],
  },
  
  headerButton: {
    padding: SPACING[2],
  },
  
  content: {
    padding: SPACING[4],
    maxHeight: 400,
  },
  
  section: {
    marginBottom: SPACING[4],
  },
  
  sectionTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING[2],
  },
  
  statusButtons: {
    flexDirection: 'row',
    gap: SPACING[2],
  },
  
  statusButton: {
    flex: 1,
    backgroundColor: COLORS.gray100,
    paddingVertical: SPACING[2],
    paddingHorizontal: SPACING[3],
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  
  statusButtonText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textPrimary,
  },
  
  quickActions: {
    gap: SPACING[3],
  },
  
  quickAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  quickActionLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textPrimary,
  },
  
  testButtons: {
    flexDirection: 'row',
    gap: SPACING[2],
  },
  
  testButton: {
    flex: 1,
    backgroundColor: COLORS.orange500,
    paddingVertical: SPACING[2],
    paddingHorizontal: SPACING[3],
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  
  testButtonText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.medium,
  },
  
  currentCountry: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING[2],
  },
  
  countryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING[1],
  },
  
  countryButton: {
    backgroundColor: COLORS.gray100,
    paddingVertical: SPACING[1],
    paddingHorizontal: SPACING[2],
    borderRadius: RADIUS.sm,
    marginBottom: SPACING[1],
  },
  
  countryButtonActive: {
    backgroundColor: BRAND_COLOR,
  },
  
  countryButtonText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textPrimary,
  },
  
  countryButtonTextActive: {
    color: COLORS.white,
  },
});