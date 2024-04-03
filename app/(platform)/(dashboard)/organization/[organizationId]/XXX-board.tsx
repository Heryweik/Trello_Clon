import deleteBoard from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import FormButtonDelete from "./XXX-form-button-delete";

interface BoardProps {
  title: string;
  id: string;
}

export default function Board({ title, id }: BoardProps) {

    /* Bind se usa al crear una funcion que depende de otra, el argumento null es una de los requerimientos de esta funcion, realmente el argumento es this, pero aqui lo usamos como null */
    const deleteBoardWithId = deleteBoard.bind(null, id);

  return (
    <form action={deleteBoardWithId} className="flex items-center gap-x-2">
      <p>Board title: {title}</p>
      <FormButtonDelete />
    </form>
  );
}
