'use server'

import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"
import { ACTION, ENTITY_TYPE } from "@prisma/client"
import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { createSafeAction } from "@/lib/create-safe-action"
import { createAuditLog } from "@/lib/create-audit-log"

import { InputType, ReturnType } from "./types"
import { DeleteBoard } from "./schema"
import { decreaseAvailableCount } from "@/lib/org-limit"
import { checkSubscription } from "@/lib/subscription"

const handler = async (data: InputType): Promise<ReturnType> => {

    const {userId, orgId} = auth()
    
    if (!userId || !orgId) {
        return {
            error: "Unauthenticated",
        }
    }
    
    const isPro = await checkSubscription()
    
    const {id} = data
    let board

    try {
        board = await db.board.delete({
            where: {
                id,
                orgId,
            }
        })

        if (!isPro) {
            await decreaseAvailableCount()
        }

        await createAuditLog({
            entityTitle: board.title,
            entityId: board.id,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.DELETE,
        
        })

    } catch (error) {
        return {
            error: 'Failed to update delete',
        }
    }

    revalidatePath(`/organization/${orgId}`)
    redirect(`/organization/${orgId}`)
}

export const deleteBoard = createSafeAction(DeleteBoard, handler)