import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener todos los trabajos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const status = searchParams.get('status');

    let where: any = {};

    if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59);
      where.date = {
        gte: startDate,
        lte: endDate
      };
    }

    if (status) {
      where.status = status;
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        service: true,
        worker: true
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener trabajos" },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo trabajo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      serviceId,
      workerId,
      vehicleType,
      vehiclePlate,
      customerName,
      customerPhone,
      price,
      status,
      notes,
      date
    } = body;

    const job = await prisma.job.create({
      data: {
        serviceId,
        workerId: workerId || null,
        vehicleType,
        vehiclePlate,
        customerName,
        customerPhone,
        price: parseFloat(price),
        status: status || 'completado',
        notes,
        date: date ? new Date(date) : new Date(),
      },
      include: {
        service: true,
        worker: true
      }
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: "Error al crear trabajo" },
      { status: 500 }
    );
  }
}
