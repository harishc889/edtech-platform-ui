"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type TouchEvent,
  type ReactNode,
} from "react";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
  durationMs: number;
  actionLabel?: string;
  onAction?: () => void;
};

type ToastInput = {
  message: string;
  type?: ToastType;
  durationMs?: number;
  actionLabel?: string;
  onAction?: () => void;
};

type ToastContextValue = {
  showToast: (input: ToastInput) => void;
  dismissToast: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const [swipeX, setSwipeX] = useState(0);
  const touchStartX = useRef<number | null>(null);

  function toneClasses(type: ToastType) {
    if (type === "success") {
      return {
        card: "border-cyan-200/90 bg-white/95 text-slate-800 shadow-cyan-500/15",
        icon: "bg-cyan-600 text-white",
        rail: "from-cyan-500 via-sky-500 to-blue-600",
      };
    }
    if (type === "error") {
      return {
        card: "border-rose-200/90 bg-white/95 text-slate-800 shadow-rose-500/15",
        icon: "bg-rose-600 text-white",
        rail: "from-rose-500 via-orange-500 to-amber-500",
      };
    }
    return {
      card: "border-sky-200/90 bg-white/95 text-slate-800 shadow-sky-500/15",
      icon: "bg-sky-600 text-white",
      rail: "from-sky-500 via-cyan-500 to-blue-500",
    };
  }

  function typeLabel(type: ToastType) {
    if (type === "success") return "Success";
    if (type === "error") return "Attention";
    return "Info";
  }

  function icon(type: ToastType) {
    if (type === "success") return "✓";
    if (type === "error") return "!";
    return "i";
  }

  function handleTouchStart(e: TouchEvent<HTMLDivElement>) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const currentX = e.touches[0]?.clientX ?? touchStartX.current;
    const delta = currentX - touchStartX.current;
    if (Math.abs(delta) < 6) return;
    setSwipeX(delta);
  }

  function handleTouchEnd() {
    if (Math.abs(swipeX) > 70) {
      onDismiss();
    } else {
      setSwipeX(0);
    }
    touchStartX.current = null;
  }

  const cardStyle =
    swipeX === 0
      ? undefined
      : {
          transform: `translateX(${swipeX}px)`,
          opacity: Math.max(0.45, 1 - Math.min(Math.abs(swipeX) / 140, 0.55)),
        };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border p-3 shadow-2xl backdrop-blur transition-transform duration-150 ${toneClasses(toast.type).card} animate-toast-in`}
      style={cardStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${toneClasses(toast.type).icon}`}
          aria-hidden
        >
          {icon(toast.type)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
            {typeLabel(toast.type)}
          </p>
          <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">
            {toast.message}
          </p>
          {toast.actionLabel ? (
            <button
              type="button"
              className="mt-2 inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800"
              onClick={() => {
                toast.onAction?.();
                onDismiss();
              }}
            >
              {toast.actionLabel}
            </button>
          ) : null}
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          onClick={onDismiss}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
            <path
              fill="currentColor"
              d="M5.22 5.22a.75.75 0 011.06 0L10 8.94l3.72-3.72a.75.75 0 111.06 1.06L11.06 10l3.72 3.72a.75.75 0 11-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 01-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 010-1.06z"
            />
          </svg>
        </button>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200/80">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${toneClasses(toast.type).rail} animate-toast-progress`}
          style={{ animationDuration: `${toast.durationMs}ms` }}
        />
      </div>
    </div>
  );
}

function ToastViewport({
  items,
  onDismiss,
}: {
  items: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[80] flex w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 flex-col gap-3 sm:bottom-auto sm:left-auto sm:right-6 sm:top-6 sm:w-full sm:translate-x-0">
      {items.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Map<number, number>>(new Map());

  const dismissToast = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      message,
      type = "info",
      durationMs = 2400,
      actionLabel,
      onAction,
    }: ToastInput) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setItems((prev) => [
        ...prev.slice(-2),
        { id, message, type, durationMs, actionLabel, onAction },
      ]);

      const timerId = window.setTimeout(() => {
        dismissToast(id);
      }, durationMs);
      timers.current.set(id, timerId);
    },
    [dismissToast],
  );

  useEffect(() => {
    function onSessionInactive(event: Event) {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      const message =
        typeof detail?.message === "string" && detail.message.trim()
          ? detail.message
          : "Your session has expired. Please login again.";
      showToast({ type: "error", message, durationMs: 4200 });
    }

    window.addEventListener("auth:session-inactive", onSessionInactive as EventListener);
    return () => {
      window.removeEventListener(
        "auth:session-inactive",
        onSessionInactive as EventListener,
      );
    };
  }, [showToast]);

  useEffect(() => {
    return () => {
      for (const timer of timers.current.values()) {
        window.clearTimeout(timer);
      }
      timers.current.clear();
    };
  }, []);

  const value = useMemo(
    () => ({ showToast, dismissToast }),
    [showToast, dismissToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport items={items} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }
  return context;
}
