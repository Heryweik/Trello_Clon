/* 'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export default async function deleteBoard(id: string) {
  await db.board.delete({
    where: {
      id,
    },
  })

  Recarga al info que hay en este apartado
  revalidatePath('/organization/org_2dv8KIep6nZPjiXk2jNaVwzFAwW')
} */
