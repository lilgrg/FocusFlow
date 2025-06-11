import { TimedRoutineItem } from '@/types/RoutineTypes';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedView } from './ThemedView';

interface TaskListProps {
  tasks: TimedRoutineItem[];
  completedTasks: TimedRoutineItem[];
  onStartTask: (task: TimedRoutineItem) => void;
  onCompleteTask: (task: TimedRoutineItem) => void;
  onDeleteTask: (task: TimedRoutineItem) => void;
  loading?: boolean;
}

type FilterType = 'all' | 'high' | 'medium' | 'low';

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  completedTasks,
  onStartTask,
  onCompleteTask,
  onDeleteTask,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'all' || task.priority === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, activeFilter]);

  const routineTasks = useMemo(() => {
    return filteredTasks.filter(task => task.isRoutine);
  }, [filteredTasks]);

  const regularTasks = useMemo(() => {
    return filteredTasks.filter(task => !task.isRoutine);
  }, [filteredTasks]);

  const handleStartTask = async (task: TimedRoutineItem) => {
    setLoadingTaskId(task.id);
    try {
      await onStartTask(task);
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleCompleteTask = async (task: TimedRoutineItem) => {
    setLoadingTaskId(task.id);
    try {
      await onCompleteTask(task);
    } finally {
      setLoadingTaskId(null);
    }
  };

  const handleDeleteTask = async (task: TimedRoutineItem) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoadingTaskId(task.id);
            try {
              await onDeleteTask(task);
            } finally {
              setLoadingTaskId(null);
            }
          }
        }
      ]
    );
  };

  const renderFilterButton = (filter: FilterType, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && styles.activeFilterButton
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        activeFilter === filter && styles.activeFilterButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderTask = (task: TimedRoutineItem, isCompleted: boolean = false) => (
    <ThemedView key={task.id} style={[styles.taskItem, isCompleted && styles.completedTask]}>
      <View style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name={task.icon as any} size={20} color={task.color || '#0A7EA4'} />
              <Ionicons 
                name={
                  task.category === 'work' ? 'briefcase' :
                  task.category === 'personal' ? 'person' :
                  task.category === 'health' ? 'fitness' :
                  task.category === 'learning' ? 'school' :
                  'people'
                } 
                size={16} 
                color="#666" 
                style={styles.categoryIcon}
              />
            </View>
            <Text style={[styles.taskTitle, isCompleted && styles.completedTaskTitle]}>
              {task.title}
            </Text>
            {task.isRoutine && (
              <View style={styles.routineBadge}>
                <Ionicons name="repeat" size={12} color="#0A7EA4" />
                <Text style={styles.routineText}>Routine</Text>
              </View>
            )}
          </View>
          <Text style={styles.taskTime}>{task.time}</Text>
        </View>
        {task.description && (
          <Text style={[styles.taskDescription, isCompleted && styles.completedTaskDescription]}>
            {task.description}
          </Text>
        )}
        <View style={styles.taskFooter}>
          <View style={styles.taskMeta}>
            <View style={[
              styles.priorityBadge,
              task.priority === 'high' && styles.highPriority,
              task.priority === 'medium' && styles.mediumPriority,
              task.priority === 'low' && styles.lowPriority
            ]}>
              <Text style={styles.priorityText}>{task.priority}</Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{task.category}</Text>
            </View>
            <Text style={styles.durationText}>{task.duration} min</Text>
          </View>
          <View style={styles.taskActions}>
            {!isCompleted && (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.startButton]}
                  onPress={() => handleStartTask(task)}
                  disabled={loadingTaskId === task.id}
                >
                  {loadingTaskId === task.id ? (
                    <ActivityIndicator size="small" color="#0A7EA4" />
                  ) : (
                    <Ionicons name="play" size={20} color="#0A7EA4" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.completeButton]}
                  onPress={() => handleCompleteTask(task)}
                  disabled={loadingTaskId === task.id}
                >
                  {loadingTaskId === task.id ? (
                    <ActivityIndicator size="small" color="#4CAF50" />
                  ) : (
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteTask(task)}
                  disabled={loadingTaskId === task.id}
                >
                  {loadingTaskId === task.id ? (
                    <ActivityIndicator size="small" color="#FF3B30" />
                  ) : (
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </ThemedView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A7EA4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('high', 'High')}
        {renderFilterButton('medium', 'Medium')}
        {renderFilterButton('low', 'Low')}
      </View>

      {filteredTasks.length > 0 ? (
        <>
          {routineTasks.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="repeat" size={20} color="#0A7EA4" />
                <Text style={styles.sectionTitle}>Routine Tasks</Text>
              </View>
              {routineTasks.map((task) => renderTask(task))}
            </View>
          )}

          {regularTasks.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="list" size={20} color="#666" />
                <Text style={styles.sectionTitle}>Non-Routine Tasks</Text>
              </View>
              {regularTasks.map((task) => renderTask(task))}
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="list" size={48} color="#666" />
          <Text style={styles.emptyText}>No tasks found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  activeFilterButton: {
    backgroundColor: '#0A7EA4',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterButtonText: {
    color: '#FFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  taskItem: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  taskTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  highPriority: {
    backgroundColor: '#FFE5E5',
  },
  mediumPriority: {
    backgroundColor: '#FFF4E5',
  },
  lowPriority: {
    backgroundColor: '#E5F6FF',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  categoryBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  durationText: {
    fontSize: 12,
    color: '#666',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  startButton: {
    backgroundColor: '#E6F4F8',
  },
  completeButton: {
    backgroundColor: '#E8F5E9',
  },
  deleteButton: {
    backgroundColor: '#FFE5E5',
  },
  completedTask: {
    opacity: 0.7,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  completedTaskDescription: {
    color: '#999',
  },
  completedSection: {
    marginTop: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  routineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5F6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  routineText: {
    fontSize: 12,
    color: '#0A7EA4',
    marginLeft: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    position: 'relative',
  },
  categoryIcon: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 2,
  },
}); 