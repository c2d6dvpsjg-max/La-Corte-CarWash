"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

interface Worker {
  id: string;
  name: string;
  phone: string | null;
  salary: number;
  active: boolean;
  _count?: {
    jobs: number;
    payments: number;
  };
}

export default function TrabajadoresPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    salary: "",
    active: true
  });

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    const res = await fetch("/api/workers");
    const data = await res.json();
    setWorkers(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingWorker) {
      await fetch(`/api/workers/${editingWorker.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
    } else {
      await fetch("/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
    }

    setIsModalOpen(false);
    setEditingWorker(null);
    setFormData({ name: "", phone: "", salary: "", active: true });
    fetchWorkers();
  };

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setFormData({
      name: worker.name,
      phone: worker.phone || "",
      salary: worker.salary.toString(),
      active: worker.active
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este trabajador?")) {
      await fetch(`/api/workers/${id}`, { method: "DELETE" });
      fetchWorkers();
    }
  };

  const openNewModal = () => {
    setEditingWorker(null);
    setFormData({ name: "", phone: "", salary: "", active: true });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trabajadores</h1>
          <button onClick={openNewModal} className="btn-primary">
            + Nuevo Trabajador
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <div key={worker.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{worker.name}</h3>
                <span className={`px-2 py-1 text-xs rounded ${worker.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {worker.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                {worker.phone && (
                  <p className="text-gray-600 text-sm">📞 {worker.phone}</p>
                )}
                <p className="text-lg font-semibold text-blue-600">
                  Salario: ${worker.salary.toFixed(2)}
                </p>
                {worker._count && (
                  <div className="text-sm text-gray-500 pt-2 border-t">
                    <p>Trabajos realizados: {worker._count.jobs}</p>
                    <p>Pagos recibidos: {worker._count.payments}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(worker)} className="btn-secondary flex-1">
                  Editar
                </button>
                <button onClick={() => handleDelete(worker.id)} className="btn-danger flex-1">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {workers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay trabajadores registrados</p>
            <button onClick={openNewModal} className="btn-primary mt-4">
              Agregar Primer Trabajador
            </button>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">
                {editingWorker ? "Editar Trabajador" : "Nuevo Trabajador"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salario ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-gray-700">
                    Trabajador activo
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingWorker ? "Actualizar" : "Crear"}
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
