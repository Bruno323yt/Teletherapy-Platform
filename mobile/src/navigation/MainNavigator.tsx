import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/main/DashboardScreen';
import { SessionsScreen } from '../screens/main/SessionsScreen';
import { VideoCallScreen } from '../screens/main/VideoCallScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { useAuthStore } from '../stores/authStore';

export type MainTabParamList = {
  Dashboard: undefined;
  Sessions: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  VideoCall: { sessionId: string };
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<MainStackParamList>();

function MainTabs() {
  const user = useAuthStore((state) => state.user);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Sessions') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#3B82F6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ 
          title: user?.role === 'paciente' ? 'Mi Dashboard' : 'Dashboard Terapeuta' 
        }}
      />
      <Tab.Screen 
        name="Sessions" 
        component={SessionsScreen} 
        options={{ title: 'Sesiones' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

export function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen 
        name="VideoCall" 
        component={VideoCallScreen}
        options={{ 
          presentation: 'modal',
          headerShown: true,
          title: 'Videollamada',
          headerStyle: {
            backgroundColor: '#3B82F6',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}