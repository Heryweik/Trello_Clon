"use client";

import { useQuery } from "@tanstack/react-query";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { AuditLog } from "@prisma/client";

import Header from "./header";
import Description from "./description";
import Actions from "./actions";
import Activity from "./activity";

export default function CardModal() {
  // Obtiene el id de la tarjeta y si el modal está abierto o cerrado, esta informacion se obtiene del hook useCardModal, a este hook le enviamos el id desde el componenet card-item.tsx
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  // Hace fetch a la api para obtener la información de las tarjetas de una lista (El fetcher es una función que hace fetch a una url y devuelve el json de la respuesta y se encuentra en lib/fetcher.ts)
  // El hook useQuery recibe un objeto con la key de la query y la función que se ejecutará para obtener los datos, en general react-query es usada por desarrolladores para hacer fetch a una url y obtener los datos de la respuesta
  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/cards/${id}`),
  });

  const { data: auditLogsData } = useQuery<AuditLog[]>({
    // La key de la query es un array con el nombre de la query y el id de la tarjeta, el nombre de la query sirve para identificarla y el id de la tarjeta es necesario para hacer fetch a la url correcta
    queryKey: ["card-logs", id],
    queryFn: () => fetcher(`/api/cards/${id}/logs`),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? (
                <Description.Skeleton />
              ) : (
                <Description data={cardData} />
              )}
              {!auditLogsData ? (
                <Activity.Skeleton />
              ) : (
                <Activity items={auditLogsData} />
              )}
            </div>
          </div>
          {!cardData ? <Actions.Skeleton /> : <Actions data={cardData}/>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
