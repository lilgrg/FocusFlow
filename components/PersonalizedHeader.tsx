import { Haptics } from '@/utils/Haptics';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type PersonalizedHeaderProps = {
  userName: string;
  onMenuPress: () => void;
  onProfilePress: () => void;
};

export const PersonalizedHeader: React.FC<PersonalizedHeaderProps> = ({
  userName,
  onMenuPress,
  onProfilePress,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const currentDate = new Date();
  
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const handleMenuPress = useCallback(async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onMenuPress();
  }, [onMenuPress]);

  const handleProfilePress = useCallback(async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onProfilePress();
  }, [onProfilePress]);

  const handleSettingsPress = useCallback(async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/settings');
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleMenuPress}
            testID="menu-icon">
            <Ionicons name="menu" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerCenter}>
          <Text style={styles.greeting}>Welcome, {userName}!</Text>
          <TouchableOpacity
            style={styles.dateContainer}
            onPress={() => setShowDatePicker(true)}
            testID="date-icon">
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.date}>{formattedDate}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleProfilePress}
            testID="profile-icon">
            <View style={styles.profileIcon}>
              <Ionicons name="person-circle-outline" size={28} color="#000" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDatePicker(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={styles.closeButton}
                testID="close-button">
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {/* Add date picker component here */}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
}); 