import { Skeleton } from "@/components/ui/skeleton";

export function InfoTextSkeleton() {
    return (
        <div className="flex flex-col items-center gap-2 mt-5">
            <Skeleton className="w-[300px] h-2" />
            <Skeleton className="w-[200px] h-2 " />
        </div>
    );
}
