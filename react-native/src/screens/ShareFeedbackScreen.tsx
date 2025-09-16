import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, BRAND_COLOR, SHADOWS } from '../constants/theme';

interface ShareFeedbackScreenProps {
  navigation: any;
  route: any;
}

export function ShareFeedbackScreen({ navigation, route }: ShareFeedbackScreenProps) {
  const { onBack, user, context = 'general' } = route.params || {};
  
  const [feedbackType, setFeedbackType] = useState('general');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { id: 'general', name: 'General Feedback', icon: 'chatbubble' },
    { id: 'bug', name: 'Report Bug', icon: 'bug' },
    { id: 'feature', name: 'Feature Request', icon: 'bulb' },
    { id: 'improvement', name: 'Improvement', icon: 'trending-up' }
  ];

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert('Feedback Required', 'Please enter your feedback before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to submit feedback
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully. We appreciate your input and will review it carefully.',
        [{ text: 'OK', onPress: handleBack }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  const renderStarRating = () => {
    return (
      <View style={styles.starRating}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.star}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={32}
              color={star <= rating ? COLORS.yellow500 : COLORS.gray300}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
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
            <Text style={styles.headerTitle}>Share Feedback</Text>
          </View>

          {/* Introduction */}
          <View style={styles.introCard}>
            <View style={[styles.introIcon, { backgroundColor: BRAND_COLOR + '20' }]}>
              <Ionicons name="heart" size={24} color={BRAND_COLOR} />
            </View>
            <Text style={styles.introTitle}>We Value Your Input</Text>
            <Text style={styles.introDescription}>
              Your feedback helps us improve AlwaysON and create a better experience for everyone.
            </Text>
          </View>

          {/* Feedback Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What type of feedback?</Text>
            <View style={styles.feedbackTypes}>
              {feedbackTypes.map(type => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.feedbackType,
                    feedbackType === type.id && styles.feedbackTypeActive
                  ]}
                  onPress={() => setFeedbackType(type.id)}
                >
                  <Ionicons
                    name={type.icon as any}
                    size={20}
                    color={feedbackType === type.id ? BRAND_COLOR : COLORS.gray600}
                  />
                  <Text style={[
                    styles.feedbackTypeText,
                    feedbackType === type.id && styles.feedbackTypeTextActive
                  ]}>
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rating (only for general feedback) */}
          {feedbackType === 'general' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How would you rate AlwaysON?</Text>
              <Text style={styles.sectionDescription}>
                Tap the stars to rate your experience
              </Text>
              {renderStarRating()}
              {rating > 0 && (
                <Text style={styles.ratingText}>
                  {rating === 1 && "We'd love to know how we can improve"}
                  {rating === 2 && "Thanks for the feedback, we'll work on improvements"}
                  {rating === 3 && "Good to know, any suggestions for making it better?"}
                  {rating === 4 && "Great! What could make it even better?"}
                  {rating === 5 && "Awesome! We're thrilled you love AlwaysON"}
                </Text>
              )}
            </View>
          )}

          {/* Feedback Text */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {feedbackType === 'bug' && 'Describe the bug'}
              {feedbackType === 'feature' && 'What feature would you like?'}
              {feedbackType === 'improvement' && 'What can we improve?'}
              {feedbackType === 'general' && 'Tell us more'}
            </Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder={
                feedbackType === 'bug' 
                  ? "Please describe what happened, when it occurred, and any steps to reproduce..."
                  : feedbackType === 'feature'
                  ? "Describe the feature you'd like to see and how it would help you..."
                  : "Share your thoughts, suggestions, or experience with AlwaysON..."
              }
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Context Info */}
          {context === 'cancellation' && (
            <View style={styles.contextCard}>
              <View style={styles.contextHeader}>
                <Ionicons name="information-circle" size={20} color={COLORS.blue600} />
                <Text style={styles.contextTitle}>Help Us Understand</Text>
              </View>
              <Text style={styles.contextDescription}>
                We noticed you cancelled your subscription. Your feedback will help us improve AlwaysON for future users.
              </Text>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmitFeedback}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <View style={styles.submittingContent}>
                <Ionicons name="hourglass" size={16} color={COLORS.white} />
                <Text style={styles.submitButtonText}>Submitting...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            )}
          </TouchableOpacity>

          {/* Privacy Note */}
          <View style={styles.privacyNote}>
            <Ionicons name="shield-checkmark" size={16} color={COLORS.green600} />
            <Text style={styles.privacyText}>
              Your feedback is confidential and helps us improve AlwaysON
            </Text>
          </View>
        </View>
      </ScrollView>
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
  
  introCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING[6],
    alignItems: 'center',
    marginBottom: SPACING[6],
    ...SHADOWS.sm,
  },
  
  introIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING[3],
  },
  
  introTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING[2],
  },
  
  introDescription: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.base * 1.4,
  },
  
  section: {
    marginBottom: SPACING[6],
  },
  
  sectionTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING[2],
  },
  
  sectionDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING[4],
  },
  
  feedbackTypes: {
    gap: SPACING[3],
  },
  
  feedbackType: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING[4],
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.gray200,
  },
  
  feedbackTypeActive: {
    borderColor: BRAND_COLOR,
    backgroundColor: BRAND_COLOR + '05',
  },
  
  feedbackTypeText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
    marginLeft: SPACING[3],
  },
  
  feedbackTypeTextActive: {
    color: BRAND_COLOR,
    fontWeight: TYPOGRAPHY.medium,
  },
  
  starRating: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING[2],
    marginVertical: SPACING[4],
  },
  
  star: {
    padding: SPACING[1],
  },
  
  ratingText: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  feedbackInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    fontSize: TYPOGRAPHY.base,
    minHeight: 120,
    ...SHADOWS.sm,
  },
  
  contextCard: {
    backgroundColor: COLORS.blue50,
    borderWidth: 1,
    borderColor: COLORS.blue200,
    borderRadius: RADIUS.lg,
    padding: SPACING[4],
    marginBottom: SPACING[6],
  },
  
  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING[2],
  },
  
  contextTitle: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.blue800,
    marginLeft: SPACING[2],
  },
  
  contextDescription: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.blue700,
    lineHeight: TYPOGRAPHY.sm * 1.4,
  },
  
  submitButton: {
    backgroundColor: BRAND_COLOR,
    paddingVertical: SPACING[4],
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING[4],
    ...SHADOWS.sm,
  },
  
  submitButtonDisabled: {
    opacity: 0.7,
  },
  
  submittingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING[2],
  },
  
  submitButtonText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.white,
  },
  
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING[2],
  },
  
  privacyText: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});