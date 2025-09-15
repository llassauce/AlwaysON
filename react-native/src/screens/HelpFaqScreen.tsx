import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, BRAND_COLOR, SHADOWS } from '../constants/theme';

interface HelpFaqScreenProps {
  navigation: any;
  route: any;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export function HelpFaqScreen({ navigation, route }: HelpFaqScreenProps) {
  const { onBack, onNavigate, user } = route.params || {};
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "How does AlwaysON work?",
      answer: "AlwaysON uses eSIM technology to provide a backup internet connection. When your primary connection fails, we automatically switch to our backup networks to keep you connected.",
      category: "basics"
    },
    {
      id: 2,
      question: "What devices are compatible with AlwaysON?",
      answer: "AlwaysON works with iPhone XS/XR and newer models that support eSIM. Your device must be running iOS 12.1 or later and have an available eSIM slot.",
      category: "compatibility"
    },
    {
      id: 3,
      question: "How much does AlwaysON cost?",
      answer: "AlwaysON costs $10 per month with no long-term contracts. Your first month is free! You can cancel anytime and your service will continue until the end of your billing period.",
      category: "billing"
    },
    {
      id: 4,
      question: "Is there a data limit on backup usage?",
      answer: "No, there are no data limits. AlwaysON provides unlimited backup data when your primary connection is unavailable. However, the service is designed for backup use, not as a primary internet solution.",
      category: "usage"
    },
    {
      id: 5,
      question: "Can I use AlwaysON while traveling internationally?",
      answer: "Currently, AlwaysON is available in the USA, Canada, EU, Australia, and UK. We're working to expand coverage to more regions. Check our coverage map for the latest updates.",
      category: "coverage"
    },
    {
      id: 6,
      question: "How do I cancel my subscription?",
      answer: "You can cancel anytime through the app's billing settings. Your service will remain active until the end of your current billing period, and no future charges will occur.",
      category: "billing"
    },
    {
      id: 7,
      question: "What happens if I remove the eSIM profile?",
      answer: "If you accidentally remove the AlwaysON eSIM profile, your backup service will be suspended. You can easily reinstall it through the app's settings or contact support for help.",
      category: "troubleshooting"
    },
    {
      id: 8,
      question: "Does AlwaysON support voice calls and SMS?",
      answer: "No, AlwaysON provides data connectivity only. It's designed to keep your internet-based services running when your primary connection fails.",
      category: "features"
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: 'list' },
    { id: 'basics', name: 'Basics', icon: 'help-circle' },
    { id: 'billing', name: 'Billing', icon: 'card' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: 'construct' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFAQs = selectedCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose how you\'d like to contact our support team:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Email Support', 
          onPress: () => Linking.openURL('mailto:support@alwayson.com?subject=AlwaysON Support Request')
        },
        { 
          text: 'Live Chat', 
          onPress: () => {
            // In a real app, this would open a chat widget
            Alert.alert('Live Chat', 'Live chat feature would open here in the production app.');
          }
        }
      ]
    );
  };

  const handleViewUserGuide = () => {
    // In a real app, this might open a user guide screen or web page
    Linking.openURL('https://alwayson.com/user-guide');
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
            <Text style={styles.headerTitle}>Help & FAQ</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction} onPress={handleContactSupport}>
              <View style={[styles.quickActionIcon, { backgroundColor: BRAND_COLOR + '20' }]}>
                <Ionicons name="chatbubble" size={24} color={BRAND_COLOR} />
              </View>
              <Text style={styles.quickActionTitle}>Contact Support</Text>
              <Text style={styles.quickActionDescription}>Get help from our team</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAction} onPress={handleViewUserGuide}>
              <View style={[styles.quickActionIcon, { backgroundColor: COLORS.blue600 + '20' }]}>
                <Ionicons name="book" size={24} color={COLORS.blue600} />
              </View>
              <Text style={styles.quickActionTitle}>User Guide</Text>
              <Text style={styles.quickActionDescription}>Complete setup guide</Text>
            </TouchableOpacity>
          </View>

          {/* Category Filter */}
          <View style={styles.categoryFilter}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryList}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id && styles.categoryButtonActive
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Ionicons 
                      name={category.icon as any} 
                      size={16} 
                      color={selectedCategory === category.id ? COLORS.white : COLORS.textSecondary} 
                    />
                    <Text style={[
                      styles.categoryButtonText,
                      selectedCategory === category.id && styles.categoryButtonTextActive
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* FAQ Items */}
          <View style={styles.faqContainer}>
            <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
            <View style={styles.faqList}>
              {filteredFAQs.map(item => (
                <FAQItemComponent
                  key={item.id}
                  item={item}
                  isExpanded={expandedItems.includes(item.id)}
                  onToggle={() => toggleExpanded(item.id)}
                />
              ))}
            </View>
          </View>

          {/* Additional Help */}
          <View style={styles.additionalHelp}>
            <Text style={styles.additionalHelpTitle}>Still Need Help?</Text>
            <Text style={styles.additionalHelpDescription}>
              Can't find what you're looking for? Our support team is here to help.
            </Text>
            
            <View style={styles.contactOptions}>
              <TouchableOpacity 
                style={styles.contactOption}
                onPress={() => Linking.openURL('mailto:support@alwayson.com')}
              >
                <Ionicons name="mail" size={20} color={COLORS.blue600} />
                <View style={styles.contactOptionText}>
                  <Text style={styles.contactOptionTitle}>Email Support</Text>
                  <Text style={styles.contactOptionDescription}>support@alwayson.com</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.contactOption}
                onPress={handleContactSupport}
              >
                <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.green600} />
                <View style={styles.contactOptionText}>
                  <Text style={styles.contactOptionTitle}>Live Chat</Text>
                  <Text style={styles.contactOptionDescription}>Available 24/7</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

interface FAQItemComponentProps {
  item: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}

function FAQItemComponent({ item, isExpanded, onToggle }: FAQItemComponentProps) {
  return (
    <TouchableOpacity style={styles.faqItem} onPress={onToggle}>
      <View style={styles.faqItemHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={COLORS.gray400} 
        />
      </View>
      {isExpanded && (
        <Text style={styles.faqAnswer}>{item.answer}</Text>
      )}
    </TouchableOpacity>
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
    marginRight: SPACING[3],
    padding: SPACING[1],
  },
  
  headerTitle: {
    fontSize: TYPOGRAPHY.xl,
    color: COLORS.textPrimary,
  },
  
  quickActions: {
    flexDirection: 'row',
    gap: SPACING[4],
    marginBottom: SPACING[6],
  },
  
  quickAction: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING[3],
  },
  
  quickActionTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
    textAlign: 'center',
  },
  
  quickActionDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  
  categoryFilter: {
    marginBottom: SPACING[6],
  },
  
  categoryList: {
    flexDirection: 'row',
    gap: SPACING[2],
    paddingHorizontal: SPACING[1],
  },
  
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING[4],
    paddingVertical: SPACING[2],
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    gap: SPACING[2],
  },
  
  categoryButtonActive: {
    backgroundColor: BRAND_COLOR,
    borderColor: BRAND_COLOR,
  },
  
  categoryButtonText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  
  categoryButtonTextActive: {
    color: COLORS.white,
  },
  
  faqContainer: {
    marginBottom: SPACING[6],
  },
  
  faqTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING[4],
  },
  
  faqList: {
    gap: SPACING[2],
  },
  
  faqItem: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    ...SHADOWS.sm,
  },
  
  faqItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  faqQuestion: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.medium,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING[3],
  },
  
  faqAnswer: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.sm * 1.5,
    marginTop: SPACING[3],
    paddingTop: SPACING[3],
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  
  additionalHelp: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING[6],
    ...SHADOWS.sm,
  },
  
  additionalHelpTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING[2],
  },
  
  additionalHelpDescription: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.base * 1.4,
    marginBottom: SPACING[6],
  },
  
  contactOptions: {
    gap: SPACING[4],
  },
  
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING[4],
    backgroundColor: COLORS.gray50,
    borderRadius: RADIUS.lg,
  },
  
  contactOptionText: {
    marginLeft: SPACING[3],
    flex: 1,
  },
  
  contactOptionTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.medium,
    color: COLORS.textPrimary,
    marginBottom: SPACING[1],
  },
  
  contactOptionDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
});