import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener todos los ingresos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    let where = {};
    if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59);
      where = {
        date: {
          gte: startDate,
          lte: endDate
        }
      };
    }

    const income = await prisma.income.findMany({
      where,
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(income);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener ingresos" },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo ingreso
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description, amount, category, date } = body;

    const income = await prisma.income.create({
      data: {
        description,
        amount: parseFloat(amount),
        category,
        date: date ? new Date(date) : new Date(),
      }
    });

    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear ingreso" },
      { status: 500 }
    );
  }
}
