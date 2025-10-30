import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT - Actualizar gasto
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { description, amount, category, date } = body;

    const expense = await prisma.expense.update({
      where: { id: params.id },
      data: {
        description,
        amount: parseFloat(amount),
        category,
        date: date ? new Date(date) : undefined,
      }
    });

    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar gasto" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar gasto
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.expense.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar gasto" },
      { status: 500 }
    );
  }
}
