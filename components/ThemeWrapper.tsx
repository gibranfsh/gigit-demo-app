"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function ThemeApplier({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const theme = searchParams.get("theme");

  useEffect(() => {
    if (theme === "b") {
      document.documentElement.classList.add("theme-b");
    } else {
      document.documentElement.classList.remove("theme-b");
    }

    return () => {
      document.documentElement.classList.remove("theme-b");
    };
  }, [theme]);

  return <>{children}</>;
}

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<>{children}</>}>
      <ThemeApplier>{children}</ThemeApplier>
    </Suspense>
  );
}
