/* global jest */

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock expo-notifications
// jest.mock('expo-notifications', () => ({
//   scheduleNotificationAsync: jest.fn(() => Promise.resolve()),
//   cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
//   setNotificationHandler: jest.fn(),
//   getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
//   requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
// }));

// Mock expo-av
// jest.mock('expo-av', () => ({
//   Audio: {
//     Sound: jest.fn().mockImplementation(() => ({
//       loadAsync: jest.fn(() => Promise.resolve()),
//       playAsync: jest.fn(() => Promise.resolve()),
//       stopAsync: jest.fn(() => Promise.resolve()),
//       unloadAsync: jest.fn(() => Promise.resolve()),
//     })),
//   },
// }));

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    useAnimatedGestureHandler: () => jest.fn(),
    useSharedValue: () => ({ value: 0 }),
    useAnimatedStyle: () => ({}),
    withSpring: (v) => v,
    withTiming: jest.fn((value) => value),
    withSequence: jest.fn((value) => value),
    withDelay: jest.fn((value) => value),
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      bezier: jest.fn(),
      in: jest.fn(),
      out: jest.fn(),
      inOut: jest.fn(),
    },
    createAnimatedComponent: (component) => component,
    default: {
      View: React.forwardRef((props, ref) => <View ref={ref} {...props} />),
    },
    View: React.forwardRef((props, ref) => <View ref={ref} {...props} />),
  };
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  PanGestureHandler: 'PanGestureHandler',
  State: {
    BEGAN: 1,
    ACTIVE: 2,
    END: 3,
  },
  GestureHandlerRootView: ({ children }) => children,
  Gesture: {
    Pan: () => ({
      onBegin: () => {},
      onUpdate: () => {},
      onEnd: () => {},
    }),
  },
}));

// Mock expo-haptics
// jest.mock('expo-haptics', () => ({
//   notificationAsync: jest.fn(),
//   impactAsync: jest.fn(),
//   selectionAsync: jest.fn(),
// }));

// Mock react-native-safe-area-context
// jest.mock('react-native-safe-area-context', () => ({
//   SafeAreaProvider: ({ children }) => children,
//   useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
// }));

// Mock react-native
// jest.mock('react-native', () => {
//   const RN = jest.requireActual('react-native');
//   RN.Platform.OS = 'ios';
//   return RN;
// });

// Mock expo-constants
// jest.mock('expo-constants', () => ({
//   manifest: {
//     extra: {
//       apiUrl: 'http://localhost:3000',
//     },
//   },
// }));

// Mock expo-linking
// jest.mock('expo-linking', () => ({
//   createURL: jest.fn(),
//   parse: jest.fn(),
// }));

// Mock expo-router
// jest.mock('expo-router', () => ({
//   useRouter: () => ({
//     push: jest.fn(),
//     replace: jest.fn(),
//     back: jest.fn(),
//   }),
//   useLocalSearchParams: () => ({}),
// }));

// Mock expo-blur
// jest.mock('expo-blur', () => ({
//   BlurView: 'BlurView',
// }));

// Mock expo-image
// jest.mock('expo-image', () => ({
//   Image: 'Image',
// }));

// Mock expo-splash-screen
// jest.mock('expo-splash-screen', () => ({
//   preventAutoHideAsync: jest.fn(),
//   hideAsync: jest.fn(),
// }));

// Mock expo-system-ui
// jest.mock('expo-system-ui', () => ({
//   setBackgroundColorAsync: jest.fn(),
// }));

// Mock expo-web-browser
// jest.mock('expo-web-browser', () => ({
//   openBrowserAsync: jest.fn(),
// }));

// Mock react-native-chart-kit
// jest.mock('react-native-chart-kit', () => ({
//   LineChart: 'LineChart',
//   BarChart: 'BarChart',
//   PieChart: 'PieChart',
// }));

// Mock react-native-webview
// jest.mock('react-native-webview', () => ({
//   WebView: 'WebView',
// }));

// Mock zustand
// jest.mock('zustand', () => ({
//   create: jest.fn((fn) => fn),
// }));

// Mock the navigation
// jest.mock('@react-navigation/native', () => {
//   const actualNav = jest.requireActual('@react-navigation/native');
//   return {
//     ...actualNav,
//     useNavigation: () => ({
//       navigate: jest.fn(),
//       goBack: jest.fn(),
//     }),
//     useRoute: () => ({
//       params: {},
//     }),
//   };
// }); 