import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  Share,
} from 'react-native';
import { ArrowLeft, Download, Share as ShareIcon, CheckCircle, Calendar, CreditCard, User } from 'lucide-react-native';
import { theme } from '../constants/theme';

interface ReceiptScreenProps {
  onBack: () => void;
  receipt: {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: string;
    invoice: string;
    paymentMethod?: {
      type: string;
      last4: string;
    };
    billingPeriod?: {
      start: string;
      end: string;
    };
  };
  user: any;
}

export function ReceiptScreen({ onBack, receipt, user }: ReceiptScreenProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDownload = () => {
    Alert.alert(
      'Download Receipt',
      'Receipt download would start here in a real implementation.',
      [{ text: 'OK' }]
    );
  };

  const handleShare = async () => {
    try {
      const message = `AlwaysON Receipt\n${receipt.description}\nAmount: ${receipt.amount === 0 ? 'FREE' : `$${receipt.amount.toFixed(2)}`}\nDate: ${formatDate(receipt.date)}`;
      
      await Share.share({
        title: 'AlwaysON Receipt',
        message: message,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share receipt');
    }
  };

  const subtotal = receipt.amount;
  const tax = 0; // No tax for this service
  const total = subtotal + tax;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <ArrowLeft size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Receipt</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleShare} style={styles.headerActionButton}>
              <ShareIcon size={16} color={theme.colors.alwaysonBrand} />
              <Text style={styles.headerActionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDownload} style={styles.headerActionButton}>
              <Download size={16} color={theme.colors.alwaysonBrand} />
              <Text style={styles.headerActionText}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Receipt Card */}
        <View style={styles.receiptCard}>
          {/* Receipt Header */}
          <View style={styles.receiptHeader}>
            <View style={styles.receiptHeaderIcon}>
              <CheckCircle size={32} color="#fff" />
            </View>
            <Text style={styles.receiptHeaderTitle}>Payment Received</Text>
            <Text style={styles.receiptHeaderSubtitle}>Thank you for your payment</Text>
          </View>

          {/* Company Information */}
          <View style={styles.companyInfo}>
            <View style={styles.companyHeader}>
              <View style={styles.companyLogo}>
                <Text style={styles.companyLogoText}>A</Text>
              </View>
              <Text style={styles.companyName}>AlwaysON</Text>
            </View>
            <Text style={styles.companyDetails}>SIMO Holdings, Inc.</Text>
            <Text style={styles.companyContact}>hello@alwayson.com</Text>
          </View>

          <View style={styles.separator} />

          {/* Receipt Details */}
          <View style={styles.section}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Receipt Number</Text>
              <Text style={styles.detailValue}>{receipt.invoice}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Date</Text>
              <Text style={styles.detailValue}>{formatDate(receipt.date)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Status</Text>
              <View style={styles.statusBadge}>
                <CheckCircle size={12} color="#059669" />
                <Text style={styles.statusBadgeText}>Paid</Text>
              </View>
            </View>

            {receipt.paymentMethod && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Method</Text>
                <View style={styles.paymentMethod}>
                  <CreditCard size={16} color="#9ca3af" />
                  <Text style={styles.detailValue}>
                    •••• {receipt.paymentMethod.last4}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.separator} />

          {/* Billing Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={16} color="#6b7280" />
              <Text style={styles.sectionTitle}>Billing Information</Text>
            </View>
            <View style={styles.billingInfo}>
              <Text style={styles.billingName}>{user?.name || 'User Name'}</Text>
              <Text style={styles.billingDetail}>{user?.email || 'user@email.com'}</Text>
              {user?.phone && (
                <Text style={styles.billingDetail}>{user.phone}</Text>
              )}
            </View>
          </View>

          <View style={styles.separator} />

          {/* Service Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Details</Text>
            <View style={styles.serviceDetail}>
              <View style={styles.serviceLeft}>
                <Text style={styles.serviceName}>{receipt.description}</Text>
                {receipt.billingPeriod && (
                  <View style={styles.billingPeriod}>
                    <Calendar size={12} color="#9ca3af" />
                    <Text style={styles.billingPeriodText}>
                      {formatShortDate(receipt.billingPeriod.start)} - {formatShortDate(receipt.billingPeriod.end)}
                    </Text>
                  </View>
                )}
                {receipt.amount === 0 && (
                  <View style={styles.promoBadge}>
                    <Text style={styles.promoBadgeText}>Promotional Offer Applied</Text>
                  </View>
                )}
              </View>
              <Text style={styles.serviceAmount}>
                {receipt.amount === 0 ? 'FREE' : `$${receipt.amount.toFixed(2)}`}
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          {/* Payment Summary */}
          <View style={styles.section}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{subtotal === 0 ? 'FREE' : `$${subtotal.toFixed(2)}`}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>$0.00</Text>
            </View>
            
            <View style={styles.separator} />
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {total === 0 ? 'FREE' : `$${total.toFixed(2)}`}
              </Text>
            </View>
          </View>

          {receipt.amount === 0 && (
            <View style={styles.promoNotice}>
              <CheckCircle size={20} color="#059669" />
              <View style={styles.promoNoticeContent}>
                <Text style={styles.promoNoticeTitle}>First Month Free Applied</Text>
                <Text style={styles.promoNoticeText}>
                  You saved $10.00 with your promotional offer. Regular billing will begin next month.
                </Text>
              </View>
            </View>
          )}

          {/* Footer Information */}
          <View style={styles.receiptFooter}>
            <Text style={styles.footerText}>
              This is an electronic receipt for your records.
            </Text>
            <Text style={styles.footerContact}>
              Questions about this payment? Contact us at hello@alwayson.com
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={handleDownload} style={styles.downloadButton}>
            <Download size={16} color={theme.colors.alwaysonBrand} />
            <Text style={styles.downloadButtonText}>Download PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <ShareIcon size={16} color="#fff" />
            <Text style={styles.shareButtonText}>Share Receipt</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerInfo}>
            Receipt #{receipt.invoice} • Generated on {formatShortDate(new Date().toISOString())}
          </Text>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  headerActionText: {
    fontSize: 12,
    color: theme.colors.alwaysonBrand,
  },
  receiptCard: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  receiptHeader: {
    backgroundColor: theme.colors.alwaysonBrand,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  receiptHeaderIcon: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptHeaderTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  receiptHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  companyInfo: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  companyLogo: {
    width: 32,
    height: 32,
    backgroundColor: theme.colors.alwaysonBrand,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyLogoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  companyName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  companyDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  companyContact: {
    fontSize: 12,
    color: '#9ca3af',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 24,
    marginVertical: 12,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    color: '#065f46',
    fontWeight: '500',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  billingInfo: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  billingName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  billingDetail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  serviceDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceLeft: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  billingPeriod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  billingPeriodText: {
    fontSize: 12,
    color: '#6b7280',
  },
  promoBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  promoBadgeText: {
    fontSize: 11,
    color: '#065f46',
    fontWeight: '500',
  },
  serviceAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#000',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.alwaysonBrand,
  },
  promoNotice: {
    flexDirection: 'row',
    backgroundColor: '#d1fae5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    margin: 24,
    gap: 12,
  },
  promoNoticeContent: {
    flex: 1,
  },
  promoNoticeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#065f46',
    marginBottom: 4,
  },
  promoNoticeText: {
    fontSize: 12,
    color: '#047857',
  },
  receiptFooter: {
    backgroundColor: '#f9fafb',
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  footerContact: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 16,
    color: theme.colors.alwaysonBrand,
    fontWeight: '500',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.alwaysonBrand,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerInfo: {
    fontSize: 12,
    color: '#9ca3af',
  },
});