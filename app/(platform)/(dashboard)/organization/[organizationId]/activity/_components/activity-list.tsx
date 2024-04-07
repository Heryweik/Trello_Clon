import ActivityItem from "@/components/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function ActivityList() {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const auditLog = await db.auditLog.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <ol className="space-y-4 mt-4">
      {/* Con last:block le decimos que el parrafo se vera cuando el sea el ultimo elemento, si hay mas elementos entonces no se  muestra */}
      <p className="hidden last:block text-sm text-center text-muted-foreground">
        No activity founde inside this organization
      </p>

      {/* 
        Ejemplo de first:block
      <p className="first:block hidden">Hola</p>
        */}

      {auditLog.map((log) => (
        <ActivityItem key={log.id} data={log} />
      ))}
    </ol>
  );
}

ActivityList.Skeleton = function ActivityListSkeleton() {
    return (
        <ol className="space-y-4 mt-4">
            <Skeleton className="h-14 w-[80%]" />
            <Skeleton className="h-14 w-[60%]" />
            <Skeleton className="h-14 w-[70%]" />
            <Skeleton className="h-14 w-[40%]" />
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-14 w-[70%]" />
            <Skeleton className="h-14 w-[70%]" />
        </ol>
    );
}
