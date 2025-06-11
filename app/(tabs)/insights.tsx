import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

type DateRange = '7d' | '30d' | 'month' | 'custom';

const DATE_RANGES = [
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: 'month', label: 'This Month' },
  { id: 'custom', label: 'Custom' },
];

// Mock data for charts
const routineData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [75, 80, 65, 90, 70, 85, 95],
    },
  ],
};

const focusData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [2.5, 3, 2, 4, 3.5, 2, 1.5],
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(10, 126, 164, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#0A7EA4'
  },
  propsForBackgroundLines: {
    strokeDasharray: '', // solid line
  },
  propsForLabels: {
    fontSize: 12,
  },
};

const screenWidth = Dimensions.get('window').width;

export default function InsightsScreen() {
  const router = useRouter();
  const [selectedRange, setSelectedRange] = useState<DateRange>('7d');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDateRangeChange = (range: DateRange) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedRange(range);
  };

  const renderMetricCard = (title: string, value: string, subtext: string, icon?: string) => (
    <Animated.View
      style={[
        styles.metricCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}>
      {icon && <Text style={styles.metricIcon}>{icon}</Text>}
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricSubtext}>{subtext}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.header}>
        <Text
          accessible={true}
          accessibilityLabel="Insights"
          accessibilityRole="header"
          style={styles.headerTitle}
        >
          Insights
        </Text>
        <View style={styles.dateRangeSelector}>
          {DATE_RANGES.map((range) => (
            <TouchableOpacity
              key={range.id}
              accessible={true}
              accessibilityLabel={`Select ${range.label}`}
              accessibilityRole="button"
              accessibilityHint={`Changes the date range to ${range.label}`}
              style={[
                styles.dateRangeButton,
                selectedRange === range.id && styles.selectedDateRange,
              ]}
              onPress={() => handleDateRangeChange(range.id as DateRange)}>
              <Text
                style={[
                  styles.dateRangeText,
                  selectedRange === range.id && styles.selectedDateRangeText,
                ]}>
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Key Metrics Overview */}
        <ThemedView style={styles.metricsContainer}>
          {renderMetricCard('Routine Success', '75%', 'This Week', '📈')}
          {renderMetricCard('Deep Work', '5h', 'This Week 🚀', '⏱️')}
          {renderMetricCard('Best Streak', '15d', 'Morning Hydration', '🔥')}
        </ThemedView>

        {/* Top Accomplishment */}
        <Animated.View
          style={[
            styles.accomplishmentCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          <Text style={styles.accomplishmentTitle}>Your Top Accomplishment</Text>
          <Text style={styles.accomplishmentText}>
            You consistently completed your evening routine 6 days this week! 🌟
          </Text>
        </Animated.View>

        {/* Data Visualizations */}
        <Animated.View
          style={[
            styles.chartCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          <Text style={styles.chartTitle}>Routine Adherence</Text>
          <View
            accessible={true}
            accessibilityLabel="Routine Adherence Chart"
            accessibilityRole="image"
          >
            {Platform.OS === 'web' ? (
              <View style={[styles.chart, { height: 220 }]}>
                {/* Web-specific chart implementation or placeholder */}
                <Text style={styles.chartPlaceholder}>Chart visualization available on mobile</Text>
              </View>
            ) : (
              <LineChart
                data={routineData}
                width={screenWidth - 48}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLines={false}
                withHorizontalLines={false}
                withDots={true}
                withShadow={false}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                fromZero={true}
              />
            )}
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.chartCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          <Text style={styles.chartTitle}>Focus Time</Text>
          <BarChart
            data={focusData}
            width={screenWidth - 48}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars={true}
            fromZero={true}
            yAxisLabel=""
            yAxisSuffix="h"
          />
        </Animated.View>

        {/* Habit Calendar */}
        <Animated.View
          style={[
            styles.calendarCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          <Text style={styles.chartTitle}>Habit Completion</Text>
          <View style={styles.calendarGrid}>
            {Array.from({ length: 30 }).map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                style={[
                  styles.calendarDay,
                  {
                    backgroundColor:
                      index % 3 === 0
                        ? '#4CAF50'
                        : index % 3 === 1
                        ? '#81C784'
                        : '#E8F5E9',
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* Insights Section */}
        <Animated.View
          style={[
            styles.insightsCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          <Text style={styles.insightsTitle}>Personalized Insights</Text>
          <View style={styles.insightItem}>
            <Ionicons name="time" size={24} color="#0A7EA4" />
            <Text style={styles.insightText}>
              You're most focused between 10 AM and 12 PM – consider scheduling your toughest tasks
              then!
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Ionicons name="trophy" size={24} color="#0A7EA4" />
            <Text style={styles.insightText}>
              🎉 You hit 100 hours of Deep Work! Great job!
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Ionicons name="bulb" size={24} color="#0A7EA4" />
            <Text style={styles.insightText}>
              Notice a dip in routine adherence on Fridays? Maybe simplify your routine for that day.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  dateRangeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  dateRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
  },
  selectedDateRange: {
    backgroundColor: '#0A7EA4',
  },
  dateRangeText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDateRangeText: {
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  metricsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
  metricTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0A7EA4',
  },
  metricSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  accomplishmentCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  accomplishmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  accomplishmentText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  chartCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartPlaceholder: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 80,
  },
  calendarCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  calendarDay: {
    width: (screenWidth - 96) / 7,
    height: (screenWidth - 96) / 7,
    borderRadius: 4,
  },
  insightsCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 