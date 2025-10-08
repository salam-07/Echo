import React from 'react';

const EchoCardSkeleton = () => {
    return (
        <div className="card bg-base-100 border border-base-300 mb-6">
            <div className="card-body p-6">
                {/* Header Skeleton: Username and Date */}
                <div className="flex justify-between items-start mb-4">
                    <div className="skeleton h-4 w-24"></div>
                    <div className="skeleton h-3 w-16"></div>
                </div>

                {/* Content Skeleton */}
                <div className="mb-4 space-y-2">
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-3/4"></div>
                    <div className="skeleton h-4 w-1/2"></div>
                </div>

                {/* Tags Skeleton */}
                <div className="flex gap-2 mb-4">
                    <div className="skeleton h-5 w-16 rounded-full"></div>
                    <div className="skeleton h-5 w-20 rounded-full"></div>
                </div>

                {/* Actions Skeleton */}
                <div className="flex items-center gap-4">
                    <div className="skeleton h-6 w-12"></div>
                    <div className="skeleton h-6 w-14"></div>
                </div>
            </div>
        </div>
    );
};

export default EchoCardSkeleton;