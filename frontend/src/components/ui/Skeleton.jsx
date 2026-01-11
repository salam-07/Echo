import React from 'react';
import { cn } from '../../lib/utils';

const Skeleton = ({ className, ...props }) => {
    return (
        <div className={cn('animate-pulse bg-base-200/60 rounded', className)} {...props} />
    );
};

const SkeletonCard = ({ className }) => {
    return (
        <div className={cn('py-4 px-1 border-b border-base-200/40 space-y-3', className)}>
            <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-3 w-12" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex items-center gap-5 pt-1">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-4 w-10" />
            </div>
        </div>
    );
};

Skeleton.Card = SkeletonCard;

export default Skeleton;