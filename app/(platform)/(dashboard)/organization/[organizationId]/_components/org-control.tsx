'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useOrganizationList } from '@clerk/nextjs'


/* Creo que es para refrescar la url dependiendo de la organizacion que este activa */
export default function OrgControl() {

    const params = useParams()
    const { setActive } = useOrganizationList()

    useEffect(() => {
        if (!setActive) return

        setActive({
            organization: params.organizationId as string,
        })
    }, [setActive, params.organizationId])

  return  null
}
