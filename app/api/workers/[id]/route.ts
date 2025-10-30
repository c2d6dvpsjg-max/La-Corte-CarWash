import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT - Actualizar trabajador
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, phone, salary, active } = body;

    const worker = await prisma.worker.update({
      where: { id: params.id },
      data: {
        name,
        phone,
        salary: parseFloat(salary),
        active
      }
    });

    return NextResponse.json(worker);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar trabajador" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar trabajador
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.worker.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar trabajador" },
      { status: 500 }
    );
  }
}
