import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1e40af',
        tabBarInactiveTintColor: '#6b7280',
        headerStyle: {
          backgroundColor: '#1e40af',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
          headerTitle: 'La Corte CarWash',
        }}
      />
      <Tabs.Screen
        name="trabajos"
        options={{
          title: 'Trabajos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="car-wash" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="finanzas"
        options={{
          title: 'Finanzas',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cash-multiple" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trabajadores"
        options={{
          title: 'Trabajadores',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
