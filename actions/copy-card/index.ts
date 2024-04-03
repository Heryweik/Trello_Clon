'use server'

import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { createSafeAction } from "@/lib/create-safe-action"

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