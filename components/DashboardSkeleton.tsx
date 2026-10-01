"use client";

import { useTheme } from "@/lib/theme";

/**
 * DashboardSkeleton
 * ---------------------------------------------------------------------------
 * A static, theme-aware placeholder that mirrors the real dashboard layout
 * (sidebar, campaign ticket, billing grid, recent campaigns). Showing this
 * instead of a spinner means the dashboard "appears" immediately and the real
 * content simply replaces it, with no layout jump or colour flash.
 *
 * Reuse it anywhere the dashboard is loading, for example:
 *   app/dashboard/loading.tsx  ->  export default function Loading() {
 *                                    return <DashboardSkeleton />;
 *                                  }   (wrap in <ThemeProvider> if needed)
 * ---------------------------------------------------------------------------
 */

function Bar({ className = "", color }: { className?: string; color: string }) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{ background: color }}
    />
  );
}

export function DashboardSkeleton() {
  const { tokens } = useTheme();
  const { ink, panel, rule } = tokens;

  return (
    <div
      className="min-h-screen flex overflow-x-hidden"
      style={{ background: ink }}
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading your dashboard</span>

      {/* Sidebar (desktop only, same width as the real one) */}
      <aside
        className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 flex-col p-6"
        style={{ background: panel, borderRight: `1px solid ${rule}` }}
      >
        <div className="flex items-center justify-between">
          <Bar color={rule} className="w-8 h-8 rounded-lg" />
          <Bar color={rule} className="w-8 h-8 rounded-full" />
        </div>
        <Bar color={rule} className="h-3 w-28 rounded-full mt-6" />
        <div
          className="mt-6 pt-6 flex-1"
          style={{ borderTop: `1px solid ${rule}` }}
        >
          <Bar color={rule} className="h-11 w-full rounded-xl" />
        </div>
        <Bar color={rule} className="h-12 w-full rounded-xl" />
      </aside>

      <main className="flex-1 lg:ml-64 min-w-0">
        {/* Mobile header */}
        <div
          className="lg:hidden flex items-center justify-between p-4"
          style={{ borderBottom: `1px solid ${rule}` }}
        >
          <Bar color={rule} className="w-8 h-8 rounded-md" />
          <Bar color={rule} className="w-8 h-8 rounded-full" />
        </div>

        <div className="p-3 sm:p-6 md:p-10 max-w-6xl mx-auto space-y-10 sm:space-y-14 w-full">
          {/* Campaign ticket */}
          <section
            className="rounded-3xl overflow-hidden"
            style={{ background: panel, border: `1px solid ${rule}` }}
          >
            <div className="p-6 sm:p-9 pb-6 sm:pb-7 flex flex-col sm:flex-row justify-between items-start gap-6">
              <div className="space-y-3 w-full max-w-md">
                <Bar color={rule} className="h-3 w-40 rounded-full" />
                <Bar color={rule} className="h-9 w-full max-w-sm rounded-xl" />
                <Bar color={rule} className="h-9 w-2/3 rounded-xl" />
                <Bar color={rule} className="h-3 w-3/4 rounded-full mt-4" />
              </div>
              <Bar
                color={rule}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full shrink-0"
              />
            </div>

            <div
              className="mx-8 sm:mx-10"
              style={{ borderTop: `2px dashed ${rule}` }}
            />

            <div className="p-6 sm:p-9 pt-6 sm:pt-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-3">
                  <Bar color={rule} className="h-3 w-44 rounded-full" />
                  <Bar color={rule} className="h-9 w-full rounded-lg" />
                  <Bar color={rule} className="h-9 w-full rounded-lg" />
                  <Bar color={rule} className="h-9 w-full rounded-lg" />
                </div>
                <Bar
                  color={rule}
                  className="min-h-[132px] sm:min-h-[152px] w-full rounded-2xl"
                />
              </div>
              <Bar color={rule} className="h-[52px] w-full sm:w-52 rounded-full mt-6" />
            </div>
          </section>

          {/* Plan & billing */}
          <section
            className="rounded-2xl overflow-hidden"
            style={{ background: panel, border: `1px solid ${rule}` }}
          >
            <div className="p-5 sm:p-6" style={{ borderBottom: `1px solid ${rule}` }}>
              <Bar color={rule} className="h-3 w-32 rounded-full" />
              <Bar color={rule} className="h-6 w-56 rounded-lg mt-3" />
              <Bar color={rule} className="h-3 w-full max-w-lg rounded-full mt-3" />
            </div>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px"
              style={{ background: rule }}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="p-5 sm:p-6 min-h-[128px]"
                  style={{ background: panel }}
                >
                  <Bar color={rule} className="h-3 w-24 rounded-full" />
                  <Bar color={rule} className="h-7 w-32 rounded-lg mt-3" />
                  <Bar color={rule} className="h-3 w-40 rounded-full mt-2" />
                </div>
              ))}
            </div>
          </section>

          {/* Recent campaigns */}
          <section>
            <Bar color={rule} className="h-6 w-48 rounded-lg mb-4 sm:mb-5" />
            <div className="grid grid-cols-2 min-[400px]:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Bar color={panel} className="aspect-[4/5] rounded-xl" />
                  <Bar color={panel} className="h-3 w-3/4 rounded-full" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}