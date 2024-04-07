
import {auth, currentUser} from "@clerk/nextjs";
import {ACTION, ENTITY_TYPE} from "@prisma/client"

import { db } from "@/lib/db";

interface Props {
    action: ACTION;
    entityType: ENTITY_TYPE;
    entityId: string;
    entityTitle: string;
}

export const createAuditLog = async (props: Props) => {
    
    try {
        const {orgId} = auth()
        const user = await currentUser();

        if (!user || !orgId) {
            throw new Error("User not found");
        }

        const {entityId, entityTitle, entityType, action} = props;

        await db.auditLog.create({
            data: {
                orgId,
                action, // action: action
                entityType,
                entityId,
                entityTitle,
                userId: user.id,
                userImage: user?.imageUrl,
                userName: user?.firstName + " " + user?.lastName,
            },
        });

    } catch (error) {
        console.error("[AUDIT_LOG_ERROR]", error);
    }
};