import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.restaurant.updateMany({
    data: {
      isPrivate: false,
      ownerId: 1,
    },
  })
  console.log("Updated all restaurants")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
