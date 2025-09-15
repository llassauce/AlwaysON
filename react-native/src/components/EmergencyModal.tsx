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

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateBackup: () => void;
  connectionStatus: string;
}

export function EmergencyModal({ isOpen, onClose, onActivateBackup, connectionStatus }: EmergencyModalProps) {
  const getStatusDetails = () => {
    switch (connectionStatus) {
      case 'weak':
        return {
          icon: 'wifi-outline',
          iconColor: COLORS.yellow500,
          title: 'Weak Signal Detected',
          message: 'Your primary connection is weak. Would you like to activate AlwaysON backup to ensure stable connectivity?'
        };
      case 'disconnected':
        return {
          icon: 'wifi-off',
          iconColor: COLORS.red500,
          title: 'Connection Lost',
          message: 'Your primary connection is down. Activate AlwaysON backup to stay connected.'
        };
      default:
        return {
          icon: 'warning',
          iconColor: COLORS.orange500,
          title: 'Connection Issue',
          message: 'There seems to be an issue with your connection. Would you like to activate backup?'
        };
    }
  };

  const statusDetails = getStatusDetails();

  const handleActivate = () => {
    onActivateBackup();
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: statusDetails.iconColor + '20' }]}>
              <Ionicons name={statusDetails.icon as any} size={32} color={statusDetails.iconColor} />
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.gray500} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{statusDetails.title}</Text>
            <Text style={styles.message}>{statusDetails.message}</Text>

            <View style={styles.warningCard}>
              <View style={styles.warningHeader}>
                <Ionicons name="shield-checkmark" size={20} color={BRAND_COLOR} />
                <Text style={styles.warningTitle}>AlwaysON Ready</Text>
              </View>
              <Text style={styles.warningText}>
                Your backup eSIM is ready to provide instant connectivity through our partner networks.
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleActivate}>
              <Text style={styles.primaryButtonText}>Activate Backup</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Stay Disconnected</Text>
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
  
  message: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.base * 1.5,
    marginBottom: SPACING[4],
  },
  
  warningCard: {
    backgroundColor: BRAND_COLOR + '10',
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    borderWidth: 1,
    borderColor: BRAND_COLOR + '30',
  },
  
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[2],
  },
  
  warningTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    marginLeft: SPACING[2],
  },
  
  warningText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.sm * 1.4,
  },
  
  actions: {
    padding: SPACING[6],
    gap: SPACING[3],
  },
  
  primaryButton: {
    backgroundColor: BRAND_COLOR,
    paddingVertical: SPACING[4],
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.sm,
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