import React from 'react';

export function SkeletonPulse({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg ${className}`} />
  );
}

// Blog Card Skeleton for Article grids
export function BlogCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border-custom bg-white p-6 shadow-xs animate-pulse space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <SkeletonPulse className="h-5 w-24 rounded-md" />
          <SkeletonPulse className="h-4 w-16 rounded-md" />
        </div>
        <SkeletonPulse className="h-6 w-5/6 rounded-lg" />
        <SkeletonPulse className="h-4 w-full rounded-md" />
        <SkeletonPulse className="h-4 w-4/5 rounded-md" />
      </div>
      <div className="pt-4 border-t border-border-custom/50 flex items-center justify-between">
        <SkeletonPulse className="h-4 w-28 rounded-md" />
        <SkeletonPulse className="h-4 w-20 rounded-md" />
      </div>
    </div>
  );
}

export function BlogCardSkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Calculator Card Skeleton for Homepage & Search
export function CalculatorCardSkeleton() {
  return (
    <div className="bg-white border border-border-custom rounded-2xl p-6 shadow-xs flex flex-col justify-between animate-pulse space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <SkeletonPulse className="h-10 w-10 rounded-xl" />
          <SkeletonPulse className="h-4 w-16 rounded-md" />
        </div>
        <SkeletonPulse className="h-5 w-3/4 rounded-lg" />
        <SkeletonPulse className="h-4 w-full rounded-md" />
        <SkeletonPulse className="h-4 w-2/3 rounded-md" />
      </div>
      <SkeletonPulse className="h-10 w-full rounded-xl mt-4" />
    </div>
  );
}

export function CalculatorCardSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CalculatorCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Full Calculator Skeleton View
export function CalculatorSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-pulse p-4 sm:p-6">
      {/* Header Skeleton */}
      <div className="space-y-3 max-w-3xl">
        <SkeletonPulse className="h-5 w-32 rounded-full" />
        <SkeletonPulse className="h-9 w-3/4 rounded-xl" />
        <SkeletonPulse className="h-4 w-full rounded-md" />
      </div>

      {/* Main 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column Inputs */}
        <div className="lg:col-span-5 bg-white border border-border-custom rounded-2xl p-6 space-y-6">
          <SkeletonPulse className="h-6 w-40 rounded-lg" />
          <div className="space-y-4">
            <SkeletonPulse className="h-4 w-28 rounded-md" />
            <SkeletonPulse className="h-12 w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <SkeletonPulse className="h-4 w-32 rounded-md" />
            <SkeletonPulse className="h-12 w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <SkeletonPulse className="h-4 w-24 rounded-md" />
            <SkeletonPulse className="h-12 w-full rounded-xl" />
          </div>
        </div>

        {/* Right Column Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Primary Result Card (Wine gradient skeleton) */}
          <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[#8B1A34] via-[#6D1026] to-[#4F0B1B] space-y-4 border border-white/20 shadow-lg">
            <SkeletonPulse className="h-4 w-48 rounded-md bg-white/20" />
            <SkeletonPulse className="h-10 w-3/4 rounded-xl bg-white/20" />
            <div className="pt-4 border-t border-white/15 grid grid-cols-3 gap-4">
              <SkeletonPulse className="h-10 w-full rounded-lg bg-white/20" />
              <SkeletonPulse className="h-10 w-full rounded-lg bg-white/20" />
              <SkeletonPulse className="h-10 w-full rounded-lg bg-white/20" />
            </div>
          </div>

          {/* Breakdown cards skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <SkeletonPulse className="h-24 w-full rounded-2xl" />
            <SkeletonPulse className="h-24 w-full rounded-2xl" />
          </div>

          {/* Chart Area Skeleton */}
          <div className="bg-white border border-border-custom rounded-2xl p-6 space-y-4">
            <SkeletonPulse className="h-6 w-48 rounded-lg" />
            <SkeletonPulse className="h-56 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Full Article Skeleton View
export function BlogPostSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-pulse p-4 sm:p-6">
      <SkeletonPulse className="h-4 w-28 rounded-md" />
      <div className="space-y-4">
        <SkeletonPulse className="h-6 w-32 rounded-full" />
        <SkeletonPulse className="h-10 w-4/5 rounded-xl" />
        <div className="flex gap-4">
          <SkeletonPulse className="h-4 w-24 rounded-md" />
          <SkeletonPulse className="h-4 w-24 rounded-md" />
        </div>
      </div>
      <SkeletonPulse className="h-64 w-full rounded-2xl" />
      <div className="space-y-3">
        <SkeletonPulse className="h-4 w-full rounded-md" />
        <SkeletonPulse className="h-4 w-full rounded-md" />
        <SkeletonPulse className="h-4 w-3/4 rounded-md" />
      </div>
    </div>
  );
}
