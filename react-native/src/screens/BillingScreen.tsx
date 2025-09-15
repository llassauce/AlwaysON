import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, BRAND_COLOR, SHADOWS } from '../constants/theme';

interface BillingScreenProps {
  navigation: any;
  route: any;
}

interface BillItem {
  id: number;
  date: string;
  description: string;
  amount: number;
  status: string;
  invoice: string;
  paymentMethod: { type: string; last4: string };
  billingPeriod: { start: string; end: string };
}

export function BillingScreen({ navigation, route }: BillingScreenProps) {
  const {
    user = null,
    backupUsage = { monthlyHours: 0, monthlyUsages: 0, lastResetDate: '', sessionStartTime: null },
    onBack = () => {},
    onNavigate = () => {},
    onCancelSubscription = () => {},
  } = route.params || {};

  const [paymentMethod] = useState({
    type: 'visa',
    last4: '4242',
    expiry: '12/27'
  });

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [billingHistory] = useState<BillItem[]>([
    {
      id: 1,
      date: '2024-12-15',
      description: 'AlwaysON Monthly Subscription',
      amount: 10.00,
      status: 'paid',
      invoice: 'INV-2024-12-001',
      paymentMethod: { type: 'visa', last4: '4242' },
      billingPeriod: { start: '2024-12-15', end: '2025-01-15' }
    },
    {
      id: 2,
      date: '2024-11-15',
      description: 'AlwaysON Monthly Subscription',
      amount: 10.00,
      status: 'paid',
      invoice: 'INV-2024-11-001',
      paymentMethod: { type: 'visa', last4: '4242' },
      billingPeriod: { start: '2024-11-15', end: '2024-12-15' }
    },
    {
      id: 3,
      date: '2024-10-15',
      description: 'AlwaysON Monthly Subscription (First Month Free)',
      amount: 0.00,
      status: 'paid',
      invoice: 'INV-2024-10-001',
      paymentMethod: { type: 'visa', last4: '4242' },
      billingPeriod: { start: '2024-10-15', end: '2024-11-15' }
    }
  ]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    
    // Simulate cancellation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsCancelling(false);
    setShowCancelModal(false);
    onCancelSubscription();
  };

  const handleViewReceipt = (receipt: BillItem) => {
    // In React Native, you'd typically pass the data through navigation params
    navigation.navigate('Receipt', { receipt, user });
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Billing & Payment</Text>
          </View>

          {/* Current Plan */}
          <View style={styles.card}>
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planTitle}>Current Plan</Text>
                <Text style={styles.planSubtitle}>AlwaysON Backup Service</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: COLORS.green100 }]}>
                <Text style={[styles.badgeText, { color: COLORS.green800 }]}>Active</Text>
              </View>
            </View>

            <View style={styles.planDetails}>
              <View style={styles.planDetailItem}>
                <Text style={styles.planDetailLabel}>Monthly Cost</Text>
                <Text style={[styles.planDetailValue, { color: BRAND_COLOR }]}>$10.00</Text>
              </View>
              <View style={styles.planDetailItem}>
                <Text style={styles.planDetailLabel}>Next Billing</Text>
                <Text style={styles.planDetailValue}>Jan 15, 2025</Text>
              </View>
            </View>

            <View style={[styles.promoCard, { backgroundColor: COLORS.green50, borderColor: COLORS.green200 }]}>
              <View style={styles.promoHeader}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.green600} />
                <Text style={[styles.promoText, { color: COLORS.green700 }]}>First Month Free Applied</Text>
              </View>
              <Text style={[styles.promoDescription, { color: COLORS.green600 }]}>
                You saved $10.00 with your promotional offer
              </Text>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <TouchableOpacity 
                style={styles.manageButton}
                onPress={() => onNavigate('payment-methods')}
              >
                <Ionicons name="create" size={12} color={COLORS.textPrimary} />
                <Text style={styles.manageButtonText}>Manage</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.paymentMethodRow}>
              <View style={[styles.cardBrand, { backgroundColor: COLORS.blue600 }]}>
                <Text style={styles.cardBrandText}>VISA</Text>
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.cardNumber}>•••• •••• •••• {paymentMethod.last4}</Text>
                <Text style={styles.cardExpiry}>Expires {paymentMethod.expiry}</Text>
              </View>
            </View>
          </View>

          {/* Usage Summary */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>This Month's Usage</Text>
            <View style={styles.usageGrid}>
              <View style={styles.usageItem}>
                <Text style={[styles.usageValue, { color: BRAND_COLOR }]}>
                  {backupUsage.monthlyUsages}
                </Text>
                <Text style={styles.usageLabel}>Backup Activations</Text>
              </View>
              <View style={styles.usageItem}>
                <Text style={[styles.usageValue, { color: BRAND_COLOR }]}>
                  {backupUsage.monthlyHours.toFixed(1)}h
                </Text>
                <Text style={styles.usageLabel}>Total Usage Time</Text>
              </View>
              <View style={styles.usageItem}>
                <Text style={[styles.usageValue, { color: BRAND_COLOR }]}>
                  {(backupUsage.monthlyHours * 150).toFixed(0)}MB
                </Text>
                <Text style={styles.usageLabel}>Data Used</Text>
              </View>
            </View>
            <Text style={styles.usageFooter}>
              All usage included in your monthly plan
            </Text>
          </View>

          {/* Billing History */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Billing History</Text>
            <View style={styles.billingHistory}>
              {billingHistory.map((bill, index) => (
                <View key={bill.id}>
                  <View style={styles.billingItem}>
                    <View style={styles.billingInfo}>
                      <Text style={styles.billingDescription}>{bill.description}</Text>
                      <Text style={styles.billingDate}>{formatDate(bill.date)}</Text>
                    </View>
                    <View style={styles.billingActions}>
                      <View style={styles.billingAmount}>
                        <Text style={styles.billingPrice}>
                          {bill.amount === 0 ? 'FREE' : `${bill.amount.toFixed(2)}`}
                        </Text>
                        <View style={styles.billingStatus}>
                          <Ionicons name="checkmark-circle" size={12} color={COLORS.green600} />
                          <Text style={[styles.billingStatusText, { color: COLORS.green600 }]}>Paid</Text>
                        </View>
                      </View>
                      <TouchableOpacity 
                        style={styles.receiptButton}
                        onPress={() => handleViewReceipt(bill)}
                      >
                        <Ionicons name="download" size={12} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {index < billingHistory.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>

          {/* Cancel Subscription */}
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setShowCancelModal(true)}
          >
            <Ionicons name="close-circle" size={16} color={COLORS.red600} />
            <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Questions about billing? Contact support
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Cancel Confirmation Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cancel Your Subscription</Text>
              <Text style={styles.modalDescription}>
                This will cancel your AlwaysON subscription. You can reactivate it anytime before your service ends.
              </Text>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.modalIcon}>
                <Ionicons name="close-circle" size={32} color={COLORS.red600} />
              </View>
              <Text style={styles.modalConfirmText}>
                Are you sure you want to cancel your AlwaysON subscription?
              </Text>

              <View style={[styles.modalInfoCard, { backgroundColor: COLORS.red50, borderColor: COLORS.red200 }]}>
                <Text style={[styles.modalInfoTitle, { color: COLORS.red800 }]}>
                  What happens when you cancel:
                </Text>
                <View style={styles.modalInfoList}>
                  <Text style={[styles.modalInfoItem, { color: COLORS.red700 }]}>
                    • Your backup protection will end on Jan 15, 2025
                  </Text>
                  <Text style={[styles.modalInfoItem, { color: COLORS.red700 }]}>
                    • You'll lose access to emergency connectivity
                  </Text>
                  <Text style={[styles.modalInfoItem, { color: COLORS.red700 }]}>
                    • No more charges will be made to your account
                  </Text>
                  <Text style={[styles.modalInfoItem, { color: COLORS.red700 }]}>
                    • You can reactivate anytime before your service ends
                  </Text>
                </View>
              </View>

              <View style={[styles.modalInfoCard, { backgroundColor: COLORS.blue50, borderColor: COLORS.blue200 }]}>
                <View style={styles.modalInfoHeader}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.blue600} />
                  <Text style={[styles.modalInfoTitle, { color: COLORS.blue800 }]}>
                    We'll miss you!
                  </Text>
                </View>
                <Text style={[styles.modalInfoDescription, { color: COLORS.blue700 }]}>
                  Your service will remain active until the end of your current billing period.
                </Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowCancelModal(false)}
                disabled={isCancelling}
              >
                <Text style={styles.modalButtonSecondaryText}>Keep Subscription</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary, isCancelling && styles.modalButtonDisabled]}
                onPress={handleCancelSubscription}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <View style={styles.modalButtonContent}>
                    <ActivityIndicator size="small" color={COLORS.white} />
                    <Text style={styles.modalButtonPrimaryText}>Cancelling...</Text>
                  </View>
                ) : (
                  <Text style={styles.modalButtonPrimaryText}>Yes, Cancel</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    marginRight: SPACING[4],
    padding: SPACING[1],
  },
  
  headerTitle: {
    fontSize: TYPOGRAPHY.xl,
    color: COLORS.textPrimary,
  },
  
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING[6],
    marginBottom: SPACING[6],
    ...SHADOWS.sm,
  },
  
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING[4],
  },
  
  planTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
  },
  
  planSubtitle: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
  },
  
  badge: {
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[1],
    borderRadius: RADIUS.md,
  },
  
  badgeText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium,
  },
  
  planDetails: {
    flexDirection: 'row',
    marginBottom: SPACING[4],
  },
  
  planDetailItem: {
    flex: 1,
  },
  
  planDetailLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING[1],
  },
  
  planDetailValue: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
  },
  
  promoCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING[3],
  },
  
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[1],
  },
  
  promoText: {
    fontSize: TYPOGRAPHY.sm,
    marginLeft: SPACING[2],
  },
  
  promoDescription: {
    fontSize: TYPOGRAPHY.xs,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING[4],
  },
  
  sectionTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
  },
  
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[2],
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    gap: SPACING[1],
  },
  
  manageButtonText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textPrimary,
  },
  
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  cardBrand: {
    width: 40,
    height: 24,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING[3],
  },
  
  cardBrandText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.bold,
  },
  
  cardDetails: {
    flex: 1,
  },
  
  cardNumber: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
  },
  
  cardExpiry: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textTertiary,
  },
  
  usageGrid: {
    flexDirection: 'row',
    marginVertical: SPACING[4],
  },
  
  usageItem: {
    flex: 1,
    alignItems: 'center',
  },
  
  usageValue: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.bold,
    marginBottom: SPACING[1],
  },
  
  usageLabel: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  
  usageFooter: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: SPACING[3],
  },
  
  billingHistory: {
    marginTop: SPACING[4],
  },
  
  billingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING[3],
  },
  
  billingInfo: {
    flex: 1,
  },
  
  billingDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
  },
  
  billingDate: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textTertiary,
  },
  
  billingActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  billingAmount: {
    alignItems: 'flex-end',
    marginRight: SPACING[3],
  },
  
  billingPrice: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
  },
  
  billingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING[1],
  },
  
  billingStatusText: {
    fontSize: TYPOGRAPHY.xs,
  },
  
  receiptButton: {
    padding: SPACING[2],
  },
  
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING[3],
  },
  
  cancelButton: {
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
  
  cancelButtonText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.red600,
  },
  
  footer: {
    alignItems: 'center',
    marginTop: SPACING[8],
  },
  
  footerText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textTertiary,
  },
  
  // Modal styles
  modalOverlay: {
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
  
  modalHeader: {
    padding: SPACING[6],
    paddingBottom: SPACING[4],
  },
  
  modalTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING[2],
  },
  
  modalDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.sm * 1.4,
  },
  
  modalContent: {
    paddingHorizontal: SPACING[6],
    paddingBottom: SPACING[4],
  },
  
  modalIcon: {
    alignItems: 'center',
    marginBottom: SPACING[4],
  },
  
  modalConfirmText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING[4],
  },
  
  modalInfoCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING[4],
    marginBottom: SPACING[4],
  },
  
  modalInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[2],
  },
  
  modalInfoTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium,
    marginLeft: SPACING[2],
  },
  
  modalInfoList: {
    gap: SPACING[1],
  },
  
  modalInfoItem: {
    fontSize: TYPOGRAPHY.sm,
  },
  
  modalInfoDescription: {
    fontSize: TYPOGRAPHY.xs,
    marginTop: SPACING[1],
  },
  
  modalActions: {
    flexDirection: 'row',
    padding: SPACING[6],
    gap: SPACING[3],
  },
  
  modalButton: {
    flex: 1,
    paddingVertical: SPACING[4],
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  modalButtonSecondary: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    backgroundColor: COLORS.white,
  },
  
  modalButtonPrimary: {
    backgroundColor: COLORS.red600,
  },
  
  modalButtonDisabled: {
    opacity: 0.5,
  },
  
  modalButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING[2],
  },
  
  modalButtonSecondaryText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
  },
  
  modalButtonPrimaryText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.medium,
  },
});