import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

async function getDashboardStats() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Ingresos del día
  const todayJobs = await prisma.job.findMany({
    where: {
      date: { gte: todayStart, lte: todayEnd },
      status: "completado"
    }
  });
  const todayIncome = todayJobs.reduce((sum, job) => sum + job.price, 0);

  // Ingresos de la semana
  const weekJobs = await prisma.job.findMany({
    where: {
      date: { gte: weekStart, lte: weekEnd },
      status: "completado"
    }
  });
  const weekIncome = weekJobs.reduce((sum, job) => sum + job.price, 0);

  // Ingresos del mes
  const monthJobs = await prisma.job.findMany({
    where: {
      date: { gte: monthStart, lte: monthEnd },
      status: "completado"
    }
  });
  const monthIncome = monthJobs.reduce((sum, job) => sum + job.price, 0);

  // Gastos del mes
  const monthExpenses = await prisma.expense.findMany({
    where: {
      date: { gte: monthStart, lte: monthEnd }
    }
  });
  const totalExpenses = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Trabajos realizados hoy
  const todayJobsCount = todayJobs.length;

  // Trabajadores activos
  const activeWorkers = await prisma.worker.count({
    where: { active: true }
  });

  // Servicios más vendidos del mes
  const topServices = await prisma.job.groupBy({
    by: ['serviceId'],
    where: {
      date: { gte: monthStart, lte: monthEnd },
      status: "completado"
    },
    _count: { serviceId: true },
    _sum: { price: true },
    orderBy: {
      _count: { serviceId: 'desc' }
    },
    take: 5
  });

  const servicesWithNames = await Promise.all(
    topServices.map(async (item) => {
      const service = await prisma.service.findUnique({
        where: { id: item.serviceId }
      });
      return {
        name: service?.name || 'Desconocido',
        count: item._count.serviceId,
        total: item._sum.price || 0
      };
    })
  );

  return {
    today: {
      income: todayIncome,
      jobs: todayJobsCount
    },
    week: {
      income: weekIncome,
      jobs: weekJobs.length
    },
    month: {
      income: monthIncome,
      expenses: totalExpenses,
      profit: monthIncome - totalExpenses,
      jobs: monthJobs.length
    },
    activeWorkers,
    topServices: servicesWithNames
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats del día */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Ingresos Hoy</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ${stats.today.income.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stats.today.jobs} trabajos</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Ingresos Semana</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              ${stats.week.income.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stats.week.jobs} trabajos</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Ingresos Mes</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              ${stats.month.income.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stats.month.jobs} trabajos</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Ganancia Mes</p>
            <p className={`text-3xl font-bold mt-2 ${stats.month.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${stats.month.profit.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Gastos: ${stats.month.expenses.toFixed(2)}</p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Servicios más vendidos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Servicios Más Vendidos (Este Mes)</h2>
            <div className="space-y-3">
              {stats.topServices.length > 0 ? (
                stats.topServices.map((service, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.count} ventas</p>
                    </div>
                    <p className="text-lg font-semibold text-green-600">
                      ${service.total.toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No hay datos de servicios</p>
              )}
            </div>
          </div>

          {/* Resumen general */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen General</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trabajadores Activos</span>
                <span className="text-2xl font-bold text-blue-600">{stats.activeWorkers}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-gray-600">Promedio por Trabajo (Mes)</span>
                <span className="text-xl font-semibold text-gray-900">
                  ${stats.month.jobs > 0 ? (stats.month.income / stats.month.jobs).toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-gray-600">Total Trabajos (Mes)</span>
                <span className="text-xl font-semibold text-gray-900">{stats.month.jobs}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/trabajos" className="btn-primary text-center">
              Nuevo Trabajo
            </a>
            <a href="/gastos" className="btn-secondary text-center">
              Registrar Gasto
            </a>
            <a href="/servicios" className="btn-secondary text-center">
              Ver Servicios
            </a>
            <a href="/trabajadores" className="btn-secondary text-center">
              Ver Trabajadores
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
