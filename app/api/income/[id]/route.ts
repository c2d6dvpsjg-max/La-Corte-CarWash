import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT - Actualizar ingreso
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { description, amount, category, date } = body;

    const income = await prisma.income.update({
      where: { id: params.id },
      data: {
        description,
        amount: parseFloat(amount),
        category,
        date: date ? new Date(date) : undefined,
      }
    });

    return NextResponse.json(income);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar ingreso" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar ingreso
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.income.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar ingreso" },
      { status: 500 }
    );
  }
}
