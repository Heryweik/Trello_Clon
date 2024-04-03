'use client'

import { List } from "@prisma/client"
import { ElementRef, useRef, useState } from "react"
import { toast } from "sonner"
import { useEventListener } from "usehooks-ts"

import { FormInput } from "@/components/form/form-input"
import { useAction } from "@/hooks/use-action"
import { updateList } from "@/actions/update-list"
import ListOptions from "./list-options"

interface ListHeaderProps {
    data: List,
    onAddCard: () => void
}

export default function ListHeader({ data, onAddCard }: ListHeaderProps) {

    const [title, setTitle] = useState(data.title)
    const [isEditing, setIsEditing] = useState(false)

    const formRef = useRef<ElementRef<"form">>(null)
    const inputRef = useRef<ElementRef<"input">>(null)

    const enableEditing = () => {
        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.select()
        })
    }

    const disableEditing = () => {
        setIsEditing(false)
    }

    const {execute} = useAction(updateList, {
        onSuccess: (data) => {
            toast.success(`Rename to "${data.title}"`)
            setTitle(data.title)
            disableEditing()
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    const onSubmit = (formData: FormData) => {
        const title = formData.get('title') as string
        const id = formData.get('id') as string
        const boardId = formData.get('boardId') as string

        if (title === data.title) {
            return disableEditing()
        }

        execute({title, id, boardId})
    }

    // Con esto hace que cuando se pierda el foco se envie el formulario (Se envia aun cuando no le doy enter)
    // Es otra opcion a usar useOnClickOutside, con al diferencia que este use no envia nada solo se desabilita
    const onBlur = () => {
        formRef.current?.requestSubmit()
    }

    const onkeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            formRef.current?.requestSubmit()
        }
    }

    useEventListener('keydown', onkeydown)

  return (
    <div className="text-sm font-semibold flex justify-between items-start gap-x-2">
        {isEditing ? (
            <form ref={formRef}
            action={onSubmit}
                className="flex-1 px-[2px]"
            >
                <input hidden id="id" name="id" defaultValue={data.id} />
                <input hidden id="boardId" name="boardId" defaultValue={data.boardId} />
                <FormInput
                    ref={inputRef}
                    onBlur={onBlur}
                    id="title"
                    placeholder="Enter list title..."
                    defaultValue={title}
                    className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent"
                />
                <button hidden type="submit" />
            </form>
        ) : (
             <div 
             onClick={enableEditing}
             className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent truncate">
             {title}
         </div>
        )}
       <ListOptions 
        onAddCard={onAddCard}
        data={data}
       />
    </div>
  )
}
