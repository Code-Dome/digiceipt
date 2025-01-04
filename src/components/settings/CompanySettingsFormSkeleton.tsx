import { Skeleton } from "@/components/ui/skeleton";

export const CompanySettingsFormSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" /> {/* Label skeleton */}
        <Skeleton className="h-10 w-full" /> {/* Input skeleton */}
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-24 w-full" /> {/* Address textarea skeleton */}
      </div>

      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-48 w-full" /> {/* Terms textarea skeleton */}
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" /> {/* Save button skeleton */}
        <Skeleton className="h-10 w-32" /> {/* Clear button skeleton */}
      </div>
    </div>
  );
};