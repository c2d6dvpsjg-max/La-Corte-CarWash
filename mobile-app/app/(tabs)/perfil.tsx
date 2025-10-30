import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, Avatar, List, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function Perfil() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={getInitials(user?.name || 'LC')}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.role}>{user?.role}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Información de la Cuenta</Text>
          <List.Item
            title="Email"
            description={user?.email}
            left={(props) => <List.Icon {...props} icon="email" />}
          />
          <Divider />
          <List.Item
            title="Rol"
            description={user?.role}
            left={(props) => <List.Icon {...props} icon="shield-account" />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Acerca de la App</Text>
          <List.Item
            title="Versión"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <Divider />
          <List.Item
            title="Lavadero"
            description="La Corte CarWash"
            left={(props) => <List.Icon {...props} icon="car-wash" />}
          />
          <Divider />
          <List.Item
            title="Plataforma"
            description="iOS & Android"
            left={(props) => <List.Icon {...props} icon="cellphone" />}
          />
        </Card.Content>
      </Card>

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleLogout}
          icon="logout"
          buttonColor="#ef4444"
          style={styles.logoutButton}
        >
          Cerrar Sesión
        </Button>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          La Corte CarWash © {new Date().getFullYear()}
        </Text>
        <Text style={styles.footerSubtext}>
          Sistema de Gestión Móvil
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    margin: 16,
    backgroundColor: '#fff',
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: '#1e40af',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#1f2937',
  },
  email: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  role: {
    fontSize: 14,
    color: '#3b82f6',
    marginTop: 4,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  actions: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  logoutButton: {
    paddingVertical: 6,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});
