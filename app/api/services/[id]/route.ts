import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT - Actualizar servicio
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, price, duration, active } = body;

    const service = await prisma.service.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: parseFloat(price),
        duration: duration ? parseInt(duration) : null,
        active
      }
    });

    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar servicio" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar servicio
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.service.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar servicio" },
      { status: 500 }
    );
  }
}
