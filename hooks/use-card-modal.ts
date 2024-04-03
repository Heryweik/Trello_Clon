import {create} from 'zustand'

type CardModalStore = {
  id?: string
  isOpen: boolean
  onOpen: (id: string) => void
  onClose: () => void
}

/* Esta es una funcion que se come el return, porque al agregar el parentesis le decimos que inmediatamente va retornar lo que este dentro */
export const useCardModal = create<CardModalStore>((set) => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: string) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: undefined}),
}))
