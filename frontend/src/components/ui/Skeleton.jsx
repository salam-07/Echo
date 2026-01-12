import React from 'react';
import { cn } from '../../lib/utils';

const Skeleton = ({ className, ...props }) => {
    return (
        <div className={cn('animate-pulse bg-base-content/[0.04] rounded', className)} {...props} />
    );
};

const SkeletonCard = ({ className }) => {
    return (
        <div className={cn('py-4 sm:py-5 border-b border-base-200/40', className)}>
            <div className="space-y-2.5 sm:space-y-3">
                {/* Header - username and timestamp */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-3.5 w-20 rounded" />
                    <Skeleton className="h-3 w-12 rounded" />
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-[95%] rounded" />
                    <Skeleton className="h-4 w-[75%] rounded" />
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 pt-0.5">
                    <Skeleton className="h-3 w-14 rounded" />
                    <Skeleton className="h-3 w-10 rounded" />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-10 rounded" />
                        <Skeleton className="h-4 w-8 rounded" />
                    </div>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-4 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
};

Skeleton.Card = SkeletonCard;

export default Skeleton;