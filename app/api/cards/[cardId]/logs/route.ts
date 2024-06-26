import { auth } from "@clerk/nextjs"
import { ENTITY_TYPE } from "@prisma/client"
import { NextResponse } from "next/server"

import { db } from "@/lib/db"

export async function GET(
    request: Request,
    { params }: { params: { cardId: string } }
) {
    try {
        const {userId, orgId} = auth()

        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const auditLogs = await db.auditLog.findMany({
            where: {
                entityId: params.cardId,
                entityType: ENTITY_TYPE.CARD,
                orgId
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 3,
        })

        return NextResponse.json(auditLogs)

    } catch (error) {
        return new NextResponse("Internar Error", { status: 500})
    }
}