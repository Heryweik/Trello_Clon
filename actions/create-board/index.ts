'use server'

import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

import { db } from "@/lib/db"
import { createSafeAction } from "@/lib/create-safe-action"
import { createAuditLog } from "@/lib/create-audit-log"
import { hasAvailableCount, incrementAvailableCount } from "@/lib/org-limit"

import { InputType, ReturnType } from "./types"
import { CreateBoard } from "./schema"
import { checkSubscription } from "@/lib/subscription"

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()

    if (!userId || !orgId) {
        return {
            error: 'Unauthorized',
        }
    }

    const canCreate = await hasAvailableCount()
    const isPro = await checkSubscription()

    // Si es falso, no se puede crear
    if (!canCreate && !isPro) {
        return {
            error: 'You have reached your limit of free boards. Please upgrade to create more.',
        }
    }

    const { title, image } = data

    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
    ] = image.split("|") // indicamos el elemento que separa el valor de la imagen

    

    if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
        return {
            error: 'Missing field. Failed to create board',
        }
    }

    let board

    try {
        /* Error arificial */
        /* throw new Error('Failed to create') */
        board = await db.board.create({
            data: {
                orgId,
                title,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageUserName,
                imageLinkHTML,
            }
        })

        if (!isPro) {
            await incrementAvailableCount()
        }

        await createAuditLog({
            entityTitle: board.title,
            entityId: board.id,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.CREATE,
        
        })

    } catch (error) {
        return {
            error: 'Failed to create',
        }
    }

    revalidatePath(`/organization/${board.id}`)
    return {
        data: board,
    }
}

export const createBoard = createSafeAction(CreateBoard, handler)