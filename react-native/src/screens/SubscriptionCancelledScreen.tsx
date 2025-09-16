import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { ArrowLeft, XCircle, RefreshCw, Heart, Shield, Zap, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { theme } from '../constants/theme';

interface SubscriptionCancelledScreenProps {
  onBack: () => void;
  onResubscribe: () => void;
  onNavigate: (screen: string) => void;
  user: any;
  cancellationDate: string;
  billingPeriodEnd: string;
}

export function SubscriptionCancelledScreen({ 
  onBack, 
  onResubscribe, 
  onNavigate,
  user, 
  cancellationDate, 
  billingPeriodEnd 
}: SubscriptionCancelledScreenProps) {
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleReactivate = async () => {
    setIsReactivating(true);
    
    // Simulate reactivation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsReactivating(false);
    setShowReactivateModal(false);
    onResubscribe();
  };

  const daysUntilExpiry = Math.ceil((new Date(billingPeriodEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = daysUntilExpiry <= 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Subscription Status</Text>
        </View>

        {/* Cancellation Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIcon}>
              <XCircle size={32} color="#ea580c" />
            </View>
            <Text style={styles.statusTitle}>Subscription Cancelled</Text>
            <Text style={styles.statusSubtitle}>We're sorry to see you go!</Text>
          </View>

          <View style={styles.statusDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cancellation Date</Text>
              <Text style={styles.detailValue}>{formatDate(cancellationDate)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Service Ends</Text>
              <Text style={styles.detailValue}>{formatDate(billingPeriodEnd)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <View style={[styles.statusBadge, isExpired ? styles.expiredBadge : styles.activeBadge]}>
                <Text style={[styles.statusBadgeText, isExpired ? styles.expiredBadgeText : styles.activeBadgeText]}>
                  {isExpired ? 'Expired' : `${daysUntilExpiry} days remaining`}
                </Text>
              </View>
            </View>
          </View>

          {!isExpired && (
            <View style={styles.warningNotice}>
              <AlertTriangle size={16} color="#ea580c" />
              <Text style={styles.warningNoticeText}>
                Your service is still active until {formatDate(billingPeriodEnd)}. You can continue using AlwaysON backup until then.
              </Text>
            </View>
          )}

          {isExpired && (
            <View style={styles.expiredNotice}>
              <XCircle size={16} color="#dc2626" />
              <Text style={styles.expiredNoticeText}>
                Your AlwaysON backup service has expired. Reactivate your subscription to restore protection.
              </Text>
            </View>
          )}
        </View>

        {/* What You're Missing */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Heart size={20} color="#ef4444" />
            <Text style={styles.sectionTitle}>What You're Missing Out On</Text>
          </View>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#dbeafe' }]}>
                <Shield size={16} color="#2563eb" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Automatic Backup Protection</Text>
                <Text style={styles.featureDescription}>Stay connected even when your primary network fails</Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#dcfce7' }]}>
                <Zap size={16} color="#16a34a" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Instant Emergency Access</Text>
                <Text style={styles.featureDescription}>Critical connectivity when you need it most</Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#f3e8ff' }]}>
                <RefreshCw size={16} color="#9333ea" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Multi-Carrier Network</Text>
                <Text style={styles.featureDescription}>Access to premium carrier networks nationwide</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Reactivation Offer */}
        <View style={styles.offerCard}>
          <View style={styles.offerHeader}>
            <Text style={styles.offerTitle}>Ready to Come Back?</Text>
            <Text style={styles.offerDescription}>
              Reactivate your subscription and restore your backup protection instantly.
            </Text>
          </View>

          <View style={styles.planDetails}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>AlwaysON Monthly Plan</Text>
              <Text style={styles.planPrice}>$10.00/month</Text>
            </View>
            <View style={styles.planFeatures}>
              <View style={styles.planFeature}>
                <CheckCircle size={16} color="#16a34a" />
                <Text style={styles.planFeatureText}>Unlimited backup data</Text>
              </View>
              <View style={styles.planFeature}>
                <CheckCircle size={16} color="#16a34a" />
                <Text style={styles.planFeatureText}>Multi-carrier network access</Text>
              </View>
              <View style={styles.planFeature}>
                <CheckCircle size={16} color="#16a34a" />
                <Text style={styles.planFeatureText}>24/7 emergency connectivity</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            onPress={() => setShowReactivateModal(true)}
            style={styles.reactivateButton}
          >
            <RefreshCw size={16} color="#fff" />
            <Text style={styles.reactivateButtonText}>Reactivate Subscription</Text>
          </TouchableOpacity>
        </View>

        {/* Feedback Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Help Us Improve</Text>
          <Text style={styles.feedbackDescription}>
            We'd love to hear why you cancelled. Your feedback helps us make AlwaysON better for everyone.
          </Text>
          <TouchableOpacity 
            onPress={() => onNavigate('share-feedback')}
            style={styles.feedbackButton}
          >
            <Text style={styles.feedbackButtonText}>Share Feedback</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Need help? Contact us at hello@alwayson.com</Text>
        </View>
      </ScrollView>

      {/* Reactivation Modal */}
      <Modal visible={showReactivateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reactivate Your Subscription</Text>
            <Text style={styles.modalDescription}>
              Restore your AlwaysON backup protection and resume your monthly billing.
            </Text>

            <View style={styles.reactivateInfo}>
              <View style={styles.reactivateIcon}>
                <RefreshCw size={32} color="#16a34a" />
              </View>
              <Text style={styles.reactivateText}>
                Welcome back! Your subscription will be reactivated immediately and billing will resume.
              </Text>
            </View>

            <View style={styles.billingInfo}>
              <View style={styles.billingRow}>
                <Text style={styles.billingLabel}>Monthly Subscription</Text>
                <Text style={styles.billingValue}>$10.00</Text>
              </View>
              <View style={styles.billingRow}>
                <Text style={styles.billingLabel}>Next Billing Date</Text>
                <Text style={styles.billingValue}>{formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())}</Text>
              </View>
            </View>

            <View style={styles.protectionNotice}>
              <Shield size={16} color="#2563eb" />
              <Text style={styles.protectionNoticeText}>
                Your backup protection will be restored immediately upon reactivation.
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                onPress={() => setShowReactivateModal(false)}
                style={styles.cancelButton}
                disabled={isReactivating}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleReactivate}
                style={[styles.confirmButton, isReactivating && styles.confirmButtonDisabled]}
                disabled={isReactivating}
              >
                <Text style={styles.confirmButtonText}>
                  {isReactivating ? 'Reactivating...' : 'Confirm Reactivation'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
  },
  statusCard: {
    backgroundColor: '#fef3e2',
    borderColor: '#fed7aa',
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  statusHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#fed7aa',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#fed7aa',
  },
  expiredBadge: {
    backgroundColor: '#fecaca',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeBadgeText: {
    color: '#ea580c',
  },
  expiredBadgeText: {
    color: '#dc2626',
  },
  warningNotice: {
    flexDirection: 'row',
    backgroundColor: '#fed7aa',
    borderColor: '#fdba74',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  warningNoticeText: {
    flex: 1,
    fontSize: 14,
    color: '#c2410c',
  },
  expiredNotice: {
    flexDirection: 'row',
    backgroundColor: '#fecaca',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  expiredNoticeText: {
    flex: 1,
    fontSize: 14,
    color: '#b91c1c',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  featureList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  offerCard: {
    backgroundColor: '#fef3e2',
    borderColor: '#fed7aa',
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  offerHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  offerDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  planDetails: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.alwaysonBrand,
  },
  planFeatures: {
    gap: 8,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planFeatureText: {
    fontSize: 14,
    color: '#6b7280',
  },
  reactivateButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.alwaysonBrand,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  reactivateButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  feedbackDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  feedbackButton: {
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  feedbackButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  reactivateInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  reactivateIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#dcfce7',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  reactivateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  billingInfo: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billingLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  billingValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  protectionNotice: {
    flexDirection: 'row',
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 8,
    marginBottom: 24,
  },
  protectionNoticeText: {
    flex: 1,
    fontSize: 12,
    color: '#1e40af',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: theme.colors.alwaysonBrand,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});