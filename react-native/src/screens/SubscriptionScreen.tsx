import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, BRAND_COLOR, SHADOWS } from '../constants/theme';
import { AlwaysONNative } from '../services/AlwaysONNative';

interface SubscriptionScreenProps {
  navigation: any;
  route: any;
}

interface FormData {
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  name: string;
}

export function SubscriptionScreen({ navigation, route }: SubscriptionScreenProps) {
  const { onSubscribe, onBack, userCountry } = route.params || {};
  
  const [step, setStep] = useState(1); // 1: plan, 2: payment, 3: processing
  const [activationStep, setActivationStep] = useState(0); // 0: connecting, 1: downloading, 2: installing, 3: finished
  const [formData, setFormData] = useState<FormData>({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [primaryCarrier, setPrimaryCarrier] = useState('');
  const [carrierConfirmed, setCarrierConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'paypal'
  const [emailError, setEmailError] = useState('');
  const [activationError, setActivationError] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);
  const [isDetectingCarrier, setIsDetectingCarrier] = useState(false);

  const activationMessages = [
    'Contacting AlwaysON server',
    'Downloading AlwaysON eSIM Profile', 
    'Installing AlwaysON eSIM Profile',
    'Finished'
  ];

  const activationProgress = [25, 50, 75, 100];

  // Get carriers based on country
  const getCarriersByCountry = (country: string) => {
    const carriersByCountry: { [key: string]: string[] } = {
      'United States': [
        'Verizon', 'AT&T', 'T-Mobile USA', 'Sprint', 'Mint Mobile', 'Cricket Wireless', 
        'Boost Mobile', 'Metro by T-Mobile', 'Straight Talk', 'TracFone'
      ],
      'Canada': [
        'Rogers', 'Bell', 'Telus', 'Freedom Mobile', 'Videotron', 'Sasktel', 
        'Eastlink', 'Tbaytel', 'Koodo Mobile', 'Fido'
      ],
      'United Kingdom': [
        'EE', 'O2', 'Vodafone', 'Three', 'Tesco Mobile', 'Giffgaff', 
        'SMARTY', 'Lebara', 'Sky Mobile', 'iD Mobile'
      ],
      'Australia': [
        'Telstra', 'Optus', 'Vodafone Australia', 'Boost Mobile', 'Belong', 
        'Aldi Mobile', 'Woolworths Mobile', 'amaysim', 'Kogan Mobile', 'TPG'
      ],
      'Germany': ['Deutsche Telekom', 'Vodafone Germany', 'Telefónica Germany (O2)', 'Drillisch'],
      'France': ['Orange France', 'SFR', 'Bouygues Telecom', 'Free Mobile'],
      'Italy': ['TIM', 'Vodafone Italy', 'WindTre', 'Iliad Italy'],
      'Spain': ['Movistar', 'Vodafone Spain', 'Orange Spain', 'MásMóvil'],
      'Netherlands': ['KPN', 'VodafoneZiggo', 'T-Mobile Netherlands', 'Tele2'],
      'default_eu': ['Vodafone', 'Orange', 'T-Mobile', 'Three']
    };

    if (carriersByCountry[country]) {
      return carriersByCountry[country];
    }
    
    const euCountries = [
      'Belgium', 'Austria', 'Portugal', 'Sweden', 'Denmark', 'Finland', 'Ireland', 
      'Luxembourg', 'Czech Republic', 'Poland', 'Hungary', 'Slovakia', 'Slovenia', 
      'Croatia', 'Romania', 'Bulgaria', 'Estonia', 'Latvia', 'Lithuania', 'Malta', 
      'Cyprus', 'Greece'
    ];
    
    if (euCountries.includes(country)) {
      return carriersByCountry.default_eu;
    }
    
    return ['Local Carrier', 'Mobile Network', 'Telecom Provider'];
  };

  // Detect carrier from native SIM info
  useEffect(() => {
    if (step === 2 && userCountry) {
      detectCarrier();
    }
  }, [step, userCountry]);

  const detectCarrier = async () => {
    setIsDetectingCarrier(true);
    try {
      // Try to get real SIM info from device
      const simInfo = await AlwaysONNative.getCurrentSIMInfo();
      
      if (simInfo && simInfo.carrier) {
        setPrimaryCarrier(simInfo.carrier);
      } else {
        // Fallback to simulated detection based on country
        await new Promise(resolve => setTimeout(resolve, 1000));
        const carriers = getCarriersByCountry(userCountry);
        const detectedCarrier = carriers[Math.floor(Math.random() * carriers.length)];
        setPrimaryCarrier(detectedCarrier);
      }
    } catch (error) {
      console.error('Error detecting carrier:', error);
      // Fallback to simulated detection
      const carriers = getCarriersByCountry(userCountry);
      const detectedCarrier = carriers[Math.floor(Math.random() * carriers.length)];
      setPrimaryCarrier(detectedCarrier);
    } finally {
      setIsDetectingCarrier(false);
    }
  };

  // Handle activation process
  useEffect(() => {
    if (step === 3 && !activationError) {
      let timeout: NodeJS.Timeout;

      if (activationStep === 0) {
        timeout = setTimeout(async () => {
          // Simulate server connection
          if (Math.random() < 0.05) {
            setActivationError('server-unavailable');
            return;
          }
          setActivationStep(1);
        }, 2000);
      } else if (activationStep === 1) {
        timeout = setTimeout(async () => {
          // Simulate download
          const random = Math.random();
          if (random < 0.05) {
            setActivationError('download-connection-lost');
            return;
          } else if (random < 0.08) {
            setActivationError('server-unavailable');
            return;
          }
          setActivationStep(2);
        }, 2000);
      } else if (activationStep === 2) {
        timeout = setTimeout(async () => {
          // Try real eSIM installation
          try {
            const esimSupported = await AlwaysONNative.isESIMSupported();
            if (!esimSupported) {
              setActivationError('esim-not-available');
              return;
            }

            // Simulate eSIM profile URL - in real app this would come from your backend
            const esimProfileURL = 'https://example.com/esim-profile-qr-code';
            const result = await AlwaysONNative.installESIMProfile(esimProfileURL);
            
            if (!result.success) {
              // Handle specific eSIM errors
              if (result.message.includes('full') || result.message.includes('storage')) {
                setActivationError('esim-full');
              } else {
                setActivationError('esim-not-available');
              }
              return;
            }
            
            setActivationStep(3);
          } catch (error) {
            console.error('eSIM installation error:', error);
            // Simulate installation errors for demo
            const random = Math.random();
            if (random < 0.04) {
              setActivationError('esim-full');
              return;
            } else if (random < 0.08) {
              setActivationError('esim-not-available');
              return;
            }
            setActivationStep(3);
          }
        }, 2000);
      } else if (activationStep === 3) {
        timeout = setTimeout(() => {
          if (onSubscribe) {
            onSubscribe({
              email: formData.email,
              name: formData.name,
              plan: 'AlwaysON',
              primaryCarrier: primaryCarrier,
              country: userCountry || 'Unknown',
              subscriptionDate: new Date().toISOString(),
              paymentMethod: paymentMethod
            });
          }
        }, 2000);
      }
      
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }
  }, [step, activationStep, activationError, onSubscribe, formData, primaryCarrier, userCountry, paymentMethod]);

  // Listen for developer control panel activation errors
  useEffect(() => {
    const handleActivationError = (event: any) => {
      if (step === 3) {
        setActivationError(event.detail.errorType);
        setActivationStep(0); // Reset step to show error immediately
      }
    };

    window.addEventListener('triggerActivationError', handleActivationError);
    return () => window.removeEventListener('triggerActivationError', handleActivationError);
  }, [step]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'email') {
      setEmailError('');
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePlanSelect = () => {
    setStep(2);
  };

  const handlePayment = () => {
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    if (paymentMethod === 'paypal') {
      // In a real app, you'd implement PayPal flow here
      Alert.alert(
        'PayPal Integration',
        'PayPal payment flow would be implemented here with native PayPal SDK.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => startActivation() }
        ]
      );
    } else {
      startActivation();
    }
  };

  const startActivation = () => {
    setStep(3);
    setActivationStep(0);
  };

  const handleRetryActivation = () => {
    setIsRetrying(true);
    setActivationError('');
    setActivationStep(0);
    
    setTimeout(() => {
      setIsRetrying(false);
    }, 500);
  };

  const handleRetryLater = () => {
    setStep(2);
    setActivationError('');
    setActivationStep(0);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  if (step === 3) {
    // Show error state if there's an activation error
    if (activationError) {
      const getErrorDetails = () => {
        switch (activationError) {
          case 'download-connection-lost':
            return {
              title: 'Internet Connection Lost',
              message: 'Internet is not available to download AlwaysON eSIM. Please check your connection and try again later.',
              icon: '📡',
              color: 'orange'
            };
          case 'server-unavailable':
            return {
              title: 'Server Unavailable',
              message: 'AlwaysON servers are temporarily unavailable. Please try again in a few moments.',
              icon: '🔧',
              color: 'red'
            };
          case 'esim-full':
            return {
              title: 'eSIM Storage Full',
              message: 'Your device\'s eSIM storage is full. Please remove an unused eSIM profile and try again.',
              icon: '💾',
              color: 'yellow'
            };
          case 'esim-not-available':
            return {
              title: 'eSIM Not Available',
              message: 'eSIM functionality is not available on your device. Please check your device settings and try again.',
              icon: '📱',
              color: 'red'
            };
          default:
            return {
              title: 'Setup Failed',
              message: 'An unexpected error occurred during setup. Please try again.',
              icon: '⚠️',
              color: 'red'
            };
        }
      };

      const errorDetails = getErrorDetails();
      const canRetryLater = activationError === 'server-unavailable' || activationError === 'download-connection-lost';

      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>{errorDetails.icon}</Text>
          <Text style={styles.errorTitle}>{errorDetails.title}</Text>
          <Text style={styles.errorMessage}>{errorDetails.message}</Text>
          
          <View style={styles.errorButtons}>
            <TouchableOpacity 
              style={[styles.primaryButton, isRetrying && styles.disabledButton]}
              onPress={handleRetryActivation}
              disabled={isRetrying}
            >
              <Text style={styles.primaryButtonText}>
                {isRetrying ? 'Retrying...' : 'Try Again'}
              </Text>
            </TouchableOpacity>
            
            {canRetryLater && (
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={handleRetryLater}
              >
                <Text style={styles.secondaryButtonText}>Try Again Later</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.ghostButton}
              onPress={() => setStep(2)}
            >
              <Text style={styles.ghostButtonText}>Back to Payment</Text>
            </TouchableOpacity>
          </View>

          {activationError === 'download-connection-lost' && (
            <View style={[styles.helpCard, { backgroundColor: COLORS.orange50, borderColor: COLORS.orange500 }]}>
              <Text style={[styles.helpText, { color: COLORS.orange700 }]}>
                <Text style={styles.helpTextBold}>Note:</Text> eSIM download requires a stable internet connection. Connect to Wi-Fi or check your cellular signal.
              </Text>
            </View>
          )}

          {activationError === 'esim-full' && (
            <View style={[styles.helpCard, { backgroundColor: COLORS.yellow50, borderColor: COLORS.yellow500 }]}>
              <Text style={[styles.helpText, { color: COLORS.yellow700 }]}>
                <Text style={styles.helpTextBold}>How to free space:</Text> Go to Settings → Cellular → Remove unused eSIM profiles
              </Text>
            </View>
          )}
        </View>
      );
    }

    // Normal activation flow
    const isFinished = activationStep === 3;
    return (
      <View style={styles.activationContainer}>
        <View style={[
          styles.activationIcon,
          { backgroundColor: isFinished ? COLORS.green100 : BRAND_COLOR + '20' }
        ]}>
          <Ionicons 
            name="checkmark" 
            size={40} 
            color={isFinished ? COLORS.green600 : BRAND_COLOR} 
          />
        </View>
        <Text style={styles.activationTitle}>Setting up your backup...</Text>
        <Text style={styles.activationMessage}>{activationMessages[activationStep]}</Text>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${activationProgress[activationStep]}%`,
                backgroundColor: BRAND_COLOR 
              }
            ]}
          />
        </View>
        
        <Text style={styles.activationSubtext}>
          {isFinished ? 'Redirecting to your dashboard...' : 'This may take a few minutes...'}
        </Text>
        
        {!isFinished && (
          <View style={[styles.helpCard, { backgroundColor: COLORS.blue50, borderColor: COLORS.blue500 }]}>
            <Text style={[styles.helpText, { color: COLORS.blue700 }]}>
              <Text style={styles.helpTextBold}>Keep your primary connection turned on</Text> during this process for proper eSIM installation
            </Text>
          </View>
        )}
        
        {paymentMethod === 'paypal' && (
          <View style={[styles.helpCard, { backgroundColor: COLORS.green50, borderColor: COLORS.green500 }]}>
            <Text style={[styles.helpText, { color: COLORS.green700 }]}>
              <Text style={styles.helpTextBold}>✓ PayPal payment method linked successfully</Text>
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Subscribe to AlwaysON</Text>
        </View>

        {step === 1 && (
          <>
            {/* Plan Card */}
            <View style={[styles.planCard, { borderColor: BRAND_COLOR, backgroundColor: BRAND_COLOR + '10' }]}>
              <View style={styles.planHeader}>
                <View style={[styles.promoBadge, { backgroundColor: BRAND_COLOR }]}>
                  <Text style={styles.promoBadgeText}>🎉 First Month FREE</Text>
                </View>
                <Text style={styles.planTitle}>AlwaysON</Text>
                <View style={styles.planPricing}>
                  <Text style={styles.planPrice}>$10</Text>
                  <Text style={styles.planPeriod}>/month</Text>
                </View>
                <Text style={styles.planSubtext}>Cancel anytime</Text>
                <Text style={styles.planDescription}>Unlimited backup connectivity</Text>
              </View>

              <View style={styles.featuresList}>
                <FeatureItem text="Automatic Provisioning using eSIM" />
                <FeatureItem text="Unlimited backup data when your carrier is not available" />
                <FeatureItem text="Backup on alternative local carriers as available" />
                <FeatureItem text="Data connectivity only (no voice or SMS)" />
                <FeatureItem text="24/7 support" />
              </View>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handlePlanSelect}>
              <Text style={styles.primaryButtonText}>Subscribe to AlwaysON</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            {/* Location & Carrier Detection */}
            <View style={[styles.infoCard, { backgroundColor: COLORS.blue50, borderColor: COLORS.blue500 }]}>
              {/* Location Detection */}
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>🌍</Text>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoTitle, { color: COLORS.blue900 }]}>Location Detected</Text>
                  <Text style={[styles.infoText, { color: COLORS.blue700 }]}>
                    Your location: <Text style={styles.infoTextBold}>{userCountry || 'Detecting...'}</Text>
                  </Text>
                </View>
              </View>
              
              {/* Primary Carrier Detection */}
              <View style={styles.infoRow}>
                <Ionicons name="phone-portrait" size={20} color={COLORS.blue600} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoTitle, { color: COLORS.blue900 }]}>Primary Carrier Detected</Text>
                  {isDetectingCarrier ? (
                    <Text style={[styles.infoText, { color: COLORS.blue700 }]}>Reading SIM card information...</Text>
                  ) : primaryCarrier ? (
                    <View>
                      <Text style={[styles.infoText, { color: COLORS.blue700 }]}>
                        Your device's SIM card: <Text style={styles.infoTextBold}>{primaryCarrier}</Text>
                      </Text>
                      <View style={styles.checkboxRow}>
                        <TouchableOpacity 
                          style={styles.checkbox}
                          onPress={() => setCarrierConfirmed(!carrierConfirmed)}
                        >
                          {carrierConfirmed && (
                            <Ionicons name="checkmark" size={16} color={COLORS.white} />
                          )}
                        </TouchableOpacity>
                        <Text style={[styles.checkboxLabel, { color: COLORS.blue700 }]}>
                          I confirm that I want to backup <Text style={styles.infoTextBold}>{primaryCarrier}</Text> with AlwaysON
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <Text style={[styles.infoText, { color: COLORS.blue700 }]}>Reading SIM card information...</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Account Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Information</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={[styles.textInput, emailError && styles.inputError]}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {emailError && <Text style={styles.errorText}>{emailError}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="John Doe"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                />
              </View>
            </View>

            {/* Payment Method */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              
              <View style={[styles.infoCard, { backgroundColor: COLORS.green50, borderColor: COLORS.green500 }]}>
                <View style={styles.infoRowSimple}>
                  <Ionicons name="shield-checkmark" size={16} color={COLORS.green600} />
                  <Text style={[styles.infoText, { color: COLORS.green700 }]}>
                    <Text style={styles.infoTextBold}>You won't be charged today.</Text> We'll securely store your payment method for billing after your free month ends.
                  </Text>
                </View>
              </View>

              {/* Payment Method Selection */}
              <View style={styles.paymentMethods}>
                <TouchableOpacity 
                  style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionSelected]}
                  onPress={() => setPaymentMethod('card')}
                >
                  <View style={[styles.radioButton, paymentMethod === 'card' && styles.radioButtonSelected]}>
                    {paymentMethod === 'card' && <View style={styles.radioButtonInner} />}
                  </View>
                  <Ionicons name="card" size={20} color={COLORS.gray600} />
                  <Text style={styles.paymentOptionText}>Credit or Debit Card</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.paymentOption, paymentMethod === 'paypal' && styles.paymentOptionSelected]}
                  onPress={() => setPaymentMethod('paypal')}
                >
                  <View style={[styles.radioButton, paymentMethod === 'paypal' && styles.radioButtonSelected]}>
                    {paymentMethod === 'paypal' && <View style={styles.radioButtonInner} />}
                  </View>
                  <View style={[styles.paypalIcon, { backgroundColor: COLORS.blue600 }]}>
                    <Text style={styles.paypalIconText}>P</Text>
                  </View>
                  <Text style={styles.paymentOptionText}>PayPal</Text>
                </TouchableOpacity>
              </View>
              
              {paymentMethod === 'card' && (
                <View style={styles.cardForm}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Card Number</Text>
                    <View style={styles.inputWithIcon}>
                      <TextInput
                        style={[styles.textInput, { paddingRight: 40 }]}
                        placeholder="4532 1234 5678 9012"
                        value={formData.cardNumber}
                        onChangeText={(value) => handleInputChange('cardNumber', value)}
                        keyboardType="numeric"
                      />
                      <Ionicons name="card" size={20} color={COLORS.gray400} style={styles.inputIcon} />
                    </View>
                  </View>

                  <View style={styles.cardInputRow}>
                    <View style={[styles.inputContainer, { flex: 1, marginRight: SPACING[2] }]}>
                      <Text style={styles.inputLabel}>Expiry Date</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChangeText={(value) => handleInputChange('expiryDate', value)}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={[styles.inputContainer, { flex: 1, marginLeft: SPACING[2] }]}>
                      <Text style={styles.inputLabel}>CVV</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="123"
                        value={formData.cvv}
                        onChangeText={(value) => handleInputChange('cvv', value)}
                        keyboardType="numeric"
                        secureTextEntry
                      />
                    </View>
                  </View>
                </View>
              )}

              {paymentMethod === 'paypal' && (
                <View style={[styles.infoCard, { backgroundColor: COLORS.blue50, borderColor: COLORS.blue500 }]}>
                  <View style={styles.infoRowSimple}>
                    <View style={[styles.paypalIcon, { backgroundColor: COLORS.blue600 }]}>
                      <Text style={styles.paypalIconText}>P</Text>
                    </View>
                    <View>
                      <Text style={[styles.infoTitle, { color: COLORS.blue900 }]}>PayPal Payment</Text>
                      <Text style={[styles.infoText, { color: COLORS.blue700 }]}>
                        You'll be redirected to PayPal to complete your payment setup securely. Your PayPal account will be linked for future billing.
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Order Summary */}
            <View style={[styles.card, { backgroundColor: COLORS.gray50 }]}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>AlwaysON (Monthly)</Text>
                <Text style={styles.summaryText}>$10.00</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryText, { color: COLORS.green600 }]}>First Month Free</Text>
                <Text style={[styles.summaryText, { color: COLORS.green600 }]}>-$10.00</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.summaryTotalText}>Total Due Today</Text>
                <Text style={[styles.summaryTotalText, { fontSize: TYPOGRAPHY.lg }]}>$0.00</Text>
              </View>
              <Text style={styles.summarySubtext}>$10/month, cancel anytime</Text>
            </View>

            <TouchableOpacity 
              style={[
                styles.primaryButton,
                (!formData.email || !formData.name || !carrierConfirmed || !primaryCarrier ||
                 (paymentMethod === 'card' && (!formData.cardNumber || !formData.expiryDate || !formData.cvv))) && 
                styles.disabledButton
              ]}
              onPress={handlePayment}
              disabled={!formData.email || !formData.name || !carrierConfirmed || !primaryCarrier ||
                       (paymentMethod === 'card' && (!formData.cardNumber || !formData.expiryDate || !formData.cvv))}
            >
              <Text style={styles.primaryButtonText}>
                {paymentMethod === 'paypal' ? 'Continue with PayPal' : 'Start Your Free Month'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

interface FeatureItemProps {
  text: string;
}

function FeatureItem({ text }: FeatureItemProps) {
  return (
    <View style={styles.featureItemContainer}>
      <Ionicons name="checkmark-circle" size={20} color={BRAND_COLOR} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    padding: SPACING[2],
    marginRight: SPACING[4],
  },
  
  headerTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
  },
  
  planCard: {
    borderWidth: 2,
    borderRadius: RADIUS.lg,
    padding: SPACING[6],
    marginBottom: SPACING[6],
  },
  
  planHeader: {
    alignItems: 'center',
    marginBottom: SPACING[6],
  },
  
  promoBadge: {
    paddingVertical: SPACING[2],
    paddingHorizontal: SPACING[4],
    borderRadius: RADIUS.full,
    marginBottom: SPACING[4],
  },
  
  promoBadgeText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.white,
  },
  
  planTitle: {
    fontSize: TYPOGRAPHY['2xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING[2],
  },
  
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING[2],
  },
  
  planPrice: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: TYPOGRAPHY.bold,
    color: BRAND_COLOR,
  },
  
  planPeriod: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textSecondary,
    marginLeft: SPACING[1],
  },
  
  planSubtext: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textTertiary,
    marginBottom: SPACING[2],
  },
  
  planDescription: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  
  featuresList: {
    marginTop: SPACING[4],
  },
  
  featureItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[3],
  },
  
  featureText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
    marginLeft: SPACING[3],
    flex: 1,
  },
  
  primaryButton: {
    backgroundColor: BRAND_COLOR,
    paddingVertical: SPACING[4],
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING[6],
    ...SHADOWS.sm,
  },
  
  primaryButtonText: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.white,
  },
  
  disabledButton: {
    backgroundColor: COLORS.gray400,
  },
  
  section: {
    marginBottom: SPACING[6],
  },
  
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
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
  
  inputError: {
    borderColor: COLORS.red500,
  },
  
  errorText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.red500,
    marginTop: SPACING[1],
  },
  
  inputWithIcon: {
    position: 'relative',
  },
  
  inputIcon: {
    position: 'absolute',
    right: SPACING[3],
    top: SPACING[3],
  },
  
  cardInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  infoCard: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: SPACING[4],
    marginBottom: SPACING[4],
  },
  
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING[4],
  },
  
  infoRowSimple: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  infoIcon: {
    fontSize: TYPOGRAPHY.lg,
    marginRight: SPACING[3],
  },
  
  infoContent: {
    flex: 1,
  },
  
  infoTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    marginBottom: SPACING[1],
  },
  
  infoText: {
    fontSize: TYPOGRAPHY.sm,
    lineHeight: TYPOGRAPHY.sm * 1.4,
  },
  
  infoTextBold: {
    fontWeight: TYPOGRAPHY.semibold,
  },
  
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: SPACING[2],
  },
  
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: BRAND_COLOR,
    borderRadius: SPACING[1],
    backgroundColor: BRAND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING[2],
  },
  
  checkboxLabel: {
    fontSize: TYPOGRAPHY.sm,
    flex: 1,
    lineHeight: TYPOGRAPHY.sm * 1.4,
  },
  
  paymentMethods: {
    marginBottom: SPACING[4],
  },
  
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING[4],
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: RADIUS.md,
    marginBottom: SPACING[3],
  },
  
  paymentOptionSelected: {
    borderColor: BRAND_COLOR,
    backgroundColor: `${BRAND_COLOR}10`,
  },
  
  paymentOptionText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
    marginLeft: SPACING[3],
  },
  
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gray400,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING[3],
  },
  
  radioButtonSelected: {
    borderColor: BRAND_COLOR,
  },
  
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BRAND_COLOR,
  },
  
  paypalIcon: {
    width: 20,
    height: 20,
    borderRadius: SPACING[1],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING[3],
  },
  
  paypalIconText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.white,
  },
  
  cardForm: {
    marginTop: SPACING[4],
  },
  
  card: {
    borderRadius: RADIUS.md,
    padding: SPACING[4],
    marginBottom: SPACING[6],
  },
  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING[2],
  },
  
  summaryText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
  },
  
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray300,
    paddingTop: SPACING[2],
    marginTop: SPACING[2],
  },
  
  summaryTotalText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
  },
  
  summarySubtext: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: SPACING[2],
  },
  
  // Activation flow styles
  activationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING[6],
  },
  
  activationIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING[6],
  },
  
  activationTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING[2],
  },
  
  activationMessage: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING[6],
  },
  
  progressBar: {
    width: 200,
    height: 4,
    backgroundColor: COLORS.gray200,
    borderRadius: 2,
    marginBottom: SPACING[6],
  },
  
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  
  activationSubtext: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginBottom: SPACING[6],
  },
  
  // Error state styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING[6],
  },
  
  errorIcon: {
    fontSize: 64,
    marginBottom: SPACING[4],
  },
  
  errorTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING[2],
  },
  
  errorMessage: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING[6],
    lineHeight: TYPOGRAPHY.base * 1.4,
  },
  
  errorButtons: {
    width: '100%',
    marginBottom: SPACING[6],
  },
  
  secondaryButton: {
    paddingVertical: SPACING[3],
    alignItems: 'center',
    marginBottom: SPACING[3],
  },
  
  secondaryButtonText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
  },
  
  ghostButton: {
    paddingVertical: SPACING[3],
    alignItems: 'center',
  },
  
  ghostButtonText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textTertiary,
  },
  
  helpCard: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: SPACING[4],
    marginTop: SPACING[4],
  },
  
  helpText: {
    fontSize: TYPOGRAPHY.sm,
    lineHeight: TYPOGRAPHY.sm * 1.4,
  },
  
  helpTextBold: {
    fontWeight: TYPOGRAPHY.semibold,
  },
});