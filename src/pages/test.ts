import { prisma } from '../../lib/prisma'
import { HeroRates } from '@prisma/client'
import { GetServerSideProps } from 'next'

type Props = {
  hero: HeroRates
}

export default function Test(props: Props) {
  return 
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const hero = await prisma.heroRates.findFirst({
    where: {
      id: 2
    }
  })

  console.log(hero)

  return {
    props: {
      hero
    }
  }
}