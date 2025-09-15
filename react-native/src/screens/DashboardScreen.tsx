import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, BRAND_COLOR, SHADOWS } from '../constants/theme';
import { AlwaysONNative, NetworkStatusEvent } from '../services/AlwaysONNative';

interface DashboardScreenProps {
  navigation: any;
  route: any;
}

interface BackupUsage {
  monthlyHours: number;
  monthlyUsages: number;
  lastResetDate: string;
  sessionStartTime?: number | null;
}

export function DashboardScreen({ navigation, route }: DashboardScreenProps) {
  const {
    connectionStatus = 'connected',
    isBackupActive = false,
    user = null,
    backupUsage = { monthlyHours: 0, monthlyUsages: 0, lastResetDate: '', sessionStartTime: null },
    serviceSuspended = false,
    suspensionReason = '',
    subscriptionCancelled = false,
    onNavigate = () => {},
  } = route.params || {};

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute for session tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Get network status on mount
  useEffect(() => {
    const getInitialNetworkStatus = async () => {
      try {
        const status = await AlwaysONNative.getNetworkStatus();
        setNetworkStatus(status);
      } catch (error) {
        console.error('Error getting network status:', error);
      }
    };

    getInitialNetworkStatus();

    // Subscribe to network changes
    const subscription = AlwaysONNative.onNetworkStatusChange((event: NetworkStatusEvent) => {
      setNetworkStatus(event);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh network status
      const status = await AlwaysONNative.getNetworkStatus();
      setNetworkStatus(status);
      
      // Simulate brief refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = () => {
    if (isBackupActive) {
      return 'shield-checkmark';
    }
    switch (connectionStatus) {
      case 'connected':
        return 'wifi';
      case 'weak':
        return 'wifi-outline';
      case 'disconnected':
        return 'wifi-off';
      default:
        return 'help-circle-outline';
    }
  };

  const getStatusIconColor = () => {
    if (isBackupActive) return BRAND_COLOR;
    switch (connectionStatus) {
      case 'connected':
        return COLORS.green600;
      case 'weak':
        return COLORS.yellow500;
      case 'disconnected':
        return COLORS.red500;
      default:
        return COLORS.gray400;
    }
  };

  const getStatusText = () => {
    if (isBackupActive) {
      return { status: 'AlwaysON Activated', description: 'Connected via AlwaysON backup networks' };
    }
    switch (connectionStatus) {
      case 'connected':
        return { status: 'Connected', description: 'Primary network is working normally' };
      case 'weak':
        return { status: 'Weak Signal', description: 'Primary network signal is weak' };
      case 'disconnected':
        return { status: 'Disconnected', description: 'No primary network connection' };
      default:
        return { status: 'Unknown', description: 'Checking connection...' };
    }
  };

  const getStatusCardStyle = () => {
    if (isBackupActive) return { backgroundColor: BRAND_COLOR + '15', borderColor: BRAND_COLOR + '40' };
    switch (connectionStatus) {
      case 'connected':
        return { backgroundColor: COLORS.green50, borderColor: COLORS.green500 + '40' };
      case 'weak':
        return { backgroundColor: COLORS.yellow50, borderColor: COLORS.yellow500 + '40' };
      case 'disconnected':
        return { backgroundColor: COLORS.red50, borderColor: COLORS.red500 + '40' };
      default:
        return { backgroundColor: COLORS.gray100, borderColor: COLORS.gray300 };
    }
  };

  const getSuspensionMessage = () => {
    switch (suspensionReason) {
      case 'sim-removed':
        return {
          title: 'Service suspended - no SIM card detected',
          description: 'AlwaysON service is suspended because no SIM card was detected. Please insert your SIM card.'
        };
      case 'sim-mismatch':
        return {
          title: 'Service Suspended - SIM Mismatch',
          description: 'AlwaysON service is suspended due to SIM card mismatch. Please check your settings.'
        };
      case 'esim-removed':
        return {
          title: 'Service Suspended - eSIM Removed',
          description: 'AlwaysON service is suspended because the eSIM profile was removed. Please reinstall the eSIM.'
        };
      case 'manual':
        return {
          title: 'Service Suspended',
          description: 'AlwaysON service has been manually suspended. You can reactivate it in settings.'
        };
      default:
        return {
          title: 'Service Suspended',
          description: 'AlwaysON service is currently suspended. Please check your settings.'
        };
    }
  };

  const getCurrentSessionDuration = () => {
    if (!isBackupActive || !backupUsage.sessionStartTime) return 0;
    return (currentTime.getTime() - backupUsage.sessionStartTime) / (1000 * 60 * 60); // Hours
  };

  const statusInfo = getStatusText();
  const suspensionInfo = getSuspensionMessage();
  const statusCardStyle = getStatusCardStyle();
  const currentSessionHours = getCurrentSessionDuration();

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Welcome back</Text>
            <Text style={styles.headerSubtitle}>{user?.name || 'User'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => onNavigate('settings')}
          >
            <Ionicons name="settings-outline" size={24} color={COLORS.gray600} />
          </TouchableOpacity>
        </View>

        {/* Subscription Cancelled Warning */}
        {subscriptionCancelled && (
          <View style={[styles.warningCard, { backgroundColor: COLORS.orange50, borderColor: COLORS.orange500 + '40' }]}>
            <View style={styles.warningContent}>
              <Ionicons name="close-circle" size={20} color={COLORS.orange600} />
              <View style={styles.warningText}>
                <Text style={[styles.warningTitle, { color: COLORS.orange800 }]}>
                  Subscription Cancelled
                </Text>
                <Text style={[styles.warningDescription, { color: COLORS.orange600 }]}>
                  Your service ends on Jan 15, 2025. You can still use AlwaysON until then.
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.warningButton, { borderColor: COLORS.orange500, backgroundColor: COLORS.orange50 }]}
                onPress={() => onNavigate('subscription-cancelled')}
              >
                <Text style={[styles.warningButtonText, { color: COLORS.orange700 }]}>
                  Reactivate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Service Suspension Warning */}
        {serviceSuspended && !subscriptionCancelled && (
          <View style={[styles.warningCard, { backgroundColor: COLORS.red50, borderColor: COLORS.red500 + '40' }]}>
            <View style={styles.warningContent}>
              <Ionicons name="warning" size={20} color={COLORS.red600} />
              <View style={styles.warningText}>
                <Text style={[styles.warningTitle, { color: COLORS.red800 }]}>
                  {suspensionInfo.title}
                </Text>
                <Text style={[styles.warningDescription, { color: COLORS.red600 }]}>
                  {suspensionInfo.description}
                </Text>
              </View>
              <TouchableOpacity 
                style={[styles.warningButton, { borderColor: COLORS.red500, backgroundColor: COLORS.red50 }]}
                onPress={() => onNavigate('settings')}
              >
                <Text style={[styles.warningButtonText, { color: COLORS.red700 }]}>
                  Fix Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Connection Status Card */}
        <View style={[styles.statusCard, statusCardStyle, { borderWidth: 2 }]}>
          <View style={styles.statusHeader}>
            <Ionicons 
              name={getStatusIcon() as any} 
              size={24} 
              color={getStatusIconColor()} 
            />
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>{statusInfo.status}</Text>
              <Text style={styles.statusDescription}>{statusInfo.description}</Text>
            </View>
          </View>

          {isBackupActive && (
            <View style={styles.backupActiveCard}>
              <View style={styles.backupActiveHeader}>
                <Ionicons name="shield-checkmark" size={16} color={BRAND_COLOR} />
                <Text style={styles.backupActiveTitle}>AlwaysON Backup Network Active</Text>
              </View>
              <Text style={styles.backupActiveDescription}>
                Your device is using the AlwaysON eSIM backup connectivity. You'll automatically switch back to your primary network when available.
              </Text>
              {currentSessionHours > 0 && (
                <Text style={styles.sessionDuration}>
                  Current session: {currentSessionHours.toFixed(1)} hours
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {(backupUsage.monthlyHours + currentSessionHours).toFixed(1)}h
              </Text>
              <Text style={styles.statLabel}>Hours This Month</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{backupUsage.monthlyUsages}</Text>
              <Text style={styles.statLabel}>Uses This Month</Text>
            </View>
          </View>
        </View>

        {/* Network Info */}
        {networkStatus && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Network Information</Text>
            <View style={styles.networkInfo}>
              <View style={styles.networkInfoRow}>
                <Text style={styles.networkInfoLabel}>Connection Type:</Text>
                <Text style={styles.networkInfoValue}>
                  {networkStatus.connectionType.charAt(0).toUpperCase() + networkStatus.connectionType.slice(1)}
                </Text>
              </View>
              <View style={styles.networkInfoRow}>
                <Text style={styles.networkInfoLabel}>Status:</Text>
                <Text style={[styles.networkInfoValue, { color: networkStatus.isConnected ? COLORS.green600 : COLORS.red500 }]}>
                  {networkStatus.isConnected ? 'Connected' : 'Disconnected'}
                </Text>
              </View>
              {networkStatus.isExpensive && (
                <View style={styles.networkInfoRow}>
                  <Text style={styles.networkInfoLabel}>Network:</Text>
                  <Text style={[styles.networkInfoValue, { color: COLORS.orange600 }]}>
                    Metered Connection
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Subscription Info */}
        <View style={styles.card}>
          <View style={styles.subscriptionInfo}>
            <View>
              <Text style={styles.subscriptionTitle}>AlwaysON</Text>
              <Text style={styles.subscriptionDate}>
                {subscriptionCancelled ? 'Service ends: Jan 15, 2025' : 'Next billing: Jan 15, 2025'}
              </Text>
            </View>
            <View style={[
              styles.subscriptionBadge,
              subscriptionCancelled 
                ? { backgroundColor: COLORS.orange100 }
                : { backgroundColor: COLORS.green100 }
            ]}>
              <Text style={[
                styles.subscriptionBadgeText,
                subscriptionCancelled 
                  ? { color: COLORS.orange800 }
                  : { color: COLORS.green800 }
              ]}>
                {subscriptionCancelled ? 'Cancelled' : 'Active'}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <ActivityItem
              icon="checkmark-circle"
              iconColor={COLORS.green600}
              iconBackground={COLORS.green100}
              title="eSIM profile updated"
              time="2 hours ago"
            />
            <ActivityItem
              icon="shield-checkmark"
              iconColor={BRAND_COLOR}
              iconBackground={BRAND_COLOR + '20'}
              title="Backup network activated"
              time="Yesterday at 3:42 PM"
            />
            <ActivityItem
              icon="time"
              iconColor={BRAND_COLOR}
              iconBackground={BRAND_COLOR + '20'}
              title="Monthly billing processed"
              time="Dec 15, 2024"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

interface ActivityItemProps {
  icon: string;
  iconColor: string;
  iconBackground: string;
  title: string;
  time: string;
}

function ActivityItem({ icon, iconColor, iconBackground, title, time }: ActivityItemProps) {
  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: iconBackground }]}>
        <Ionicons name={icon as any} size={16} color={iconColor} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING[6],
  },
  
  headerTitle: {
    fontSize: TYPOGRAPHY.xl,
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
  },
  
  headerSubtitle: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
  },
  
  settingsButton: {
    padding: SPACING[2],
  },
  
  warningCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: SPACING[4],
    marginBottom: SPACING[4],
  },
  
  warningContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  warningText: {
    flex: 1,
    marginLeft: SPACING[3],
  },
  
  warningTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium,
    marginBottom: SPACING[1],
  },
  
  warningDescription: {
    fontSize: TYPOGRAPHY.xs,
    lineHeight: TYPOGRAPHY.xs * 1.4,
  },
  
  warningButton: {
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[2],
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  
  warningButtonText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium,
  },
  
  statusCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING[6],
    marginBottom: SPACING[6],
    ...SHADOWS.sm,
  },
  
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[4],
  },
  
  statusText: {
    marginLeft: SPACING[4],
    flex: 1,
  },
  
  statusTitle: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
  },
  
  statusDescription: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
  },
  
  backupActiveCard: {
    backgroundColor: BRAND_COLOR + '08',
    borderRadius: RADIUS.lg,
    padding: SPACING[3],
    borderWidth: 1,
    borderColor: BRAND_COLOR + '20',
  },
  
  backupActiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[2],
  },
  
  backupActiveTitle: {
    fontSize: TYPOGRAPHY.sm,
    marginLeft: SPACING[2],
    color: COLORS.textPrimary,
  },
  
  backupActiveDescription: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.xs * 1.4,
  },
  
  sessionDuration: {
    fontSize: TYPOGRAPHY.xs,
    color: BRAND_COLOR,
    marginTop: SPACING[1],
    fontWeight: TYPOGRAPHY.medium,
  },
  
  statsContainer: {
    marginBottom: SPACING[6],
  },
  
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING[4],
  },
  
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING[4],
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  
  statValue: {
    fontSize: TYPOGRAPHY['2xl'],
    color: BRAND_COLOR,
    fontWeight: TYPOGRAPHY.bold,
    marginBottom: SPACING[1],
  },
  
  statLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  
  card: {
    backgroundColor: COLORS.white,
    padding: SPACING[4],
    borderRadius: RADIUS.lg,
    marginBottom: SPACING[4],
    ...SHADOWS.sm,
  },
  
  cardTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING[3],
  },
  
  networkInfo: {
    gap: SPACING[2],
  },
  
  networkInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  networkInfoLabel: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  
  networkInfoValue: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.medium,
  },
  
  subscriptionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  subscriptionTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
  },
  
  subscriptionDate: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  
  subscriptionBadge: {
    paddingHorizontal: SPACING[3],
    paddingVertical: SPACING[1],
    borderRadius: RADIUS.md,
  },
  
  subscriptionBadgeText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.medium,
  },
  
  activityList: {
    gap: SPACING[3],
  },
  
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING[3],
  },
  
  activityContent: {
    flex: 1,
  },
  
  activityTitle: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
  },
  
  activityTime: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textTertiary,
  },
});