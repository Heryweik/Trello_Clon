import {create} from 'zustand'

type ProModalStore = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

/* Esta es una funcion que se come el return, porque al agregar el parentesis le decimos que inmediatamente va retornar lo que este dentro */
export const useProModal = create<ProModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false}),
}))
