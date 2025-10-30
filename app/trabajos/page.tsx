"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface Service {
  id: string;
  name: string;
  price: number;
}

interface Worker {
  id: string;
  name: string;
}

interface Job {
  id: string;
  serviceId: string;
  service: Service;
  workerId: string | null;
  worker: Worker | null;
  vehicleType: string | null;
  vehiclePlate: string | null;
  customerName: string | null;
  customerPhone: string | null;
  price: number;
  status: string;
  notes: string | null;
  date: string;
}

export default function TrabajosPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    serviceId: "",
    workerId: "",
    vehicleType: "",
    vehiclePlate: "",
    customerName: "",
    customerPhone: "",
    price: "",
    status: "completado",
    notes: "",
    date: format(new Date(), "yyyy-MM-dd")
  });
  const [filterMonth, setFilterMonth] = useState("");

  useEffect(() => {
    fetchJobs();
    fetchServices();
    fetchWorkers();
  }, [filterMonth]);

  const fetchJobs = async () => {
    const url = filterMonth
      ? `/api/jobs?month=${filterMonth}`
      : "/api/jobs";
    const res = await fetch(url);
    const data = await res.json();
    setJobs(data);
  };

  const fetchServices = async () => {
    const res = await fetch("/api/services");
    const data = await res.json();
    setServices(data.filter((s: Service & { active: boolean }) => s.active));
  };

  const fetchWorkers = async () => {
    const res = await fetch("/api/workers");
    const data = await res.json();
    setWorkers(data.filter((w: Worker & { active: boolean }) => w.active));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      workerId: formData.workerId || null
    };

    if (editingJob) {
      await fetch(`/api/jobs/${editingJob.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData)
      });
    } else {
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData)
      });
    }

    setIsModalOpen(false);
    setEditingJob(null);
    resetForm();
    fetchJobs();
  };

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    setFormData({
      ...formData,
      serviceId,
      price: service ? service.price.toString() : ""
    });
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      serviceId: job.serviceId,
      workerId: job.workerId || "",
      vehicleType: job.vehicleType || "",
      vehiclePlate: job.vehiclePlate || "",
      customerName: job.customerName || "",
      customerPhone: job.customerPhone || "",
      price: job.price.toString(),
      status: job.status,
      notes: job.notes || "",
      date: format(new Date(job.date), "yyyy-MM-dd")
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este trabajo?")) {
      await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      fetchJobs();
    }
  };

  const resetForm = () => {
    setFormData({
      serviceId: "",
      workerId: "",
      vehicleType: "",
      vehiclePlate: "",
      customerName: "",
      customerPhone: "",
      price: "",
      status: "completado",
      notes: "",
      date: format(new Date(), "yyyy-MM-dd")
    });
  };

  const openNewModal = () => {
    setEditingJob(null);
    resetForm();
    setIsModalOpen(true);
  };

  const totalRevenue = jobs
    .filter(j => j.status === "completado")
    .reduce((sum, job) => sum + job.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trabajos Realizados</h1>
          <button onClick={openNewModal} className="btn-primary">
            + Registrar Trabajo
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Ingresos por Trabajos</p>
              <p className="text-3xl font-bold text-green-600">
                ${totalRevenue.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {jobs.filter(j => j.status === "completado").length} trabajos completados
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente/Vehículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trabajador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
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
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(job.date), "dd/MM/yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {job.service.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {job.customerName && <div>{job.customerName}</div>}
                      {job.vehicleType && (
                        <div className="text-xs text-gray-500">
                          {job.vehicleType} {job.vehiclePlate && `- ${job.vehiclePlate}`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.worker?.name || "Sin asignar"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded ${
                        job.status === 'completado'
                          ? 'bg-green-100 text-green-800'
                          : job.status === 'pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      ${job.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(job)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay trabajos registrados</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8">
              <h2 className="text-2xl font-bold mb-6">
                {editingJob ? "Editar Trabajo" : "Registrar Nuevo Trabajo"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Servicio *
                    </label>
                    <select
                      value={formData.serviceId}
                      onChange={(e) => handleServiceChange(e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">Seleccionar servicio</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} - ${service.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trabajador
                    </label>
                    <select
                      value={formData.workerId}
                      onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Sin asignar</option>
                      {workers.map((worker) => (
                        <option key={worker.id} value={worker.id}>
                          {worker.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Cliente
                    </label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Vehículo
                    </label>
                    <input
                      type="text"
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                      className="input-field"
                      placeholder="Sedan, SUV, Pickup, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Placa
                    </label>
                    <input
                      type="text"
                      value={formData.vehiclePlate}
                      onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Precio ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="input-field"
                    >
                      <option value="completado">Completado</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="cancelado">Cancelado</option>
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingJob ? "Actualizar" : "Registrar"}
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
