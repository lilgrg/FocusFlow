import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimeBlock } from './RoutineService';

export type Reward = {
  id: string;
  title: string;
  description: string;
  points: number;
  unlockedAt?: string;
};

export type Streak = {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string;
};

const STORAGE_KEYS = {
  REWARDS: '@FocusFlow/rewards',
  STREAKS: '@FocusFlow/streaks',
  POINTS: '@FocusFlow/points',
};

class RewardsService {
  // Get user's points
  async getPoints(): Promise<number> {
    try {
      const points = await AsyncStorage.getItem(STORAGE_KEYS.POINTS);
      return points ? parseInt(points, 10) : 0;
    } catch (error) {
      console.error('Error getting points:', error);
      return 0;
    }
  }

  // Add points to user's total
  async addPoints(points: number): Promise<number> {
    try {
      const currentPoints = await this.getPoints();
      const newPoints = currentPoints + points;
      await AsyncStorage.setItem(STORAGE_KEYS.POINTS, newPoints.toString());
      return newPoints;
    } catch (error) {
      console.error('Error adding points:', error);
      throw error;
    }
  }

  // Get all rewards
  async getRewards(): Promise<Reward[]> {
    try {
      const rewardsJson = await AsyncStorage.getItem(STORAGE_KEYS.REWARDS);
      return rewardsJson ? JSON.parse(rewardsJson) : [];
    } catch (error) {
      console.error('Error getting rewards:', error);
      return [];
    }
  }

  // Add a new reward
  async addReward(reward: Omit<Reward, 'id'>): Promise<Reward> {
    try {
      const rewards = await this.getRewards();
      const newReward: Reward = {
        ...reward,
        id: Date.now().toString(),
      };
      
      rewards.push(newReward);
      await AsyncStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
      
      return newReward;
    } catch (error) {
      console.error('Error adding reward:', error);
      throw error;
    }
  }

  // Unlock a reward
  async unlockReward(rewardId: string): Promise<Reward> {
    try {
      const rewards = await this.getRewards();
      const rewardIndex = rewards.findIndex(r => r.id === rewardId);
      
      if (rewardIndex === -1) {
        throw new Error('Reward not found');
      }

      const updatedReward = {
        ...rewards[rewardIndex],
        unlockedAt: new Date().toISOString(),
      };

      rewards[rewardIndex] = updatedReward;
      await AsyncStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
      
      return updatedReward;
    } catch (error) {
      console.error('Error unlocking reward:', error);
      throw error;
    }
  }

  // Get streak information
  async getStreak(): Promise<Streak> {
    try {
      const streakJson = await AsyncStorage.getItem(STORAGE_KEYS.STREAKS);
      return streakJson ? JSON.parse(streakJson) : {
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: '',
      };
    } catch (error) {
      console.error('Error getting streak:', error);
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: '',
      };
    }
  }

  // Update streak when completing blocks
  async updateStreak(blocks: TimeBlock[]): Promise<Streak> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const streak = await this.getStreak();
      
      // Check if all blocks are completed
      const allCompleted = blocks.every(block => block.completed);
      
      if (allCompleted) {
        const lastDate = new Date(streak.lastCompletedDate);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Consecutive day
          streak.currentStreak += 1;
          streak.longestStreak = Math.max(streak.currentStreak, streak.longestStreak);
        } else if (diffDays > 1) {
          // Streak broken
          streak.currentStreak = 1;
        }
        
        streak.lastCompletedDate = today;
        
        // Add points for completing all blocks
        const points = Math.floor(blocks.length * 10 * (1 + streak.currentStreak * 0.1));
        await this.addPoints(points);
        
        await AsyncStorage.setItem(STORAGE_KEYS.STREAKS, JSON.stringify(streak));
      }
      
      return streak;
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  }

  // Get available rewards based on points
  async getAvailableRewards(): Promise<Reward[]> {
    try {
      const points = await this.getPoints();
      const rewards = await this.getRewards();
      return rewards.filter(reward => !reward.unlockedAt && reward.points <= points);
    } catch (error) {
      console.error('Error getting available rewards:', error);
      return [];
    }
  }
}

export const rewardsService = new RewardsService(); 