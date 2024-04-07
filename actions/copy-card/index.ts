'use server'

import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

import { db } from "@/lib/db"
import { createSafeAction } from "@/lib/create-safe-action"
import { createAuditLog } from "@/lib/create-audit-log"

import { InputType, ReturnType } from "./types"
import { CopyCard } from "./schema"

const handler = async (data: InputType): Promise<ReturnType> => {

    const {userId, orgId} = auth()

    if (!userId || !orgId) {
        return {
            error: "Unauthenticated",
        }
    }

    const {id, boardId} = data
    let card

    try {
        const cartToCopy = await db.card.findUnique({
            where: {
                id,
                list: {
                    board: {
                        orgId,
                    }
                }
            }
        })

        if (!cartToCopy) {
            return {
                error: "Card not found",
            }
        }

        // Obtenemos la última tarjeta de la lista, especificamente el orden
        const lastCard = await db.card.findFirst({
            where: {
                listId: cartToCopy.listId,
            },
            orderBy: {
                order: "desc",
            },
            select: {
                order: true,
            }
        })

        const newOrder = lastCard ? lastCard.order + 1 : 1

        card = await db.card.create({
            data: {
                title: `${cartToCopy.title} - (copy)`,
                description: cartToCopy.description,
                listId: cartToCopy.listId,
                order: newOrder,
            }
        })

        await createAuditLog({
            entityTitle: card.title,
            entityId: card.id,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.CREATE,
        
        })

    } catch (error) {
        return {
            error: 'Failed to copy',
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {
        data: card
    }
}

export const copyCard = createSafeAction(CopyCard, handler)