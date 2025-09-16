import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { ArrowLeft, Trash2, AlertTriangle, CheckCircle, Loader, Smartphone } from 'lucide-react-native';
import { theme } from '../constants/theme';

interface EsimRemovalScreenProps {
  onBack: () => void;
  onComplete: () => void;
  user: any;
}

export function EsimRemovalScreen({ onBack, onComplete, user }: EsimRemovalScreenProps) {
  const [removalStage, setRemovalStage] = useState('preparing'); // preparing, removing, completing, completed
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const progressAnim = useState(new Animated.Value(0))[0];

  const removalSteps = [
    { id: 'preparing', title: 'Preparing eSIM removal', duration: 2000 },
    { id: 'disconnecting', title: 'Disconnecting from network', duration: 3000 },
    { id: 'removing-profile', title: 'Removing eSIM profile', duration: 4000 },
    { id: 'clearing-data', title: 'Clearing AlwaysON data', duration: 2000 },
    { id: 'finalizing', title: 'Finalizing removal', duration: 1500 }
  ];

  useEffect(() => {
    let stepIndex = 0;
    let currentProgress = 0;

    const executeStep = () => {
      if (stepIndex >= removalSteps.length) {
        setRemovalStage('completed');
        setProgress(100);
        setCurrentStep('eSIM removal completed');
        Animated.timing(progressAnim, {
          toValue: 100,
          duration: 500,
          useNativeDriver: false,
        }).start();
        setTimeout(() => {
          onComplete();
        }, 2000);
        return;
      }

      const step = removalSteps[stepIndex];
      setCurrentStep(step.title);
      setRemovalStage('removing');

      // Calculate total duration for progress
      const totalStepDuration = removalSteps.reduce((sum, s) => sum + s.duration, 0);
      
      // Animate progress for this step
      const stepProgressIncrement = (step.duration / totalStepDuration) * 100;
      const endProgress = currentProgress + stepProgressIncrement;
      
      setProgress(endProgress);
      
      Animated.timing(progressAnim, {
        toValue: endProgress,
        duration: step.duration,
        useNativeDriver: false,
      }).start();
      
      currentProgress = endProgress;

      setTimeout(() => {
        stepIndex++;
        executeStep();
      }, step.duration);
    };

    // Start the removal process
    const startTimeout = setTimeout(() => {
      executeStep();
    }, 1000);

    return () => clearTimeout(startTimeout);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={onBack} 
            style={[styles.backButton, removalStage !== 'completed' && styles.disabled]}
            disabled={removalStage !== 'completed'}
          >
            <ArrowLeft size={20} color={removalStage !== 'completed' ? '#9ca3af' : '#000'} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>eSIM Removal</Text>
        </View>

        {/* Removal Process Card */}
        <View style={styles.card}>
          <View style={styles.processHeader}>
            <View style={styles.processIcon}>
              {removalStage === 'completed' ? (
                <CheckCircle size={32} color="#16a34a" />
              ) : (
                <View style={styles.loadingContainer}>
                  <Loader size={32} color="#dc2626" />
                </View>
              )}
            </View>
            <Text style={styles.processTitle}>
              {removalStage === 'completed' ? 'eSIM Removed Successfully' : 'Removing AlwaysON eSIM'}
            </Text>
            <Text style={styles.processDescription}>
              {removalStage === 'completed' 
                ? 'Your AlwaysON eSIM has been completely removed from your device.'
                : 'Please do not close the app or turn off your device during this process.'
              }
            </Text>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    })
                  }
                ]} 
              />
            </View>
            <Text style={styles.currentStep}>{currentStep}</Text>
          </View>

          {removalStage === 'completed' && (
            <View style={styles.completedNotice}>
              <CheckCircle size={20} color="#16a34a" />
              <View style={styles.completedContent}>
                <Text style={styles.completedTitle}>Removal Complete</Text>
                <Text style={styles.completedDescription}>
                  The AlwaysON eSIM profile has been permanently removed from your device. 
                  Your backup protection is no longer active.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* What Happened */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Smartphone size={20} color="#6b7280" />
            <Text style={styles.sectionTitle}>What Was Removed</Text>
          </View>
          
          <View style={styles.removedList}>
            <View style={styles.removedItem}>
              <View style={styles.removedBullet} />
              <View style={styles.removedContent}>
                <Text style={styles.removedTitle}>AlwaysON eSIM Profile</Text>
                <Text style={styles.removedDescription}>The backup network eSIM has been deleted from your device</Text>
              </View>
            </View>
            
            <View style={styles.removedItem}>
              <View style={styles.removedBullet} />
              <View style={styles.removedContent}>
                <Text style={styles.removedTitle}>Network Configuration</Text>
                <Text style={styles.removedDescription}>All AlwaysON network settings have been cleared</Text>
              </View>
            </View>
            
            <View style={styles.removedItem}>
              <View style={styles.removedBullet} />
              <View style={styles.removedContent}>
                <Text style={styles.removedTitle}>Backup Protection</Text>
                <Text style={styles.removedDescription}>Emergency connectivity features are now disabled</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Important Notice */}
        <View style={styles.warningCard}>
          <AlertTriangle size={20} color="#ea580c" />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Important Notice</Text>
            <Text style={styles.warningDescription}>
              Your device will no longer have backup connectivity protection. If you experience network issues, 
              you'll need to rely on your primary carrier or Wi-Fi connections only.
            </Text>
          </View>
        </View>

        {/* Action Button */}
        {removalStage === 'completed' && (
          <TouchableOpacity 
            onPress={onComplete}
            style={styles.continueButton}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            You can reactivate AlwaysON anytime to restore your backup protection
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
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  processHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  processIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#fecaca',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingContainer: {
    // Add rotation animation here if needed
  },
  processTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  processDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.alwaysonBrand,
    borderRadius: 4,
  },
  currentStep: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
  },
  completedNotice: {
    flexDirection: 'row',
    backgroundColor: '#dcfce7',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  completedContent: {
    flex: 1,
  },
  completedTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#065f46',
    marginBottom: 4,
  },
  completedDescription: {
    fontSize: 12,
    color: '#047857',
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
  removedList: {
    gap: 12,
  },
  removedItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  removedBullet: {
    width: 8,
    height: 8,
    backgroundColor: '#ef4444',
    borderRadius: 4,
    marginTop: 8,
  },
  removedContent: {
    flex: 1,
  },
  removedTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  removedDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#fef3e2',
    borderColor: '#fed7aa',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#c2410c',
    marginBottom: 4,
  },
  warningDescription: {
    fontSize: 12,
    color: '#ea580c',
  },
  continueButton: {
    backgroundColor: theme.colors.alwaysonBrand,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  continueButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});