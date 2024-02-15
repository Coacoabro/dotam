import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.heroRates.upsert({
    where: { id: 2 },
    update: {},
    create: {
      hero: 'Crystal Maiden',
      matches: 100,
      wins: 47,
    },
  })
  console.log({ user })
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })