"use client";

import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  children?: React.ReactNode;
  /** Used when there is no history to go back to (e.g. direct visit). */
  fallbackHref?: string;
};

export default function BackNavLink({
  className,
  children = "← Back",
  fallbackHref = "/",
}: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
      className={className}
    >
      {children}
    </button>
  );
}
