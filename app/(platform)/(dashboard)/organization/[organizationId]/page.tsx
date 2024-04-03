import { Separator } from "@/components/ui/separator";

import Info from "./_components/info";
import BoardList from "./_components/board-list";
import { Suspense } from "react";

export default async function OrganizationIdPage() {
  /* Aparece en la consola de visual ya que es un server component */
  /* console.log('I am logged'); */

  /* Traemos todos los elementos de la tabla board */
  /* const board = await db.board.findMany(); */

  return (
    <div className="w-full mb-20">
      <Info />
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList />
        </Suspense>
      </div>

      {/* <Form />
      <div className="space-y-2">
          {board.map((board) => (
            <Board key={board.id} title={board.title} id={board.id} />
          ))}
      </div> */}
    </div>
  );
}
