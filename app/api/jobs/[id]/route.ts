import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT - Actualizar trabajo
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const job = await prisma.job.update({
      where: { id: params.id },
      data: {
        serviceId,
        workerId: workerId || null,
        vehicleType,
        vehiclePlate,
        customerName,
        customerPhone,
        price: parseFloat(price),
        status,
        notes,
        date: date ? new Date(date) : undefined,
      },
      include: {
        service: true,
        worker: true
      }
    });

    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar trabajo" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar trabajo
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.job.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar trabajo" },
      { status: 500 }
    );
  }
}
