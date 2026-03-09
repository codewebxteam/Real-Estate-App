import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  FadeIn,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Shadows } from '../constants/colors';

// Auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Customer screens
import BrowseScreen from '../screens/customer/BrowseScreen';
import PropertyDetailScreen from '../screens/customer/PropertyDetailScreen';
import MapScreen from '../screens/customer/MapScreen';
import MyInquiriesScreen from '../screens/customer/MyInquiriesScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Partner screens
import PartnerDashboardScreen from '../screens/partner/PartnerDashboardScreen';
import KYCOnboardingScreen from '../screens/partner/KYCOnboardingScreen';
import MyListingsScreen from '../screens/partner/MyListingsScreen';
import AddPropertyScreen from '../screens/partner/AddPropertyScreen';
import PartnerProfileScreen from '../screens/partner/PartnerProfileScreen';

// Admin screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import KYCReviewScreen from '../screens/admin/KYCReviewScreen';
import PropertyModerationScreen from '../screens/admin/PropertyModerationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- Auth Stack ---
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// --- Customer Stack ---
const CustomerHomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeList" component={BrowseScreen} />
    <Stack.Screen
      name="PropertyDetail"
      component={PropertyDetailScreen}
      options={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTintColor: Colors.primary,
        headerStyle: { backgroundColor: Colors.white },
        headerShadowVisible: false,
        title: 'Details',
      }}
    />
  </Stack.Navigator>
);

// --- Tab Icon Component with Animations ---
interface TabIconProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  focused: boolean;
}

const TabIcon = ({ icon, color, focused }: TabIconProps) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (focused) {
      scale.value = withSequence(withSpring(1.25), withSpring(1));
    } else {
      scale.value = withSpring(1);
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.tabIconContainer}>
      <Animated.View style={animatedStyle}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </Animated.View>
      {focused && <View style={[styles.activeIndicator, { backgroundColor: color }]} />}
    </View>
  );
};

// --- Customer Tab Navigator ---
const CustomerTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: '#888',
      tabBarLabelStyle: styles.tabLabel,
      tabBarStyle: styles.tabBar,
    }}
  >
    <Tab.Screen
      name="CustomerDashboard"
      component={CustomerHomeStack}
      options={{
        tabBarLabel: 'Browse',
        tabBarIcon: ({ color, focused }) => <TabIcon icon="magnify" color={color} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="Map"
      component={MapScreen}
      options={{
        tabBarLabel: 'Map',
        tabBarIcon: ({ color, focused }) => <TabIcon icon="map-marker-radius" color={color} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="CustomerInquiries"
      component={MyInquiriesScreen}
      options={{
        tabBarLabel: 'Inquiries',
        tabBarIcon: ({ color, focused }) => <TabIcon icon="message-text" color={color} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="CustomerProfile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, focused }) => <TabIcon icon="account" color={color} focused={focused} />,
      }}
    />
  </Tab.Navigator>
);

// --- Partner Tab Navigator ---
const PartnerTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: '#888',
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabLabel,
    }}
  >
    <Tab.Screen
      name="PartnerDashboard"
      component={PartnerDashboardScreen}
      options={{
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ color, focused }) => <TabIcon icon="view-dashboard" color={color} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="AddProperty"
      component={AddPropertyScreen}
      options={{
        tabBarLabel: 'Add',
        tabBarIcon: ({ color, focused }) => <TabIcon icon="plus-circle" color={color} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="MyListings"
      component={MyListingsScreen}
      options={{
        tabBarLabel: 'Listings',
        tabBarIcon: ({ color, focused }) => <TabIcon icon="home-city" color={color} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="PartnerProfile"
      component={PartnerProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, focused }) => <TabIcon icon="account-circle" color={color} focused={focused} />,
      }}
    />
  </Tab.Navigator>
);

// --- Admin Tab Navigator ---
const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: '#888',
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabLabel,
    }}
  >
    <Tab.Screen
      name="AdminDashboard"
      component={AdminDashboardScreen}
      options={{
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ color, focused }) => <TabIcon icon="shield-check" color={color} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="KYCReview"
      component={KYCReviewScreen}
      options={{
        tabBarLabel: 'KYC',
        tabBarIcon: ({ color, focused }) => <TabIcon icon="account-check" color={color} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="PropertyModeration"
      component={PropertyModerationScreen}
      options={{
        tabBarLabel: 'Moderation',
        tabBarIcon: ({ color, focused }) => <TabIcon icon="home-search" color={color} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="AdminProfile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Settings',
        tabBarIcon: ({ color, focused }) => <TabIcon icon="cog" color={color} focused={focused} />,
      }}
    />
  </Tab.Navigator>
);

// --- Loading Screen ---
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <Animated.View entering={FadeIn.delay(200)}>
      <MaterialCommunityIcons name="home-modern" size={80} color={Colors.primary} />
    </Animated.View>
    <Animated.View entering={FadeIn.delay(500)}>
      <Text style={styles.loadingTitle}>UP Properties</Text>
    </Animated.View>
    <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 40 }} />
  </View>
);

// --- Root Navigator ---
export const Navigation = () => {
  const { isAuthenticated, isLoading, userProfile } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  const getNavigator = () => {
    if (!isAuthenticated) {
      return <AuthStack />;
    }

    switch (userProfile?.role) {
      case 'partner':
        return <PartnerTabs />;
      case 'admin':
        return <AdminTabs />;
      case 'customer':
      default:
        return <CustomerTabs />;
    }
  };

  return (
    <NavigationContainer>
      {getNavigator()}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    height: 65,
    paddingBottom: 8,
    paddingTop: 6,
    ...Shadows.md,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: -2,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
  },
});
