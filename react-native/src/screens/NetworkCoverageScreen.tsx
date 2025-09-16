import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { ArrowLeft, Signal, MapPin, Zap, Shield, CheckCircle, Map, Eye, EyeOff } from 'lucide-react-native';
import { theme } from '../constants/theme';

interface NetworkCoverageScreenProps {
  onBack: () => void;
  userCountry: string;
}

export function NetworkCoverageScreen({ onBack, userCountry }: NetworkCoverageScreenProps) {
  const [activeTab, setActiveTab] = useState('carriers');
  const [visibleCarriers, setVisibleCarriers] = useState<string[]>([]);

  // Get carriers and coverage data based on user's country
  const getCountryData = (country: string) => {
    switch (country) {
      case 'United States':
        return {
          carriers: [
            { id: 'verizon', name: 'Verizon', logo: '🔴', coverage: '98%', speed: '5G Ultra Wideband', color: '#EF4444' },
            { id: 'att', name: 'AT&T', logo: '🔵', coverage: '97%', speed: '5G+', color: '#3B82F6' },
            { id: 'tmobile', name: 'T-Mobile USA', logo: '🟣', coverage: '96%', speed: '5G UC', color: '#A855F7' }
          ],
          coverageAreas: [
            { area: 'California', coverage: '99%', status: 'excellent' },
            { area: 'New York', coverage: '98%', status: 'excellent' },
            { area: 'Texas', coverage: '97%', status: 'excellent' },
            { area: 'Florida', coverage: '96%', status: 'excellent' },
            { area: 'Illinois', coverage: '95%', status: 'good' },
            { area: 'Pennsylvania', coverage: '94%', status: 'good' },
            { area: 'Ohio', coverage: '93%', status: 'good' },
            { area: 'Georgia', coverage: '92%', status: 'good' }
          ],
          regionType: 'States',
          countryName: 'USA'
        };
      case 'Canada':
        return {
          carriers: [
            { id: 'rogers', name: 'Rogers', logo: '🔴', coverage: '96%', speed: '5G+', color: '#EF4444' },
            { id: 'bell', name: 'Bell', logo: '🔵', coverage: '95%', speed: '5G', color: '#3B82F6' },
            { id: 'telus', name: 'Telus', logo: '🟢', coverage: '94%', speed: '5G+', color: '#10B981' }
          ],
          coverageAreas: [
            { area: 'Ontario', coverage: '98%', status: 'excellent' },
            { area: 'Quebec', coverage: '97%', status: 'excellent' },
            { area: 'British Columbia', coverage: '96%', status: 'excellent' },
            { area: 'Alberta', coverage: '95%', status: 'excellent' },
            { area: 'Manitoba', coverage: '93%', status: 'good' },
            { area: 'Saskatchewan', coverage: '92%', status: 'good' }
          ],
          regionType: 'Provinces',
          countryName: 'Canada'
        };
      case 'Australia':
        return {
          carriers: [
            { id: 'telstra', name: 'Telstra', logo: '🔵', coverage: '99%', speed: '5G', color: '#3B82F6' },
            { id: 'optus', name: 'Optus', logo: '🟡', coverage: '96%', speed: '5G', color: '#F59E0B' },
            { id: 'vodafone', name: 'Vodafone Australia', logo: '🔴', coverage: '94%', speed: '5G', color: '#EF4444' }
          ],
          coverageAreas: [
            { area: 'New South Wales', coverage: '99%', status: 'excellent' },
            { area: 'Victoria', coverage: '98%', status: 'excellent' },
            { area: 'Queensland', coverage: '97%', status: 'excellent' },
            { area: 'Western Australia', coverage: '96%', status: 'excellent' },
            { area: 'South Australia', coverage: '95%', status: 'excellent' },
            { area: 'Tasmania', coverage: '93%', status: 'good' }
          ],
          regionType: 'States & Territories',
          countryName: 'Australia'
        };
      case 'United Kingdom':
        return {
          carriers: [
            { id: 'ee', name: 'EE', logo: '🟠', coverage: '99%', speed: '5G', color: '#F97316' },
            { id: 'o2', name: 'O2', logo: '🔵', coverage: '97%', speed: '5G', color: '#3B82F6' },
            { id: 'vodafone', name: 'Vodafone UK', logo: '🔴', coverage: '96%', speed: '5G', color: '#EF4444' },
            { id: 'three', name: 'Three', logo: '⚫', coverage: '94%', speed: '5G', color: '#374151' }
          ],
          coverageAreas: [
            { area: 'England', coverage: '98%', status: 'excellent' },
            { area: 'Scotland', coverage: '96%', status: 'excellent' },
            { area: 'Wales', coverage: '95%', status: 'excellent' },
            { area: 'Northern Ireland', coverage: '94%', status: 'good' }
          ],
          regionType: 'Countries',
          countryName: 'United Kingdom'
        };
      case 'Singapore':
        return {
          carriers: [
            { id: 'singtel', name: 'Singtel', logo: '🔴', coverage: '99%', speed: '5G+', color: '#EF4444' },
            { id: 'starhub', name: 'StarHub', logo: '🟢', coverage: '98%', speed: '5G', color: '#10B981' },
            { id: 'm1', name: 'M1', logo: '🟠', coverage: '97%', speed: '5G', color: '#F97316' },
            { id: 'tpg', name: 'TPG Telecom', logo: '🔵', coverage: '95%', speed: '5G', color: '#3B82F6' }
          ],
          coverageAreas: [
            { area: 'Central Region', coverage: '99%', status: 'excellent' },
            { area: 'East Region', coverage: '98%', status: 'excellent' },
            { area: 'North Region', coverage: '98%', status: 'excellent' },
            { area: 'Northeast Region', coverage: '97%', status: 'excellent' },
            { area: 'West Region', coverage: '97%', status: 'excellent' }
          ],
          regionType: 'Regions',
          countryName: 'Singapore'
        };
      default:
        // EU countries or other supported regions
        return {
          carriers: [
            { id: 'vodafone', name: 'Vodafone', logo: '🔴', coverage: '96%', speed: '5G', color: '#EF4444' },
            { id: 'orange', name: 'Orange', logo: '🟠', coverage: '95%', speed: '5G', color: '#F97316' },
            { id: 'tmobile', name: 'T-Mobile', logo: '🟣', coverage: '94%', speed: '5G', color: '#A855F7' }
          ],
          coverageAreas: [
            { area: 'Major Cities', coverage: '98%', status: 'excellent' },
            { area: 'Urban Areas', coverage: '95%', status: 'excellent' },
            { area: 'Suburban Areas', coverage: '92%', status: 'good' },
            { area: 'Rural Areas', coverage: '87%', status: 'good' }
          ],
          regionType: 'Areas',
          countryName: country || 'European Union'
        };
    }
  };

  const countryData = getCountryData(userCountry);
  const { carriers, coverageAreas, regionType, countryName } = countryData;

  // Initialize visible carriers when carriers change
  React.useEffect(() => {
    if (carriers.length > 0 && visibleCarriers.length === 0) {
      setVisibleCarriers(carriers.map(c => c.id));
    }
  }, [carriers]);

  const toggleCarrierVisibility = (carrierId: string) => {
    setVisibleCarriers(prev => 
      prev.includes(carrierId) 
        ? prev.filter(id => id !== carrierId)
        : [...prev, carrierId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return { backgroundColor: '#dcfce7', color: '#065f46' };
      case 'good': return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'fair': return { backgroundColor: '#fef3c7', color: '#92400e' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const renderCarriersTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.carriersContainer}>
        {carriers.map((carrier) => (
          <View key={carrier.id} style={styles.carrierCard}>
            <View style={styles.carrierHeader}>
              <View style={styles.carrierInfo}>
                <Text style={styles.carrierLogo}>{carrier.logo}</Text>
                <View style={styles.carrierDetails}>
                  <Text style={styles.carrierName}>{carrier.name}</Text>
                  <Text style={styles.carrierSpeed}>{carrier.speed}</Text>
                </View>
              </View>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            </View>
            
            <View style={styles.carrierStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Coverage</Text>
                <Text style={styles.statValue}>{carrier.coverage}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Technology</Text>
                <Text style={styles.statValue}>5G/LTE</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Speed</Text>
                <Text style={styles.statValue}>Up to 1Gbps</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Network Features */}
      <View style={styles.featuresCard}>
        <Text style={styles.featuresTitle}>Network Features</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <CheckCircle size={16} color="#16a34a" />
            <Text style={styles.featureText}>Automatic carrier switching</Text>
          </View>
          <View style={styles.featureItem}>
            <CheckCircle size={16} color="#16a34a" />
            <Text style={styles.featureText}>Real-time signal monitoring</Text>
          </View>
          <View style={styles.featureItem}>
            <CheckCircle size={16} color="#16a34a" />
            <Text style={styles.featureText}>Emergency priority access</Text>
          </View>
          <View style={styles.featureItem}>
            <CheckCircle size={16} color="#16a34a" />
            <Text style={styles.featureText}>Unlimited backup data</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderCoverageTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* Coverage by Region */}
      <View style={styles.coverageCard}>
        <View style={styles.coverageHeader}>
          <Map size={20} color={theme.colors.alwaysonBrand} />
          <Text style={styles.coverageTitle}>Coverage by {regionType}</Text>
        </View>
        
        <View style={styles.coverageList}>
          {coverageAreas.map((area, index) => (
            <View key={index} style={styles.coverageItem}>
              <View style={styles.coverageLeft}>
                <MapPin size={16} color="#9ca3af" />
                <Text style={styles.areaName}>{area.area}</Text>
              </View>
              <View style={styles.coverageRight}>
                <Text style={styles.coveragePercent}>{area.coverage}</Text>
                <View style={[styles.statusBadge, getStatusColor(area.status)]}>
                  <Text style={[styles.statusBadgeText, { color: getStatusColor(area.status).color }]}>
                    {area.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Coverage Legend */}
      <View style={styles.legendCard}>
        <Text style={styles.legendTitle}>Coverage Quality</Text>
        <View style={styles.legendList}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
            <Text style={styles.legendText}>Excellent (95%+) - 5G/LTE Advanced</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
            <Text style={styles.legendText}>Good (85-94%) - LTE/4G</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.legendText}>Fair (75-84%) - 4G/3G</Text>
          </View>
        </View>
      </View>

      {/* Performance */}
      <View style={styles.performanceCard}>
        <View style={styles.performanceHeader}>
          <Zap size={20} color="#16a34a" />
          <Text style={styles.performanceTitle}>Network Performance</Text>
        </View>
        <View style={styles.performanceStats}>
          <View style={styles.performanceStat}>
            <Text style={styles.performanceLabel}>Average Download</Text>
            <Text style={styles.performanceValue}>85 Mbps</Text>
          </View>
          <View style={styles.performanceStat}>
            <Text style={styles.performanceLabel}>Average Upload</Text>
            <Text style={styles.performanceValue}>25 Mbps</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderMapTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* Map Controls */}
      <View style={styles.mapCard}>
        <View style={styles.mapHeader}>
          <Text style={styles.mapTitle}>Interactive Coverage Map</Text>
          <TouchableOpacity
            onPress={() => setVisibleCarriers(visibleCarriers.length === carriers.length ? [] : carriers.map(c => c.id))}
            style={styles.toggleAllButton}
          >
            <Text style={styles.toggleAllButtonText}>
              {visibleCarriers.length === carriers.length ? 'Hide All' : 'Show All'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Carrier Toggle Controls */}
        <View style={styles.carrierToggles}>
          {carriers.map((carrier) => (
            <TouchableOpacity
              key={carrier.id}
              onPress={() => toggleCarrierVisibility(carrier.id)}
              style={[
                styles.carrierToggle,
                {
                  backgroundColor: visibleCarriers.includes(carrier.id) ? carrier.color : 'transparent',
                  borderColor: carrier.color,
                }
              ]}
            >
              {visibleCarriers.includes(carrier.id) ? 
                <Eye size={12} color="#fff" /> : 
                <EyeOff size={12} color={carrier.color} />
              }
              <Text style={[
                styles.carrierToggleText,
                { color: visibleCarriers.includes(carrier.id) ? '#fff' : carrier.color }
              ]}>
                {carrier.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Simple Coverage Visualization */}
        <View style={styles.mapContainer}>
          <View style={styles.mapBackground}>
            {/* Sample coverage areas */}
            {carriers.map((carrier, index) => {
              if (!visibleCarriers.includes(carrier.id)) return null;
              return (
                <View
                  key={carrier.id}
                  style={[
                    styles.coverageArea,
                    {
                      backgroundColor: `${carrier.color}40`,
                      borderColor: carrier.color,
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 10}%`,
                    }
                  ]}
                />
              );
            })}
          </View>
          <Text style={styles.mapPlaceholder}>
            Interactive coverage map would be displayed here
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Network Coverage</Text>
      </View>

      {/* Overview Card */}
      <View style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <View style={styles.overviewIcon}>
            <Signal size={20} color={theme.colors.alwaysonBrand} />
          </View>
          <View style={styles.overviewInfo}>
            <Text style={styles.overviewTitle}>AlwaysON Coverage</Text>
            <Text style={styles.overviewSubtitle}>{countryName} National Coverage</Text>
          </View>
        </View>
        
        <View style={styles.overviewStats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>97%</Text>
            <Text style={styles.statDescription}>Population Coverage</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{carriers.length}</Text>
            <Text style={styles.statDescription}>Partner Networks</Text>
          </View>
        </View>

        <View style={styles.intelligentNetwork}>
          <Shield size={16} color="#2563eb" />
          <View style={styles.intelligentNetworkText}>
            <Text style={styles.intelligentNetworkTitle}>Intelligent Network Selection</Text>
            <Text style={styles.intelligentNetworkSubtitle}>
              AlwaysON automatically connects to the strongest available network
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <View style={styles.tabsList}>
          <TouchableOpacity
            onPress={() => setActiveTab('carriers')}
            style={[styles.tab, activeTab === 'carriers' && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 'carriers' && styles.activeTabText]}>
              Networks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('coverage')}
            style={[styles.tab, activeTab === 'coverage' && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 'coverage' && styles.activeTabText]}>
              Areas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('maps')}
            style={[styles.tab, activeTab === 'maps' && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 'maps' && styles.activeTabText]}>
              Maps
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContentContainer}>
          {activeTab === 'carriers' && renderCarriersTab()}
          {activeTab === 'coverage' && renderCoverageTab()}
          {activeTab === 'maps' && renderMapTab()}
        </View>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

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
  overviewCard: {
    backgroundColor: '#fff',
    borderTopWidth: 3,
    borderTopColor: theme.colors.alwaysonBrand,
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  overviewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.alwaysonBrand}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewInfo: {
    flex: 1,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  overviewSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  overviewStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.alwaysonBrand,
    marginBottom: 4,
  },
  statDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  intelligentNetwork: {
    flexDirection: 'row',
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  intelligentNetworkText: {
    flex: 1,
  },
  intelligentNetworkTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e40af',
  },
  intelligentNetworkSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  tabContainer: {
    flex: 1,
    marginHorizontal: 24,
  },
  tabsList: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
  },
  tabContentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  carriersContainer: {
    gap: 12,
    marginBottom: 16,
  },
  carrierCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  carrierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  carrierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  carrierLogo: {
    fontSize: 24,
  },
  carrierDetails: {
    flex: 1,
  },
  carrierName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  carrierSpeed: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 12,
    color: '#065f46',
    fontWeight: '500',
  },
  carrierStats: {
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  featuresCard: {
    backgroundColor: '#f0f9ff',
    borderColor: '#93c5fd',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 12,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
  },
  coverageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    marginBottom: 16,
  },
  coverageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  coverageTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  coverageList: {
    gap: 8,
  },
  coverageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  coverageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  areaName: {
    fontSize: 14,
    color: '#000',
  },
  coverageRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coveragePercent: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  legendCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    marginBottom: 16,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 12,
  },
  legendList: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#374151',
  },
  performanceCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  performanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  performanceStats: {
    flexDirection: 'row',
    gap: 16,
  },
  performanceStat: {
    flex: 1,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  mapCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  toggleAllButton: {
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  toggleAllButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  carrierToggles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  carrierToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  carrierToggleText: {
    fontSize: 12,
    fontWeight: '500',
  },
  mapContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  mapBackground: {
    position: 'absolute',
    inset: 0,
  },
  coverageArea: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    opacity: 0.7,
  },
  mapPlaceholder: {
    position: 'absolute',
    inset: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
    color: '#6b7280',
  },
});