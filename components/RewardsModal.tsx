import { Reward, rewardsService, Streak } from '@/services/RewardsService';
import { Haptics } from '@/utils/Haptics';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type RewardsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const RewardsModal: React.FC<RewardsModalProps> = ({
  visible,
  onClose,
}) => {
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [streak, setStreak] = useState<Streak>({
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: '',
  });

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    try {
      const [pointsData, rewardsData, streakData, availableRewardsData] = await Promise.all([
        rewardsService.getPoints(),
        rewardsService.getRewards(),
        rewardsService.getStreak(),
        rewardsService.getAvailableRewards(),
      ]);

      setPoints(pointsData);
      setRewards(rewardsData);
      setStreak(streakData);
      setAvailableRewards(availableRewardsData);
    } catch (error) {
      console.error('Error loading rewards data:', error);
    }
  };

  const handleUnlockReward = async (reward: Reward) => {
    try {
      await rewardsService.unlockReward(reward.id);
      await loadData();
      
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error unlocking reward:', error);
    }
  };

  const renderReward = (reward: Reward, isAvailable: boolean) => (
    <View
      key={reward.id}
      style={[
        styles.rewardCard,
        reward.unlockedAt && styles.unlockedReward,
        isAvailable && styles.availableReward,
      ]}>
      <View style={styles.rewardHeader}>
        <Text style={styles.rewardTitle}>{reward.title}</Text>
        <Text style={styles.rewardPoints}>{reward.points} points</Text>
      </View>
      <Text style={styles.rewardDescription}>{reward.description}</Text>
      {isAvailable && !reward.unlockedAt && (
        <TouchableOpacity
          style={styles.unlockButton}
          onPress={() => handleUnlockReward(reward)}>
          <Text style={styles.unlockButtonText}>Unlock</Text>
        </TouchableOpacity>
      )}
      {reward.unlockedAt && (
        <View style={styles.unlockedBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.unlockedText}>Unlocked</Text>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Rewards & Streaks</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Points and Streak */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <Text style={styles.statValue}>{points}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="flame" size={24} color="#FF6B6B" />
              <Text style={styles.statValue}>{streak.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="trophy" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>{streak.longestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>

          {/* Available Rewards */}
          {availableRewards.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available Rewards</Text>
              <ScrollView style={styles.rewardsList}>
                {availableRewards.map(reward => renderReward(reward, true))}
              </ScrollView>
            </View>
          )}

          {/* All Rewards */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Rewards</Text>
            <ScrollView style={styles.rewardsList}>
              {rewards.map(reward => renderReward(reward, false))}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  rewardsList: {
    maxHeight: 300,
  },
  rewardCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  unlockedReward: {
    opacity: 0.7,
  },
  availableReward: {
    borderWidth: 2,
    borderColor: '#0A7EA4',
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  rewardPoints: {
    fontSize: 14,
    color: '#666',
  },
  rewardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  unlockButton: {
    backgroundColor: '#0A7EA4',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  unlockButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unlockedText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },
}); 