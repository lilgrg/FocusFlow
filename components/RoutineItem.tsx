import DataManager from '@/services/DataManager';
import { TimedRoutineItem } from '@/types/core';
import { createBoxShadow } from '@/utils/styles';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAsync } from '../hooks/useAsync';
import { useLogger } from '../hooks/useLogger';
import { AppError } from '../utils/errorHandling';
import { LogCategory } from '../utils/logger';

type RoutineItemProps = {
  routine: TimedRoutineItem;
  onStatusChange?: (status: TimedRoutineItem['status']) => void;
  style?: any;
};

export const RoutineItem: React.FC<RoutineItemProps> = ({
  routine,
  onStatusChange,
  style,
}) => {
  const { execute, error, isLoading } = useAsync<void>();
  const { info, error: logError } = useLogger(LogCategory.ROUTINE);

  const handleStatusChange = async (newStatus: TimedRoutineItem['status']) => {
    try {
      info('Attempting to update routine status', {
        routineId: routine.id,
        oldStatus: routine.status,
        newStatus,
      });

      await execute(
        async () => {
          const items = await DataManager.loadRoutineItems();
          const updatedItems = items.map(item => 
            item.id === routine.id 
              ? { ...item, status: newStatus }
              : item
          );
          await DataManager.saveRoutineItems(updatedItems);
          onStatusChange?.(newStatus);
          
          info('Successfully updated routine status', {
            routineId: routine.id,
            newStatus,
          });
        },
        {
          onError: (error: AppError) => {
            logError('Failed to update routine status', error, {
              routineId: routine.id,
              oldStatus: routine.status,
              newStatus,
            });
          },
        }
      );
    } catch (error) {
      // Error is already handled by useAsync and logged
    }
  };

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer, style]}>
        <Text style={styles.errorText}>
          Failed to update routine. Please try again.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => handleStatusChange(routine.status)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{routine.title}</Text>
        <Text style={styles.duration}>
          {routine.duration} minutes
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.status}>Status: {routine.status}</Text>
        <TouchableOpacity
          style={[styles.statusButton, isLoading && styles.disabledButton]}
          onPress={() => handleStatusChange('current')}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Updating...' : 'Start'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    ...createBoxShadow('#000', { width: 0, height: 2 }, 0.1, 4),
  },
  errorContainer: {
    borderColor: '#ff3b30',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  duration: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontSize: 14,
    color: '#666',
  },
  statusButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RoutineItem; 