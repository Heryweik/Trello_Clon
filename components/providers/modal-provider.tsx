'use client'

import { useEffect, useState } from 'react'
import CardModal from '@/components/modals/card-modal'
import ProModal from '@/components/modals/pro-modal'

// Esto se crea para que el modal se monte en el DOM y evitar errores de hidratación
export default function ModalProvider() {

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, []) 

    if (!isMounted) {
        return null
    }

  return (
    <>
        <CardModal />
        <ProModal />
    </>
  )
}
