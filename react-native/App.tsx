import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, SafeAreaView } from 'react-native';

// Import screens
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HowItWorksScreen } from './src/screens/HowItWorksScreen';
import { SubscriptionScreen } from './src/screens/SubscriptionScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { BillingScreen } from './src/screens/BillingScreen';
import { PaymentMethodScreen } from './src/screens/PaymentMethodScreen';
import { ReceiptScreen } from './src/screens/ReceiptScreen';
import { SubscriptionCancelledScreen } from './src/screens/SubscriptionCancelledScreen';
import { EsimRemovalScreen } from './src/screens/EsimRemovalScreen';
import { NetworkCoverageScreen } from './src/screens/NetworkCoverageScreen';
import { GeographyUnavailableScreen } from './src/screens/GeographyUnavailableScreen';
import { EsimIncompatibleScreen } from './src/screens/EsimIncompatibleScreen';
import { HelpFaqScreen } from './src/screens/HelpFaqScreen';
import { ShareFeedbackScreen } from './src/screens/ShareFeedbackScreen';

// Import components
import { EmergencyModal } from './src/components/EmergencyModal';
import { SimMismatchModal } from './src/components/SimMismatchModal';

// Import native services
import { AlwaysONNative, NetworkStatusEvent } from './src/services/AlwaysONNative';

// Import constants and types
import { BRAND_COLOR } from './src/constants/theme';

const Stack = createStackNavigator();

export default function App() {
  // Main app state (converted from your web app)
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionCancelled, setSubscriptionCancelled] = useState(false);
  const [cancellationDate, setCancellationDate] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'weak' | 'disconnected'>('connected');
  const [isBackupActive, setIsBackupActive] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [autoActivation, setAutoActivation] = useState(false);
  const [alwaysOnEnabled, setAlwaysOnEnabled] = useState(true);
  const [userCountry, setUserCountry] = useState('');
  const [isEsimCompatible, setIsEsimCompatible] = useState(true);
  
  // Native-specific state
  const [currentSIMInfo, setCurrentSIMInfo] = useState<any>(null);
  const [networkStatus, setNetworkStatus] = useState<any>(null);

  // Initialize native services on app start
  useEffect(() => {
    initializeNativeServices();
    return () => {
      // Cleanup
      AlwaysONNative.removeNetworkStatusListener();
      AlwaysONNative.stopNetworkMonitoring();
    };
  }, []);

  const initializeNativeServices = async () => {
    try {
      // Check eSIM support
      const esimSupported = await AlwaysONNative.isESIMSupported();
      setIsEsimCompatible(esimSupported);

      // Get current SIM info
      const simInfo = await AlwaysONNative.getCurrentSIMInfo();
      setCurrentSIMInfo(simInfo);

      // Get initial network status
      const networkStatus = await AlwaysONNative.getNetworkStatus();
      setNetworkStatus(networkStatus);
      updateConnectionStatusFromNetwork(networkStatus);

      // Start network monitoring
      await AlwaysONNative.startNetworkMonitoring();
      
      // Subscribe to network changes
      AlwaysONNative.onNetworkStatusChange(handleNetworkStatusChange);

    } catch (error) {
      console.error('Error initializing native services:', error);
      // Continue with default values for demo purposes
    }
  };

  const handleNetworkStatusChange = (event: NetworkStatusEvent) => {
    setNetworkStatus(event);
    updateConnectionStatusFromNetwork(event);
  };

  const updateConnectionStatusFromNetwork = (networkStatus: any) => {
    if (!networkStatus.isConnected) {
      setConnectionStatus('disconnected');
      if (autoActivation && alwaysOnEnabled && isSubscribed) {
        handleActivateBackup(true);
      }
    } else if (networkStatus.connectionType === 'cellular' && networkStatus.isConstrained) {
      setConnectionStatus('weak');
    } else {
      setConnectionStatus('connected');
      if (isBackupActive) {
        handleDeactivateBackup();
      }
    }
  };

  // Geography detection using native capabilities
  const detectUserGeography = async () => {
    try {
      const simInfo = await AlwaysONNative.getCurrentSIMInfo();
      if (simInfo && simInfo.isoCountryCode) {
        // Convert ISO country code to full country name
        const country = getCountryFromISO(simInfo.isoCountryCode);
        setUserCountry(country);
        return country;
      }
    } catch (error) {
      console.error('Error detecting geography:', error);
    }
    
    // Fallback to default for demo
    const defaultCountry = 'United States';
    setUserCountry(defaultCountry);
    return defaultCountry;
  };

  const getCountryFromISO = (isoCode: string): string => {
    const countryMap: { [key: string]: string } = {
      'US': 'United States',
      'CA': 'Canada',
      'GB': 'United Kingdom',
      'AU': 'Australia',
      'DE': 'Germany',
      'FR': 'France',
      'IT': 'Italy',
      'ES': 'Spain',
      'NL': 'Netherlands',
      // Add more as needed
    };
    
    return countryMap[isoCode.toUpperCase()] || 'Unknown';
  };

  const isCountrySupported = (country: string) => {
    const supportedCountries = [
      'United States', 'Canada', 'Australia', 'United Kingdom',
      'Germany', 'France', 'Italy', 'Spain', 'Netherlands',
      // Add EU countries and others as needed
    ];
    return supportedCountries.includes(country);
  };

  const handleGeographyCheck = async () => {
    const country = await detectUserGeography();
    return {
      countrySupported: isCountrySupported(country),
      esimCompatible: isEsimCompatible,
      country
    };
  };

  const handleSubscribe = async (userData: any) => {
    setUser(userData);
    setIsSubscribed(true);
    setSubscriptionCancelled(false);
    setCancellationDate('');

    // Install eSIM profile
    try {
      const result = await AlwaysONNative.installESIMProfile(userData.esimProfileURL || 'https://example.com/esim-profile');
      if (!result.success) {
        console.error('eSIM installation failed:', result.message);
        // Handle eSIM installation failure
      }
    } catch (error) {
      console.error('Error installing eSIM:', error);
    }
  };

  const handleActivateBackup = (autoActivated = false) => {
    setIsBackupActive(true);
    // In a real app, this would switch to the backup eSIM profile
    console.log('Backup activated', { autoActivated });
  };

  const handleDeactivateBackup = () => {
    setIsBackupActive(false);
    // In a real app, this would switch back to primary SIM
    console.log('Backup deactivated');
  };

  const handleCancelSubscription = async () => {
    setSubscriptionCancelled(true);
    setCancellationDate(new Date().toISOString());
    
    // Remove eSIM profile
    try {
      const result = await AlwaysONNative.removeESIMProfile();
      if (!result.success) {
        console.error('eSIM removal failed:', result.message);
      }
    } catch (error) {
      console.error('Error removing eSIM:', error);
    }
  };

  // Screen props factory
  const getScreenProps = () => ({
    // Connection state
    connectionStatus,
    isBackupActive,
    networkStatus,
    
    // User state
    user,
    isSubscribed,
    subscriptionCancelled,
    userCountry,
    isEsimCompatible,
    currentSIMInfo,
    
    // Settings
    autoActivation,
    alwaysOnEnabled,
    
    // Backup usage
    backupUsage: {
      monthlyHours: 2.3,
      monthlyUsages: 5,
      lastResetDate: new Date().toISOString().slice(0, 7),
      sessionStartTime: isBackupActive ? new Date().getTime() - (30 * 60 * 1000) : null
    },
    
    // Handlers
    onSubscribe: handleSubscribe,
    onCancelSubscription: handleCancelSubscription,
    onGeographyCheck: handleGeographyCheck,
    onActivateBackup: handleActivateBackup,
    onDeactivateBackup: handleDeactivateBackup,
    onAutoActivationChange: setAutoActivation,
    onAlwaysOnEnabledChange: setAlwaysOnEnabled,
    
    // Navigation handler
    onNavigate: (screen: string) => {
      if (navigation) {
        navigation.navigate(screen);
      }
    },
    
    // Back handler
    onBack: () => {
      if (navigation) {
        navigation.goBack();
      }
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={BRAND_COLOR} />
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{
            headerStyle: {
              backgroundColor: BRAND_COLOR,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          {/* Onboarding Flow */}
          <Stack.Screen 
            name="Onboarding" 
            component={OnboardingScreen}
            options={{ headerShown: false }}
            initialParams={getScreenProps()}
          />
          <Stack.Screen 
            name="HowItWorks" 
            component={HowItWorksScreen}
            options={{ headerShown: false }}
            initialParams={getScreenProps()}
          />
          <Stack.Screen 
            name="GeographyUnavailable" 
            component={GeographyUnavailableScreen}
            options={{ headerShown: false }}
            initialParams={getScreenProps()}
          />
          <Stack.Screen 
            name="EsimIncompatible" 
            component={EsimIncompatibleScreen}
            options={{ headerShown: false }}
            initialParams={getScreenProps()}
          />
          <Stack.Screen 
            name="Subscription" 
            component={SubscriptionScreen}
            options={{ headerShown: false }}
            initialParams={getScreenProps()}
          />
          
          {/* Main App Flow */}
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{ headerShown: false }}
            initialParams={getScreenProps()}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ headerShown: false }}
            initialParams={getScreenProps()}
          />
          <Stack.Screen 
            name="Billing" 
            component={BillingScreen}
            options={{ headerShown: false }}
            initialParams={getScreenProps()}
          />
          <Stack.Screen 
            name="PaymentMethods" 
            component={PaymentMethodScreen}
            options={{ headerShown: false }}
            initialParams={getScreenProps()}
          />
          <Stack.Screen 
            name="Receipt" 
            component={ReceiptScreen}
            options={{ headerShown: false }}
            initialParams={getScreenProps()}
          />
          <Stack.Screen 
            name="SubscriptionCancelled" 
            component={SubscriptionCancelledScreen}
            options={{ headerShown: false }}
            initialParams={getScreenProps()}
          />
          <Stack.Screen 
            name="EsimRemoval" 
            component={EsimRemovalScreen}
            options={{ headerShown: false }}
            initialParams={getScreenProps()}
          />
          <Stack.Screen 
            name="NetworkCoverage" 
            component={NetworkCoverageScreen}
            options={{ headerShown: false }}
            initialParams={getScreenProps()}
          />
          <Stack.Screen 
            name="HelpFaq" 
            component={HelpFaqScreen}
            options={{ headerShown: false }}
            initialParams={getScreenProps()}
          />
          <Stack.Screen 
            name="ShareFeedback" 
            component={ShareFeedbackScreen}
            options={{ headerShown: false }}
            initialParams={getScreenProps()}
          />
        </Stack.Navigator>
      </NavigationContainer>
      
      {/* Emergency Modal */}
      <EmergencyModal 
        isOpen={false} // Will be implemented with state management
        onClose={() => {}}
        onActivateBackup={handleActivateBackup}
        connectionStatus={connectionStatus}
      />

      {/* SIM Mismatch Modal */}
      <SimMismatchModal 
        isOpen={false} // Will be implemented with state management
        onClose={() => {}}
        onChangeSim={() => {}}
        onSuspendService={() => {}}
        onGoToSettings={() => {}}
        currentSim={currentSIMInfo}
        primarySim={currentSIMInfo}
        suspensionReason=""
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // bg-gray-50 equivalent
  },
});