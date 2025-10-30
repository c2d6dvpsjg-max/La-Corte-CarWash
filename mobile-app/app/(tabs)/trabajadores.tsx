import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Text,
  ActivityIndicator,
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  Switch,
  Avatar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { dataService } from '../../src/services/dataService';
import { Worker } from '../../src/types';

export default function Trabajadores() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [salary, setSalary] = useState('');
  const [active, setActive] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      const data = await dataService.getWorkers();
      setWorkers(data);
    } catch (error) {
      console.error('Error loading workers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWorkers();
  };

  const openModal = (worker?: Worker) => {
    if (worker) {
      setEditingId(worker.id);
      setName(worker.name);
      setPhone(worker.phone || '');
      setSalary(worker.salary.toString());
      setActive(worker.active);
    } else {
      setEditingId(null);
      setName('');
      setPhone('');
      setSalary('');
      setActive(true);
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name) {
      return;
    }

    setSaving(true);
    try {
      const data = {
        name,
        phone: phone || undefined,
        salary: parseFloat(salary) || 0,
        active,
      };

      if (editingId) {
        await dataService.updateWorker(editingId, data);
      } else {
        await dataService.createWorker(data);
      }

      setModalVisible(false);
      loadWorkers();
    } catch (error) {
      console.error('Error saving worker:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dataService.deleteWorker(id);
      loadWorkers();
    } catch (error) {
      console.error('Error deleting worker:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  const activeWorkers = workers.filter((w) => w.active);
  const inactiveWorkers = workers.filter((w) => !w.active);

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Card style={styles.summaryCard}>
          <Card.Content style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="account-check" size={32} color="#10b981" />
              <Text style={styles.summaryValue}>{activeWorkers.length}</Text>
              <Text style={styles.summaryLabel}>Activos</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="account-off" size={32} color="#6b7280" />
              <Text style={styles.summaryValue}>{inactiveWorkers.length}</Text>
              <Text style={styles.summaryLabel}>Inactivos</Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {workers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="account-group"
              size={64}
              color="#d1d5db"
            />
            <Text style={styles.emptyText}>No hay trabajadores registrados</Text>
          </View>
        ) : (
          workers.map((worker) => (
            <Card
              key={worker.id}
              style={[
                styles.card,
                !worker.active && styles.inactiveCard,
              ]}
            >
              <Card.Content>
                <View style={styles.workerHeader}>
                  <View style={styles.workerInfo}>
                    <Avatar.Text
                      size={48}
                      label={getInitials(worker.name)}
                      style={{
                        backgroundColor: worker.active ? '#1e40af' : '#9ca3af',
                      }}
                    />
                    <View style={styles.workerDetails}>
                      <Text style={styles.workerName}>{worker.name}</Text>
                      {worker.phone && (
                        <Text style={styles.workerPhone}>
                          <MaterialCommunityIcons name="phone" size={14} />
                          {' '}
                          {worker.phone}
                        </Text>
                      )}
                      <Text style={styles.workerSalary}>
                        Salario: ${worker.salary.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.workerActions}>
                    <TouchableOpacity onPress={() => openModal(worker)}>
                      <MaterialCommunityIcons name="pencil" size={24} color="#3b82f6" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(worker.id)}>
                      <MaterialCommunityIcons name="delete" size={24} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => openModal()}
        color="#fff"
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>
            {editingId ? 'Editar' : 'Nuevo'} Trabajador
          </Text>

          <TextInput
            label="Nombre"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Teléfono"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            label="Salario"
            value={salary}
            onChangeText={setSalary}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.switchContainer}>
            <Text>Activo</Text>
            <Switch value={active} onValueChange={setActive} />
          </View>

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setModalVisible(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              loading={saving}
              disabled={saving}
              buttonColor="#1e40af"
            >
              Guardar
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
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
  summary: {
    padding: 16,
    backgroundColor: '#fff',
  },
  summaryCard: {
    backgroundColor: '#fff',
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#e5e7eb',
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#1f2937',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  list: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  inactiveCard: {
    opacity: 0.6,
  },
  workerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  workerPhone: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  workerSalary: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 4,
  },
  workerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1e40af',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  input: {
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
});
