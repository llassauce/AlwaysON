import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, BRAND_COLOR, SHADOWS } from '../constants/theme';

interface SimMismatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangeSim: () => void;
  onSuspendService: () => void;
  onGoToSettings: () => void;
  currentSim: any;
  primarySim: any;
  suspensionReason: string;
}

export function SimMismatchModal({ 
  isOpen, 
  onClose, 
  onChangeSim, 
  onSuspendService, 
  onGoToSettings,
  currentSim,
  primarySim,
  suspensionReason 
}: SimMismatchModalProps) {
  
  const getModalContent = () => {
    if (suspensionReason === 'sim-removed') {
      return {
        icon: 'warning',
        iconColor: COLORS.red500,
        title: 'SIM Card Removed',
        description: 'No SIM card detected in your device. Please insert your SIM card to restore AlwaysON service.',
        primaryAction: { text: 'Go to Settings', action: onGoToSettings },
        secondaryAction: { text: 'Suspend Service', action: onSuspendService }
      };
    }
    
    return {
      icon: 'swap-horizontal',
      iconColor: COLORS.orange500,
      title: 'SIM Card Changed',
      description: `You've switched from ${primarySim?.carrier} to ${currentSim?.carrier}. Would you like to update your AlwaysON backup to protect this new SIM?`,
      primaryAction: { text: 'Update Backup', action: onChangeSim },
      secondaryAction: { text: 'Keep Current', action: onSuspendService }
    };
  };

  const content = getModalContent();

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: content.iconColor + '20' }]}>
              <Ionicons name={content.icon as any} size={32} color={content.iconColor} />
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.gray500} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{content.title}</Text>
            <Text style={styles.description}>{content.description}</Text>

            {suspensionReason === 'sim-mismatch' && currentSim && primarySim && (
              <View style={styles.simComparison}>
                <View style={styles.simInfo}>
                  <Text style={styles.simLabel}>Previous SIM:</Text>
                  <Text style={styles.simDetails}>{primarySim.carrier} {primarySim.number}</Text>
                </View>
                <Ionicons name="arrow-down" size={20} color={COLORS.gray400} />
                <View style={styles.simInfo}>
                  <Text style={styles.simLabel}>Current SIM:</Text>
                  <Text style={styles.simDetails}>{currentSim.carrier} {currentSim.number}</Text>
                </View>
              </View>
            )}

            {suspensionReason === 'sim-removed' && (
              <View style={styles.warningCard}>
                <View style={styles.warningHeader}>
                  <Ionicons name="alert-circle" size={16} color={COLORS.red600} />
                  <Text style={styles.warningTitle}>Service Suspended</Text>
                </View>
                <Text style={styles.warningText}>
                  AlwaysON backup cannot function without a SIM card. Insert your SIM card to restore protection.
                </Text>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]}
              onPress={content.primaryAction.action}
            >
              <Text style={styles.primaryButtonText}>{content.primaryAction.text}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]}
              onPress={content.secondaryAction.action}
            >
              <Text style={styles.secondaryButtonText}>{content.secondaryAction.text}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING[6],
  },
  
  modal: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    width: '100%',
    maxWidth: 400,
    ...SHADOWS.lg,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING[6],
    paddingBottom: SPACING[4],
  },
  
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  closeButton: {
    padding: SPACING[2],
  },
  
  content: {
    paddingHorizontal: SPACING[6],
    paddingBottom: SPACING[4],
  },
  
  title: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING[3],
  },
  
  description: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.base * 1.5,
    marginBottom: SPACING[4],
  },
  
  simComparison: {
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    alignItems: 'center',
    gap: SPACING[2],
    marginBottom: SPACING[4],
  },
  
  simInfo: {
    alignItems: 'center',
  },
  
  simLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING[1],
  },
  
  simDetails: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.medium,
    color: COLORS.textPrimary,
  },
  
  warningCard: {
    backgroundColor: COLORS.red50,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.red200,
    padding: SPACING[4],
    marginBottom: SPACING[4],
  },
  
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[2],
  },
  
  warningTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.red800,
    marginLeft: SPACING[2],
  },
  
  warningText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.red700,
    lineHeight: TYPOGRAPHY.sm * 1.4,
  },
  
  actions: {
    padding: SPACING[6],
    gap: SPACING[3],
  },
  
  button: {
    paddingVertical: SPACING[4],
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  primaryButton: {
    backgroundColor: BRAND_COLOR,
    ...SHADOWS.sm,
  },
  
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray300,
  },
  
  primaryButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.white,
  },
  
  secondaryButtonText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
  },
});