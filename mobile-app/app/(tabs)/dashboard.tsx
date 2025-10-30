import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { dataService } from '../../src/services/dataService';
import { DashboardStats } from '../../src/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dataService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.date}>
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <Card style={[styles.statCard, styles.incomeCard]}>
          <Card.Content>
            <View style={styles.statContent}>
              <MaterialCommunityIcons name="cash-plus" size={32} color="#10b981" />
              <Text style={styles.statValue}>
                ${stats?.totalIngresos.toLocaleString() || 0}
              </Text>
              <Text style={styles.statLabel}>Ingresos Totales</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, styles.expenseCard]}>
          <Card.Content>
            <View style={styles.statContent}>
              <MaterialCommunityIcons name="cash-minus" size={32} color="#ef4444" />
              <Text style={styles.statValue}>
                ${stats?.totalGastos.toLocaleString() || 0}
              </Text>
              <Text style={styles.statLabel}>Gastos Totales</Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      <Card style={[styles.fullCard, styles.profitCard]}>
        <Card.Content>
          <View style={styles.statContent}>
            <MaterialCommunityIcons name="chart-line" size={40} color="#fff" />
            <Text style={styles.profitValue}>
              ${stats?.ganancia.toLocaleString() || 0}
            </Text>
            <Text style={styles.profitLabel}>Ganancia Neta</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content>
            <View style={styles.statContent}>
              <MaterialCommunityIcons name="car-wash" size={28} color="#3b82f6" />
              <Text style={styles.statValue}>{stats?.trabajosHoy || 0}</Text>
              <Text style={styles.statLabel}>Trabajos Hoy</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <View style={styles.statContent}>
              <MaterialCommunityIcons name="account-group" size={28} color="#8b5cf6" />
              <Text style={styles.statValue}>{stats?.trabajadoresActivos || 0}</Text>
              <Text style={styles.statLabel}>Trabajadores</Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Este Mes</Text>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content>
            <View style={styles.statContent}>
              <MaterialCommunityIcons name="trending-up" size={28} color="#10b981" />
              <Text style={styles.statValue}>
                ${stats?.ingresosMes.toLocaleString() || 0}
              </Text>
              <Text style={styles.statLabel}>Ingresos</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <View style={styles.statContent}>
              <MaterialCommunityIcons name="trending-down" size={28} color="#ef4444" />
              <Text style={styles.statValue}>
                ${stats?.gastosMes.toLocaleString() || 0}
              </Text>
              <Text style={styles.statLabel}>Gastos</Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e40af',
    textTransform: 'capitalize',
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fullCard: {
    margin: 10,
    backgroundColor: '#fff',
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  profitCard: {
    backgroundColor: '#1e40af',
  },
  statContent: {
    alignItems: 'center',
    padding: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  profitValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#fff',
  },
  profitLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
});
