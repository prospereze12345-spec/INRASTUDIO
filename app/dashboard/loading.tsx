import { ThemeProvider } from "@/lib/theme";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";

export default function Loading() {
  return (
    <ThemeProvider>
      <DashboardSkeleton />
    </ThemeProvider>
  );
}