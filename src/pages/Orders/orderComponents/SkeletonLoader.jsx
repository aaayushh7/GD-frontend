// src/components/SkeletonLoader.jsx
import React from 'react';

export const SkeletonLoader = ({ width = "w-full", height = "h-4" }) => (
  <div className={`${width} ${height} bg-gray-200 rounded animate-pulse`}></div>
);

export const OrderItemSkeleton = () => (
  <div className="flex items-center justify-between py-2 border-b border-gray-300">
    <div className="flex items-center space-x-4">
      <SkeletonLoader width="w-16" height="h-16" />
      <div>
        <SkeletonLoader width="w-32" />
        <SkeletonLoader width="w-20" height="h-3" />
      </div>
    </div>
    <div className="text-right">
      <SkeletonLoader width="w-20" />
      <SkeletonLoader width="w-24" height="h-3" />
    </div>
  </div>
);