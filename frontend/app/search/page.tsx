import { Suspense } from "react";
import SearchPage from "../../template-pages/SearchPage";

export const metadata = {
  title: "Search Plants – GreenLife Plant Paradise",
  description:
    "Search our full catalog of indoor plants, outdoor plants, bonsai, air purifiers and more.",
};

export default function SearchRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground text-sm">Loading search…</p>
          </div>
        </div>
      }
    >
      <SearchPage />
    </Suspense>
  );
}
