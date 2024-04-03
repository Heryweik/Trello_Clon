"use client";

import { copyList } from "@/actions/copy-list";
import { deleteList } from "@/actions/delete-list";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";

import { List } from "@prisma/client";
import { MoreHorizontal, X } from "lucide-react";
import { ElementRef, useRef } from "react";
import { toast } from "sonner";

interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
}

export default function ListOptions({ data, onAddCard }: ListOptionsProps) {

    const closeRef = useRef<ElementRef<"button">>(null)

    // Elimina la lista
    const {execute: executeDelete} = useAction(deleteList, {
        onSuccess: () => {
            toast.success(`List "${data.title}" deleted`)
            closeRef.current?.click() // hace click en el boton de cerrar el popover
        },
        onError: (error) => {
            toast.error(error)
        }
    })
    
    const onDelete = (formData: FormData) => {
        const id = formData.get('id') as string
        const boardId = formData.get('boardId') as string

        executeDelete({id, boardId})
    }

    // Copia la lista
    const {execute: executeCopy} = useAction(copyList, {
        onSuccess: () => {
            toast.success(`List "${data.title}" copied`)
            closeRef.current?.click() // hace click en el boton de cerrar el popover
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    const onCopy = (formData: FormData) => {
        const id = formData.get('id') as string
        const boardId = formData.get('boardId') as string

        executeCopy({id, boardId})
    }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant={"ghost"}>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          ListActions
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="w-4 h-4" />
          </Button>
        </PopoverClose>
        <Button
            onClick={onAddCard}
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            variant={"ghost"}
        >
            Add Card...
        </Button>
        <form action={onCopy}>
            <input hidden name="id" id="id" defaultValue={data.id} />
            <input hidden name="boardId" id="boardId" defaultValue={data.boardId} />
            <FormSubmit
                variant="ghost"
                className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            >
                Copy list...
            </FormSubmit>
        </form>
        <Separator />
        <form action={onDelete}>
            <input hidden name="id" id="id" defaultValue={data.id} />
            <input hidden name="boardId" id="boardId" defaultValue={data.boardId} />
            <FormSubmit
                variant="ghost"
                className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            >
                Delete this list...
            </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
}
