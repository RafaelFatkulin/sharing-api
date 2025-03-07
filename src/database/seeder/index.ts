import { db } from '@database'
import { table } from '@database/schemas'

async function manualSeed() {
  const hashedPassword = await Bun.password.hash('password', 'bcrypt')
  await db.insert(table.users).values([
    {
      fullName: 'superadmin',
      email: 'superadmin@vk.com',
      password: hashedPassword,
      role: 'superadmin',
    },
    {
      fullName: 'admin',
      email: 'admin@vk.com',
      password: hashedPassword,
      role: 'admin',
    },
  ])
}

(async () => {
  await manualSeed()
  console.log('Manual seeding completed!')
})()
