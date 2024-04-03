import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { cardId: string } }
) {
    try {
        const {userId, orgId} = auth()

        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Busca la tarjeta por el id y la lista a la que pertenece, ademas de la informacion de la tarjeta esta incluye el titulo de la lista
        const card = await db.card.findUnique({
            where: {
                id: params.cardId,
                list: {
                    board: {
                        orgId
                    }
                
                }
            },
            include: {
                list: {
                    select: {
                        title: true
                    }
                }
            }
        })

        return NextResponse.json(card)

    } catch (error) {
        return new NextResponse("Internar Error", { status: 500})
    }
}