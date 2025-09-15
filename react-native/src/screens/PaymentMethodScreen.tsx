import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { ArrowLeft, CreditCard, Plus, Trash2, Shield, AlertCircle } from 'lucide-react-native';
import { theme } from '../constants/theme';

interface PaymentMethodScreenProps {
  onBack: () => void;
  currentPaymentMethod: {
    type: string;
    last4: string;
    expiry: string;
  };
  onPaymentMethodUpdate: (method: any) => void;
}

export function PaymentMethodScreen({ onBack, currentPaymentMethod, onPaymentMethodUpdate }: PaymentMethodScreenProps) {
  const [savedMethods, setSavedMethods] = useState([
    {
      id: 1,
      type: 'visa',
      last4: '4242',
      expiry: '12/27',
      isDefault: true,
      holderName: 'John Doe'
    },
    {
      id: 2,
      type: 'mastercard',
      last4: '8888',
      expiry: '09/26',
      isDefault: false,
      holderName: 'John Doe'
    }
  ]);

  const [showAddCard, setShowAddCard] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    holderName: '',
    billingZip: ''
  });

  const getCardIcon = (type: string) => {
    const iconStyle = [styles.cardIcon];
    const textStyle = [styles.cardIconText];
    
    switch (type) {
      case 'visa':
        return (
          <View style={[iconStyle, { backgroundColor: '#1e40af' }]}>
            <Text style={textStyle}>VISA</Text>
          </View>
        );
      case 'mastercard':
        return (
          <View style={[iconStyle, { backgroundColor: '#dc2626' }]}>
            <Text style={textStyle}>MC</Text>
          </View>
        );
      case 'amex':
        return (
          <View style={[iconStyle, { backgroundColor: '#059669' }]}>
            <Text style={textStyle}>AMEX</Text>
          </View>
        );
      default:
        return <CreditCard size={32} color="#9ca3af" />;
    }
  };

  const handleSetDefault = (methodId: number) => {
    setSavedMethods(prev => prev.map(method => ({
      ...method,
      isDefault: method.id === methodId
    })));
    
    const newDefault = savedMethods.find(m => m.id === methodId);
    if (newDefault) {
      onPaymentMethodUpdate(newDefault);
    }
  };

  const handleDeleteMethod = (methodId: number) => {
    setSavedMethods(prev => {
      const remaining = prev.filter(method => method.id !== methodId);
      // If we deleted the default method, make the first remaining method default
      if (remaining.length > 0 && !remaining.some(m => m.isDefault)) {
        remaining[0].isDefault = true;
        onPaymentMethodUpdate(remaining[0]);
      }
      return remaining;
    });
    setShowDeleteConfirm(null);
  };

  const handleAddCard = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newMethod = {
      id: Date.now(),
      type: newCard.cardNumber.startsWith('4') ? 'visa' : 'mastercard',
      last4: newCard.cardNumber.slice(-4),
      expiry: newCard.expiry,
      isDefault: savedMethods.length === 0,
      holderName: newCard.holderName
    };
    
    setSavedMethods(prev => [...prev, newMethod]);
    
    if (newMethod.isDefault) {
      onPaymentMethodUpdate(newMethod);
    }
    
    setNewCard({
      cardNumber: '',
      expiry: '',
      cvv: '',
      holderName: '',
      billingZip: ''
    });
    
    setIsProcessing(false);
    setShowAddCard(false);
  };

  const formatCardNumber = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const formattedValue = cleanValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formattedValue.slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length >= 2) {
      return cleanValue.slice(0, 2) + '/' + cleanValue.slice(2, 4);
    }
    return cleanValue;
  };

  const showDeleteAlert = (methodId: number) => {
    Alert.alert(
      'Remove Payment Method',
      'This payment method will be permanently removed from your account.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => handleDeleteMethod(methodId),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Methods</Text>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Shield size={20} color="#2563eb" />
          <View style={styles.securityNoticeContent}>
            <Text style={styles.securityNoticeTitle}>Secure Payment Processing</Text>
            <Text style={styles.securityNoticeText}>
              All payment information is encrypted and processed securely through PayPal. We never store your full card details.
            </Text>
          </View>
        </View>

        {/* Default Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Default Payment Method</Text>
          {savedMethods.filter(method => method.isDefault).map(method => (
            <View key={method.id} style={styles.defaultCard}>
              <View style={styles.cardContent}>
                {getCardIcon(method.type)}
                <View style={styles.cardDetails}>
                  <Text style={styles.cardNumber}>•••• •••• •••• {method.last4}</Text>
                  <Text style={styles.cardMeta}>Expires {method.expiry} • {method.holderName}</Text>
                </View>
              </View>
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Default</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Saved Payment Methods */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
            <TouchableOpacity
              onPress={() => setShowAddCard(true)}
              style={styles.addButton}
            >
              <Plus size={16} color={theme.colors.alwaysonBrand} />
              <Text style={styles.addButtonText}>Add Card</Text>
            </TouchableOpacity>
          </View>

          {savedMethods.map(method => (
            <View key={method.id} style={styles.card}>
              <View style={styles.cardContent}>
                {getCardIcon(method.type)}
                <View style={styles.cardDetails}>
                  <Text style={styles.cardNumber}>•••• •••• •••• {method.last4}</Text>
                  <Text style={styles.cardMeta}>Expires {method.expiry} • {method.holderName}</Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                {!method.isDefault && (
                  <TouchableOpacity
                    onPress={() => handleSetDefault(method.id)}
                    style={styles.makeDefaultButton}
                  >
                    <Text style={styles.makeDefaultButtonText}>Make Default</Text>
                  </TouchableOpacity>
                )}
                {savedMethods.length > 1 && (
                  <TouchableOpacity
                    onPress={() => showDeleteAlert(method.id)}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={16} color="#dc2626" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Need help with payments? Contact support</Text>
        </View>
      </ScrollView>

      {/* Add Card Modal */}
      <Modal visible={showAddCard} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Payment Method</Text>
            <Text style={styles.modalDescription}>
              Add a new credit or debit card to your account. All information is securely encrypted.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                value={newCard.cardNumber}
                onChangeText={(text) => setNewCard(prev => ({ 
                  ...prev, 
                  cardNumber: formatCardNumber(text)
                }))}
                maxLength={19}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Expiry</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  value={newCard.expiry}
                  onChangeText={(text) => setNewCard(prev => ({ 
                    ...prev, 
                    expiry: formatExpiry(text)
                  }))}
                  maxLength={5}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  value={newCard.cvv}
                  onChangeText={(text) => setNewCard(prev => ({ 
                    ...prev, 
                    cvv: text.replace(/\D/g, '').slice(0, 4)
                  }))}
                  maxLength={4}
                  keyboardType="numeric"
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                value={newCard.holderName}
                onChangeText={(text) => setNewCard(prev => ({ 
                  ...prev, 
                  holderName: text
                }))}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Billing ZIP Code</Text>
              <TextInput
                style={styles.input}
                placeholder="12345"
                value={newCard.billingZip}
                onChangeText={(text) => setNewCard(prev => ({ 
                  ...prev, 
                  billingZip: text.replace(/\D/g, '').slice(0, 5)
                }))}
                maxLength={5}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.securityInfo}>
              <Shield size={16} color="#059669" />
              <Text style={styles.securityInfoText}>
                Your payment information is encrypted and processed securely. We use industry-standard SSL encryption.
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setShowAddCard(false)}
                style={styles.cancelButton}
                disabled={isProcessing}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddCard}
                style={[
                  styles.confirmButton,
                  (!newCard.cardNumber || !newCard.expiry || !newCard.cvv || !newCard.holderName || isProcessing) && 
                  styles.confirmButtonDisabled
                ]}
                disabled={isProcessing || !newCard.cardNumber || !newCard.expiry || !newCard.cvv || !newCard.holderName}
              >
                <Text style={styles.confirmButtonText}>
                  {isProcessing ? 'Adding...' : 'Add Card'}
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
  securityNotice: {
    flexDirection: 'row',
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    margin: 24,
    gap: 12,
  },
  securityNoticeContent: {
    flex: 1,
  },
  securityNoticeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e40af',
    marginBottom: 4,
  },
  securityNoticeText: {
    fontSize: 12,
    color: '#1d4ed8',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: theme.colors.alwaysonBrand,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    color: theme.colors.alwaysonBrand,
    fontWeight: '500',
  },
  defaultCard: {
    backgroundColor: '#fff',
    borderColor: theme.colors.alwaysonBrand,
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  cardIcon: {
    width: 32,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardDetails: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  cardMeta: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: '#fed7aa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: '#ea580c',
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  makeDefaultButton: {
    borderColor: '#6b7280',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  makeDefaultButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  deleteButton: {
    padding: 6,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
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
    maxHeight: '90%',
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
  inputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  securityInfo: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    gap: 8,
    marginBottom: 24,
  },
  securityInfoText: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
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