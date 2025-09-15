import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to AlwaysONModule.web.ts
// and on native platforms to AlwaysONModule.ts
import AlwaysONModule from './AlwaysONModule';

export interface SIMInfo {
  carrier: string;
  mobileCountryCode: string;
  mobileNetworkCode: string;
  isoCountryCode: string;
}

export interface NetworkStatus {
  isConnected: boolean;
  connectionType: 'wifi' | 'cellular' | 'other' | 'none';
  isExpensive: boolean;
  isConstrained: boolean;
}

export interface ESIMInstallResult {
  success: boolean;
  message: string;
}

export interface NetworkStatusEvent {
  isConnected: boolean;
  connectionType: string;
  isExpensive: boolean;
  isConstrained: boolean;
  timestamp: number;
}

class AlwaysONNativeService {
  private networkStatusSubscription: Subscription | null = null;

  // Check if device supports eSIM functionality
  async isESIMSupported(): Promise<boolean> {
    try {
      return await AlwaysONModule.isESIMSupported();
    } catch (error) {
      console.error('Error checking eSIM support:', error);
      return false;
    }
  }

  // Get current SIM card information
  async getCurrentSIMInfo(): Promise<SIMInfo | null> {
    try {
      return await AlwaysONModule.getCurrentSIMInfo();
    } catch (error) {
      console.error('Error getting SIM info:', error);
      return null;
    }
  }

  // Install eSIM profile from QR code or URL
  async installESIMProfile(profileURL: string): Promise<ESIMInstallResult> {
    try {
      return await AlwaysONModule.installESIMProfile(profileURL);
    } catch (error) {
      console.error('Error installing eSIM profile:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Remove eSIM profile (opens settings for user to manually remove)
  async removeESIMProfile(): Promise<ESIMInstallResult> {
    try {
      return await AlwaysONModule.removeESIMProfile();
    } catch (error) {
      console.error('Error removing eSIM profile:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Get current network connection status
  async getNetworkStatus(): Promise<NetworkStatus> {
    try {
      return await AlwaysONModule.getNetworkStatus();
    } catch (error) {
      console.error('Error getting network status:', error);
      return {
        isConnected: false,
        connectionType: 'none',
        isExpensive: false,
        isConstrained: false
      };
    }
  }

  // Start monitoring network status changes
  async startNetworkMonitoring(): Promise<void> {
    try {
      await AlwaysONModule.startNetworkMonitoring();
    } catch (error) {
      console.error('Error starting network monitoring:', error);
    }
  }

  // Stop monitoring network status changes
  async stopNetworkMonitoring(): Promise<void> {
    try {
      await AlwaysONModule.stopNetworkMonitoring();
    } catch (error) {
      console.error('Error stopping network monitoring:', error);
    }
  }

  // Subscribe to network status changes
  onNetworkStatusChange(listener: (event: NetworkStatusEvent) => void): Subscription {
    this.networkStatusSubscription = AlwaysONModule.addListener('onNetworkStatusChange', listener);
    return this.networkStatusSubscription;
  }

  // Unsubscribe from network status changes
  removeNetworkStatusListener(): void {
    if (this.networkStatusSubscription) {
      this.networkStatusSubscription.remove();
      this.networkStatusSubscription = null;
    }
  }
}

// Export singleton instance
export const AlwaysONNative = new AlwaysONNativeService();