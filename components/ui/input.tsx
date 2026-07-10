import { Calendar, Clock } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const isDate = type === "date" || type === "datetime-local";
    const isTime = type === "time";
    const isPicker = isDate || isTime;

    const inputClassName = cn(
      "flex h-10 w-full rounded-lg border border-[#2B2B2B] bg-[#151515] px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      isPicker && "picker-input relative pr-10",
      className,
    );

    if (!isPicker) {
      return (
        <input type={type} className={inputClassName} ref={ref} {...props} />
      );
    }

    return (
      <div className="relative">
        <input type={type} className={inputClassName} ref={ref} {...props} />
        {isDate ? (
          <Calendar
            className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-zinc-300"
            aria-hidden="true"
          />
        ) : (
          <Clock
            className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-zinc-300"
            aria-hidden="true"
          />
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
