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
  SegmentedButtons,
  Chip,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { dataService } from '../../src/services/dataService';
import { Income, Expense } from '../../src/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type TransactionType = 'ingreso' | 'gasto';

export default function Finanzas() {
  const [type, setType] = useState<TransactionType>('ingreso');
  const [ingresos, setIngresos] = useState<Income[]>([]);
  const [gastos, setGastos] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('otro');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ingresosData, gastosData] = await Promise.all([
        dataService.getIncomes(),
        dataService.getExpenses(),
      ]);
      setIngresos(ingresosData);
      setGastos(gastosData);
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
    setDescription('');
    setAmount('');
    setCategory(type === 'ingreso' ? 'otro' : 'productos');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!description || !amount) {
      return;
    }

    setSaving(true);
    try {
      const data = {
        description,
        amount: parseFloat(amount),
        category,
        date: new Date().toISOString(),
      };

      if (type === 'ingreso') {
        await dataService.createIncome(data);
      } else {
        await dataService.createExpense(data);
      }

      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (type === 'ingreso') {
        await dataService.deleteIncome(id);
      } else {
        await dataService.deleteExpense(id);
      }
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const renderItem = (item: Income | Expense) => (
    <Card key={item.id} style={styles.card}>
      <Card.Content>
        <View style={styles.itemHeader}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemDescription}>{item.description}</Text>
            <View style={styles.itemMeta}>
              <Chip mode="outlined" compact style={styles.categoryChip}>
                {item.category}
              </Chip>
              <Text style={styles.itemDate}>
                {format(new Date(item.date), "d MMM yyyy", { locale: es })}
              </Text>
            </View>
          </View>
          <View style={styles.itemRight}>
            <Text
              style={[
                styles.itemAmount,
                type === 'ingreso' ? styles.incomeAmount : styles.expenseAmount,
              ]}
            >
              ${item.amount.toLocaleString()}
            </Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <MaterialCommunityIcons name="delete" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const data = type === 'ingreso' ? ingresos : gastos;
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SegmentedButtons
          value={type}
          onValueChange={(value) => setType(value as TransactionType)}
          buttons={[
            {
              value: 'ingreso',
              label: 'Ingresos',
              icon: 'cash-plus',
            },
            {
              value: 'gasto',
              label: 'Gastos',
              icon: 'cash-minus',
            },
          ]}
        />

        <Card style={styles.totalCard}>
          <Card.Content>
            <Text style={styles.totalLabel}>
              Total {type === 'ingreso' ? 'Ingresos' : 'Gastos'}
            </Text>
            <Text
              style={[
                styles.totalAmount,
                type === 'ingreso' ? styles.incomeAmount : styles.expenseAmount,
              ]}
            >
              ${total.toLocaleString()}
            </Text>
          </Card.Content>
        </Card>
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {data.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name={type === 'ingreso' ? 'cash-plus' : 'cash-minus'}
              size={64}
              color="#d1d5db"
            />
            <Text style={styles.emptyText}>
              No hay {type === 'ingreso' ? 'ingresos' : 'gastos'} registrados
            </Text>
          </View>
        ) : (
          data.map(renderItem)
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
          <Text style={styles.modalTitle}>
            Nuevo {type === 'ingreso' ? 'Ingreso' : 'Gasto'}
          </Text>

          <TextInput
            label="Descripción"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Monto"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Categoría"
            value={category}
            onChangeText={setCategory}
            mode="outlined"
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
  totalCard: {
    marginTop: 16,
    backgroundColor: '#fff',
  },
  totalLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
  },
  incomeAmount: {
    color: '#10b981',
  },
  expenseAmount: {
    color: '#ef4444',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
  },
  itemDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryChip: {
    height: 24,
  },
  itemDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  itemRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemAmount: {
    fontSize: 20,
    fontWeight: 'bold',
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
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
});
