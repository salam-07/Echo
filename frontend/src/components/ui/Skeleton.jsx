import React from 'react';
import { cn } from '../../lib/utils';

const Skeleton = ({ className, ...props }) => {
    return (
        <div className={cn('animate-pulse bg-base-content/[0.06] rounded', className)} {...props} />
    );
};

const SkeletonCard = ({ className }) => {
    return (
        <div className={cn('py-5 sm:py-6 border-b border-base-200/30', className)}>
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <Skeleton className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex-shrink-0" />

                {/* Content */}
                <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-12" />
                    </div>

                    {/* Body */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[90%]" />
                        <Skeleton className="h-4 w-[70%]" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6 pt-1">
                        <Skeleton className="h-5 w-12 rounded-full" />
                        <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

Skeleton.Card = SkeletonCard;

export default Skeleton;