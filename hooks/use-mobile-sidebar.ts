import {create} from 'zustand'

type MobileSidebarState = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

/* Esta es una funcion que se come el return, porque al agregar el parentesis le decimos que inmediatamente va retornar lo que este dentro */
export const useMobileSidebar = create<MobileSidebarState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))
