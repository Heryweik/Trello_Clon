'use client'

import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types"
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface ActionsProps {
  data: CardWithList;
}

export default function Actions({ data }: ActionsProps) {

  const params = useParams()
  const cardModal = useCardModal()

  const {execute: executeDeleteCard, isLoading: isLoadingDelete} = useAction(deleteCard, {
    onSuccess: (data) => {
      toast.success(`Card "${data.title}" deleted`)
      cardModal.onClose()
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  const {execute: executeCopyCard, isLoading: isLoadingCopy} = useAction(copyCard, {
    onSuccess: (data) => {
      toast.success(`Card "${data.title}" copied`)
      cardModal.onClose()
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  const onCopy = () => {
    const boardId = params.boardId as string

    executeCopyCard({
      boardId,
      id: data.id
    })
  }

  const onDelete = () => {
    const boardId = params.boardId as string

    executeDeleteCard({
      boardId,
      id: data.id
    })
  }

  return (
    <div className="space-y-2 mt-2">
      <p className="text-sm font-semibold">Actions</p>
      <Button
        className="w-full justify-start"
        variant={"gray"}
        size={"inline"}
        onClick={onCopy}
        disabled={isLoadingCopy}
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy
      </Button>
      <Button
        className="w-full justify-start"
        variant={"gray"}
        size={"inline"}
        onClick={onDelete}
        disabled={isLoadingDelete}
      >
        <Trash className="w-4 h-4 mr-2" />
        Delete
      </Button>
    </div>
  )
}

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="h-4 w-20 bg-neutral-200" />
      <Skeleton className="h-8 w-full bg-neutral-200" />
      <Skeleton className="h-8 w-full bg-neutral-200" />
    </div>
  )
}