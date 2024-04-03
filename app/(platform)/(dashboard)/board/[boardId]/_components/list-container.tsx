"use client";

import { ListWithCards } from "@/types";
import { useEffect, useState } from "react";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import ListItem from "./list-item";
import ListForm from "./list-form";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}


// Reordena la lista
function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export default function ListContainer({ boardId, data }: ListContainerProps) {
  const [orderData, setOrderData] = useState(data);

  const {execute: executeUpdateListOrder} = useAction(updateListOrder, {
    onSuccess: (data) => {
      toast.success("List reorder");
    },
    onError: (error) => {
      toast.error(error);
    },
  })

  const {execute: executeUpdateCardOrder} = useAction(updateCardOrder, {
    onSuccess: (data) => {
      toast.success("Card reorder");
    },
    onError: (error) => {
      toast.error(error);
    },
  })

  // Actualiza el estado de las listas cuando se actualiza el data
  useEffect(() => {
    setOrderData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { source, destination, type } = result;

    if (!destination) {
      return; // Si no hay destino no hace nada (rompe la funcion)
    }

    // Si el destino es el mismo que el origen no hace nada
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Si el tipo de drag es list
    if (type === "list") {
      const items = reorder(orderData, source.index, destination.index).map(
        (list, index) => ({ ...list, order: index })
      );

      setOrderData(items);
      // TODO: trigger server action
      executeUpdateListOrder({ boardId, items });
    }

    // Si el tipo de drag es card
    if (type === "card") {
      let newOrderData = [...orderData];

      // Encuentra la lista de origen y destino
      const sourceList = newOrderData.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      // Verificar si la tarjeta existe en la lista de origen
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Verificar si la tarjeta existe en la lista de destino
      if (!destList.cards) {
        destList.cards = [];
      }

      // Moviendo la tarjeta en la misma lista
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        // Actualizar el orden de las tarjetas
        reorderedCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderedCards;

        setOrderData(newOrderData);
        // TODO: trigger server action
        executeUpdateCardOrder({ boardId, items: reorderedCards });

        // Moviendo la tarjeta a otra lista
      } else {
        // Remover la tarjeta de la lista de origen
        const [removedCard] = sourceList.cards.splice(source.index, 1);

        // Asignar el new listId a la tarjeta
        removedCard.listId = destination.droppableId;

        // Insertar la tarjeta en la lista de destino
        destList.cards.splice(destination.index, 0, removedCard);

        // Actualizar el orden de las tarjetas
        sourceList.cards.forEach((card, index) => {
          card.order = index;
        })

        // Actualizar el orden de las tarjetas
        destList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderData(newOrderData);
        // TODO: trigger server action
        executeUpdateCardOrder({ boardId, items: destList.cards });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}
