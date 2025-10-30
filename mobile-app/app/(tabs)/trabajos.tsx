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
  Chip,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { dataService } from '../../src/services/dataService';
import { Job, Service, Worker } from '../../src/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Trabajos() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [serviceId, setServiceId] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsData, servicesData, workersData] = await Promise.all([
        dataService.getJobs(),
        dataService.getServices(),
        dataService.getWorkers(),
      ]);
      setJobs(jobsData);
      setServices(servicesData.filter((s) => s.active));
      setWorkers(workersData.filter((w) => w.active));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const openModal = () => {
    setServiceId(services[0]?.id || '');
    setWorkerId(workers[0]?.id || '');
    setVehicleType('');
    setVehiclePlate('');
    setCustomerName('');
    setCustomerPhone('');
    setPrice('');
    setNotes('');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!serviceId) {
      return;
    }

    setSaving(true);
    try {
      const selectedService = services.find((s) => s.id === serviceId);
      const data = {
        serviceId,
        workerId: workerId || undefined,
        vehicleType: vehicleType || undefined,
        vehiclePlate: vehiclePlate || undefined,
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        price: parseFloat(price) || selectedService?.price || 0,
        notes: notes || undefined,
        status: 'completado',
        date: new Date().toISOString(),
      };

      await dataService.createJob(data);
      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dataService.deleteJob(id);
      loadData();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  const todayJobs = jobs.filter((j) => {
    const jobDate = new Date(j.date);
    const today = new Date();
    return jobDate.toDateString() === today.toDateString();
  });

  const totalToday = todayJobs.reduce((sum, job) => sum + job.price, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons name="car-wash" size={32} color="#1e40af" />
                <Text style={styles.summaryValue}>{todayJobs.length}</Text>
                <Text style={styles.summaryLabel}>Trabajos Hoy</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons name="cash" size={32} color="#10b981" />
                <Text style={styles.summaryValue}>${totalToday.toLocaleString()}</Text>
                <Text style={styles.summaryLabel}>Ingresos Hoy</Text>
              </View>
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
        {jobs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="car-wash" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No hay trabajos registrados</Text>
          </View>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} style={styles.card}>
              <Card.Content>
                <View style={styles.jobHeader}>
                  <View style={styles.jobInfo}>
                    <View style={styles.jobTitleRow}>
                      <Text style={styles.jobService}>{job.service?.name}</Text>
                      <Chip
                        mode="flat"
                        compact
                        style={[
                          styles.statusChip,
                          job.status === 'completado' && styles.completedChip,
                        ]}
                        textStyle={styles.statusText}
                      >
                        {job.status}
                      </Chip>
                    </View>

                    {job.customerName && (
                      <Text style={styles.jobCustomer}>
                        <MaterialCommunityIcons name="account" size={14} />
                        {' '}
                        {job.customerName}
                      </Text>
                    )}

                    {job.vehiclePlate && (
                      <Text style={styles.jobVehicle}>
                        <MaterialCommunityIcons name="car" size={14} />
                        {' '}
                        {job.vehicleType || 'Vehículo'} - {job.vehiclePlate}
                      </Text>
                    )}

                    {job.worker && (
                      <Text style={styles.jobWorker}>
                        <MaterialCommunityIcons name="account-hard-hat" size={14} />
                        {' '}
                        {job.worker.name}
                      </Text>
                    )}

                    <Text style={styles.jobDate}>
                      {format(new Date(job.date), "d MMM yyyy, HH:mm", { locale: es })}
                    </Text>
                  </View>

                  <View style={styles.jobRight}>
                    <Text style={styles.jobPrice}>${job.price.toLocaleString()}</Text>
                    <TouchableOpacity onPress={() => handleDelete(job.id)}>
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
        onPress={openModal}
        color="#fff"
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <ScrollView>
            <Text style={styles.modalTitle}>Nuevo Trabajo</Text>

            <Text style={styles.label}>Servicio</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={serviceId}
                onValueChange={setServiceId}
                style={styles.picker}
              >
                {services.map((service) => (
                  <Picker.Item
                    key={service.id}
                    label={`${service.name} - $${service.price}`}
                    value={service.id}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Trabajador</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={workerId}
                onValueChange={setWorkerId}
                style={styles.picker}
              >
                <Picker.Item label="Sin asignar" value="" />
                {workers.map((worker) => (
                  <Picker.Item
                    key={worker.id}
                    label={worker.name}
                    value={worker.id}
                  />
                ))}
              </Picker>
            </View>

            <TextInput
              label="Nombre del Cliente"
              value={customerName}
              onChangeText={setCustomerName}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Teléfono del Cliente"
              value={customerPhone}
              onChangeText={setCustomerPhone}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
            />

            <TextInput
              label="Tipo de Vehículo"
              value={vehicleType}
              onChangeText={setVehicleType}
              mode="outlined"
              placeholder="Ej: Sedan, SUV, Camioneta"
              style={styles.input}
            />

            <TextInput
              label="Placa del Vehículo"
              value={vehiclePlate}
              onChangeText={setVehiclePlate}
              mode="outlined"
              autoCapitalize="characters"
              style={styles.input}
            />

            <TextInput
              label="Precio"
              value={price}
              onChangeText={setPrice}
              mode="outlined"
              keyboardType="numeric"
              placeholder={`Precio sugerido: $${services.find((s) => s.id === serviceId)?.price || 0}`}
              style={styles.input}
            />

            <TextInput
              label="Notas"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />

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
          </ScrollView>
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
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  summaryCard: {
    backgroundColor: '#fff',
  },
  summaryRow: {
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
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#1f2937',
  },
  summaryLabel: {
    fontSize: 12,
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
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobInfo: {
    flex: 1,
  },
  jobTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  jobService: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  statusChip: {
    height: 24,
  },
  completedChip: {
    backgroundColor: '#d1fae5',
  },
  statusText: {
    fontSize: 11,
  },
  jobCustomer: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 4,
  },
  jobVehicle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  jobWorker: {
    fontSize: 14,
    color: '#3b82f6',
    marginBottom: 4,
  },
  jobDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  jobRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  jobPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 8,
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
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    marginLeft: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  input: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
});
