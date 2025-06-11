import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import Collapsible from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="brain.head.profile"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>

      <Collapsible title="Focus Techniques">
        <ThemedText>
          Discover different focus techniques to boost your productivity:
        </ThemedText>
        <View style={styles.techniqueList}>
          <TouchableOpacity style={styles.techniqueItem} onPress={() => router.push('/(tabs)/focus')}>
            <Ionicons name="timer-outline" size={24} color="#FF6B6B" />
            <ThemedText style={styles.techniqueTitle}>Pomodoro Technique</ThemedText>
            <ThemedText style={styles.techniqueDesc}>25-minute focused work sessions</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.techniqueItem} onPress={() => router.push('/(tabs)/focus')}>
            <Ionicons name="fitness-outline" size={24} color="#4ECDC4" />
            <ThemedText style={styles.techniqueTitle}>Deep Work</ThemedText>
            <ThemedText style={styles.techniqueDesc}>Extended periods of focused work</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.techniqueItem} onPress={() => router.push('/(tabs)/focus')}>
            <Ionicons name="calendar-outline" size={24} color="#45B7D1" />
            <ThemedText style={styles.techniqueTitle}>Time Blocking</ThemedText>
            <ThemedText style={styles.techniqueDesc}>Schedule your day in blocks</ThemedText>
          </TouchableOpacity>
        </View>
      </Collapsible>

      <Collapsible title="Productivity Tips">
        <ThemedText>
          Learn how to optimize your work environment and habits:
        </ThemedText>
        <View style={styles.tipsList}>
          <View style={styles.tipItem}>
            <Ionicons name="water-outline" size={24} color="#96CEB4" />
            <ThemedText style={styles.tipText}>Stay hydrated - drink water regularly</ThemedText>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="walk-outline" size={24} color="#FFEEAD" />
            <ThemedText style={styles.tipText}>Take regular movement breaks</ThemedText>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="moon-outline" size={24} color="#4ECDC4" />
            <ThemedText style={styles.tipText}>Get enough sleep for better focus</ThemedText>
          </View>
        </View>
      </Collapsible>

      <Collapsible title="Focus Resources">
        <ThemedText>
          Explore these resources to learn more about focus and productivity:
        </ThemedText>
        <View style={styles.resourcesList}>
          <ExternalLink href="https://www.calnewport.com/books/deep-work/">
            <ThemedText type="link">Deep Work by Cal Newport</ThemedText>
          </ExternalLink>
          <ExternalLink href="https://francescocirillo.com/pages/pomodoro-technique">
            <ThemedText type="link">The Pomodoro Technique</ThemedText>
          </ExternalLink>
          <ExternalLink href="https://www.atlassian.com/time-management/time-blocking">
            <ThemedText type="link">Time Blocking Guide</ThemedText>
          </ExternalLink>
        </View>
      </Collapsible>

      <Collapsible title="App Features">
        <ThemedText>
          Make the most of FocusFlow's features:
        </ThemedText>
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Ionicons name="timer-outline" size={24} color="#FF6B6B" />
            <ThemedText style={styles.featureText}>Customizable focus sessions</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="water-outline" size={24} color="#4ECDC4" />
            <ThemedText style={styles.featureText}>Water intake tracking</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="fitness-outline" size={24} color="#45B7D1" />
            <ThemedText style={styles.featureText}>Movement break reminders</ThemedText>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="moon-outline" size={24} color="#96CEB4" />
            <ThemedText style={styles.featureText}>Focus mode to minimize distractions</ThemedText>
          </View>
        </View>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  techniqueList: {
    gap: 12,
    marginTop: 12,
  },
  techniqueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  techniqueTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  techniqueDesc: {
    fontSize: 14,
    color: '#666',
  },
  tipsList: {
    gap: 12,
    marginTop: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  tipText: {
    marginLeft: 12,
    flex: 1,
  },
  resourcesList: {
    gap: 12,
    marginTop: 12,
  },
  featuresList: {
    gap: 12,
    marginTop: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  featureText: {
    marginLeft: 12,
    flex: 1,
  },
});
