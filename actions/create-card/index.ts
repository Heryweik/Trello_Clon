'use server'

import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

import { db } from "@/lib/db"
import { createSafeAction } from "@/lib/create-safe-action"
import { createAuditLog } from "@/lib/create-audit-log"

import { InputType, ReturnType } from "./types"
import { CreateCard } from "./schema"

const handler = async (data: InputType): Promise<ReturnType> => {

    const {userId, orgId} = auth()

    if (!userId || !orgId) {
        return {
            error: "Unauthenticated",
        }
    }

    const {boardId, title, listId} = data
    let card

    try {
        const list = await db.list.findUnique({
            where: {
                id: listId,
                boardId,
                board: {
                    orgId,
                },
            },
        })

        if (!list) {
            return {
                error: 'List not found',
            }
        }

        const listCard = await db.card.findFirst({
            where: {
                listId,
            },
            orderBy: {
                order: 'desc',
            },
            select: {
                order: true,
            },
        })

        const newOrder = listCard ? listCard.order + 1 : 1

        card = await db.card.create({
            data: {
                title,
                listId,
                order: newOrder,
            },
        })

        // Maneja el registro de cambios en la base de datos sobre las cards
        await createAuditLog({
            action: ACTION.CREATE,
            entityId: card.id,
            entityTitle: card.title,
            entityType: ENTITY_TYPE.CARD,
        })

    } catch (error) {
        return {
            error: 'Failed to create list',
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {
        data: card,
    }
}

export const createCard = createSafeAction(CreateCard, handler)