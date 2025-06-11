import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route?: string;
  action?: () => void;
};

const menuItems: MenuItem[] = [
  { icon: 'person-outline', label: 'Profile', route: '/profile' },
  { icon: 'settings-outline', label: 'Settings', route: '/settings' },
  { icon: 'shield-outline', label: 'Distraction Shield', route: '/distraction-shield' },
  { icon: 'volume-high-outline', label: 'Auditory Environment', route: '/audio-env' },
  { icon: 'help-circle-outline', label: 'Help & Support', route: '/help' },
];

export function Menu({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const handlePress = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route as never);
    } else if (item.action) {
      item.action();
    }
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handlePress(item)}>
            <Ionicons name={item.icon} size={24} color="#666" />
            <Text style={styles.menuItemText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '80%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
}); 