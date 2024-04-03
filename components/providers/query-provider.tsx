"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import React from "react";

// El query provider es un componente que envuelve a toda la aplicación y provee de un cliente de queries a todos los componentes que lo necesiten, esto sirve para que no se creen múltiples instancias del cliente de queries y se pueda compartir el estado de las queries entre todos los componentes que lo necesiten.
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
