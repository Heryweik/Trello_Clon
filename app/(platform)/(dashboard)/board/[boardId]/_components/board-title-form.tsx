"use client";

import { toast } from "sonner";
import { Board } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";

import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import {updateBoard} from '@/actions/update-board'
import { useAction } from "@/hooks/use-action";

interface BoardTitleFormProps {
  data: Board;
}

export default function BoardTitleForm({ data }: BoardTitleFormProps) {

    const {execute, fieldErrors} = useAction(updateBoard, {
        onSuccess: (data) => {
            toast.success(`Board "${data.title}" updated!`)
            setTitle(data.title)
            disableEditing()
        },
        onError: (error) => {
            toast.error(error)
        }
    
    })

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [title, setTitle] = useState(data.title); // [1
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    
    execute({
        id: data.id,
        title
    })
  };

  // Con esto hace que cuando se pierda el foco se envie el formulario (Se envia aun cuando no le doy enter)
  const onBlur = () => {
    formRef.current?.requestSubmit();
  }

  if (isEditing) {
    return (
      <form
        action={onSubmit}
        ref={formRef}
        className="flex items-center gap-x-2"
      >
        <FormInput
          ref={inputRef}
          /* errors={fieldErrors} Funciona pero aparece debajo, crear otro input en el que el error aparezca como alerta*/
          id="title"
          onBlur={onBlur}
          defaultValue={title}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    );
  }

  return (
    <Button
      onClick={enableEditing}
      className="font-bold text-lg h-auto w-auto p-1 px-2"
      variant="transparent"
    >
      {title}
    </Button>
  );
}
