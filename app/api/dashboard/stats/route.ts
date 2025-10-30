import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const startMonth = startOfMonth(now);
    const endMonth = endOfMonth(now);
    const startToday = startOfDay(now);
    const endToday = endOfDay(now);

    // Obtener todos los trabajos
    const allJobs = await prisma.job.findMany({
      where: {
        status: 'completado',
      },
    });

    // Calcular total de ingresos de trabajos
    const totalIngresosTrabajos = allJobs.reduce((sum, job) => sum + job.price, 0);

    // Obtener ingresos adicionales
    const ingresos = await prisma.income.findMany();
    const totalIngresosAdicionales = ingresos.reduce((sum, income) => sum + income.amount, 0);

    const totalIngresos = totalIngresosTrabajos + totalIngresosAdicionales;

    // Obtener gastos
    const gastos = await prisma.expense.findMany();
    const totalGastos = gastos.reduce((sum, expense) => sum + expense.amount, 0);

    // Calcular ganancia
    const ganancia = totalIngresos - totalGastos;

    // Trabajos de hoy
    const trabajosHoy = allJobs.filter((job) => {
      const jobDate = new Date(job.date);
      return jobDate >= startToday && jobDate <= endToday;
    }).length;

    // Trabajadores activos
    const trabajadoresActivos = await prisma.worker.count({
      where: {
        active: true,
      },
    });

    // Ingresos del mes
    const jobsMes = allJobs.filter((job) => {
      const jobDate = new Date(job.date);
      return jobDate >= startMonth && jobDate <= endMonth;
    });

    const ingresosMes = jobsMes.reduce((sum, job) => sum + job.price, 0);

    const ingresosAdicionalesMes = ingresos.filter((income) => {
      const incomeDate = new Date(income.date);
      return incomeDate >= startMonth && incomeDate <= endMonth;
    }).reduce((sum, income) => sum + income.amount, 0);

    const totalIngresosMes = ingresosMes + ingresosAdicionalesMes;

    // Gastos del mes
    const gastosMes = gastos.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startMonth && expenseDate <= endMonth;
    }).reduce((sum, expense) => sum + expense.amount, 0);

    return NextResponse.json({
      totalIngresos,
      totalGastos,
      ganancia,
      trabajosHoy,
      trabajadoresActivos,
      ingresosMes: totalIngresosMes,
      gastosMes,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}
