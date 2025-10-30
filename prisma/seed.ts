import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear usuario admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lacorte.com' },
    update: {},
    create: {
      email: 'admin@lacorte.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'admin',
    },
  })
  console.log('✅ Usuario admin creado:', admin.email)

  // Crear servicios iniciales
  const servicios = [
    {
      name: 'Lavado Básico',
      description: 'Lavado exterior básico del vehículo',
      price: 150.00,
      duration: 30,
    },
    {
      name: 'Lavado Detallado',
      description: 'Lavado exterior e interior completo',
      price: 300.00,
      duration: 60,
    },
    {
      name: 'Encerado',
      description: 'Encerado y pulido de la carrocería',
      price: 500.00,
      duration: 90,
    },
    {
      name: 'Porcelanizado Completo',
      description: 'Tratamiento de porcelanizado para protección duradera',
      price: 1500.00,
      duration: 180,
    },
  ]

  for (const servicio of servicios) {
    const created = await prisma.service.upsert({
      where: { id: '' }, // Force create
      update: {},
      create: servicio,
    }).catch(() => prisma.service.create({ data: servicio }))
    console.log('✅ Servicio creado:', created.name)
  }

  // Crear trabajadores de ejemplo
  const trabajadores = [
    {
      name: 'Juan Pérez',
      phone: '555-1234',
      salary: 500.00,
    },
    {
      name: 'Carlos López',
      phone: '555-5678',
      salary: 500.00,
    },
  ]

  for (const trabajador of trabajadores) {
    const created = await prisma.worker.create({
      data: trabajador,
    })
    console.log('✅ Trabajador creado:', created.name)
  }

  console.log('✅ Seed completado!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error en seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
