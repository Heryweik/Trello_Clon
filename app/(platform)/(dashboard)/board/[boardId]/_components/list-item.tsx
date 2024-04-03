"use client";

import { ElementRef, useRef, useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";

import { ListWithCards } from "@/types";

import ListHeader from "./list-header";
import { CardForm } from "./card-form";
import { cn } from "@/lib/utils";
import CardItem from "./card-item";

interface ListItemProps {
  data: ListWithCards;
  index: number;
}

export default function ListItem({ data, index }: ListItemProps) {
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    });
  };

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          {" "}
          {/* select-none no permite que se pueda copiar texto */}
          <div 
            {...provided.dragHandleProps}
          className="w-full rounded-md bg-[#f1f2f4] shadow-md p-2">
            <ListHeader onAddCard={enableEditing} data={data} />
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
            <ol
            ref={provided.innerRef}
            {...provided.droppableProps}
              className={cn(
                "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                data.cards.length > 0 ? "mt-2" : "mt-0"
              )}
            >
              {data.cards.map((card, index) => (
                <CardItem key={card.id} data={card} index={index} />
              ))}
              {provided.placeholder}
            </ol>
            )}
            </Droppable>
            <CardForm
              listId={data.id}
              ref={textareaRef}
              isEditing={isEditing}
              disableEditing={disableEditing}
              enableEditing={enableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
}
