import { auth } from "@clerk/nextjs";
import { db } from "./db";


const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
    const {orgId} = auth()

    if (!orgId) {
        return false;
    }

    const orgSubscription = await db.orgSubscription.findUnique({
        where: {
            orgId,
        },
        select: {
            stripeSubscriptionId: true,
            stripeCustomerId: true,
            stripePriceId: true,
            stripeCurrentPeriodEnd: true,
        }
    });

    if (!orgSubscription) {
        return false;
    }

    const isValid = orgSubscription.stripePriceId && orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

    // Return true if the subscription is valid
    // Las !! convierten el valor en un booleano
    return !!isValid;
}