"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface Income {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

const categories = [
  "trabajo",
  "propina",
  "otro"
];

export default function IngresosPage() {
  const [income, setIncome] = useState<Income[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "otro",
    date: format(new Date(), "yyyy-MM-dd")
  });
  const [filterMonth, setFilterMonth] = useState("");

  useEffect(() => {
    fetchIncome();
  }, [filterMonth]);

  const fetchIncome = async () => {
    const url = filterMonth
      ? `/api/income?month=${filterMonth}`
      : "/api/income";
    const res = await fetch(url);
    const data = await res.json();
    setIncome(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingIncome) {
      await fetch(`/api/income/${editingIncome.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
    } else {
      await fetch("/api/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
    }

    setIsModalOpen(false);
    setEditingIncome(null);
    setFormData({
      description: "",
      amount: "",
      category: "otro",
      date: format(new Date(), "yyyy-MM-dd")
    });
    fetchIncome();
  };

  const handleEdit = (inc: Income) => {
    setEditingIncome(inc);
    setFormData({
      description: inc.description,
      amount: inc.amount.toString(),
      category: inc.category,
      date: format(new Date(inc.date), "yyyy-MM-dd")
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este ingreso?")) {
      await fetch(`/api/income/${id}`, { method: "DELETE" });
      fetchIncome();
    }
  };

  const openNewModal = () => {
    setEditingIncome(null);
    setFormData({
      description: "",
      amount: "",
      category: "otro",
      date: format(new Date(), "yyyy-MM-dd")
    });
    setIsModalOpen(true);
  };

  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ingresos Adicionales</h1>
          <button onClick={openNewModal} className="btn-primary">
            + Nuevo Ingreso
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total de Ingresos Adicionales</p>
              <p className="text-3xl font-bold text-green-600">
                ${totalIncome.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                (No incluye ingresos por trabajos realizados)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por mes:
              </label>
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {income.map((inc) => (
                <tr key={inc.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(inc.date), "dd/MM/yyyy")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {inc.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                      {inc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    ${inc.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(inc)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(inc.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {income.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay ingresos adicionales registrados</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">
                {editingIncome ? "Editar Ingreso" : "Nuevo Ingreso"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingIncome ? "Actualizar" : "Crear"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
