import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the tabs index page
  return <Redirect href="/(tabs)" />;
} 