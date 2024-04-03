'use server'

import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { createSafeAction } from "@/lib/create-safe-action"

import { InputType, ReturnType } from "./types"
import { CreateBoard } from "./schema"

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()

    if (!userId || !orgId) {
        return {
            error: 'Unauthorized',
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