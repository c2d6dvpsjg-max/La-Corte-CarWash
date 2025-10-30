import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Obtener todos los trabajadores
export async function GET() {
  try {
    const workers = await prisma.worker.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { jobs: true, payments: true }
        }
      }
    });
    return NextResponse.json(workers);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener trabajadores" },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo trabajador
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, salary } = body;

    const worker = await prisma.worker.create({
      data: {
        name,
        phone,
        salary: parseFloat(salary) || 0,
      }
    });

    return NextResponse.json(worker, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear trabajador" },
      { status: 500 }
    );
  }
}
